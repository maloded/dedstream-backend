import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import {
	BadRequestException,
	Injectable,
	NotAcceptableException,
	NotFoundException,
} from '@nestjs/common';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { Request } from 'express';
import { generateToken } from '@/src/shared/utils/generate-token-util';
import { TokenType } from '@/prisma/generated/enums';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailerService: MailerService,
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string,
	) {
		const { email } = input;

		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new NotAcceptableException(
				'User with this email does not exist',
			);
		}

		// const resetToken =
		await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET,
			true,
		);

		getSessionMetadata(req, userAgent);

		// await this.mailerService.sendPasswordResetToken(
		// 	user.email,
		// 	resetToken,
		// 	metadata,
		// );

		return true;
	}

	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input;

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET,
			},
		});

		if (!existingToken?.userId) {
			throw new NotFoundException('Invalid or expired token');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException('Token has expired');
		}

		await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: { password: await hash(password) },
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET,
			},
		});

		return true;
	}
}
