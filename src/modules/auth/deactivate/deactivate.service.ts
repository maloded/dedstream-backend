import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
// import { MailService } from '../../libs/mail/mail.service';
import { Request, Response } from 'express';
import { TokenType } from '@/prisma/generated/enums';
import { destroySession } from '@/src/shared/utils/session.util';
import type { User } from '@/prisma/generated/client';
import { generateToken } from '@/src/shared/utils/generate-token-util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { verify } from 'argon2';
import { TelegramService } from '../../libs/telegram/telegram.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeactivateService {
	constructor(
		private readonly prismaService: PrismaService,
		// private readonly mailService: MailService,
		private readonly telegramService: TelegramService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {}

	public async deactivate(
		req: Request,
		res: Response,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string,
	) {
		const { email, password, pin } = input;

		if (user.email !== email) {
			throw new BadRequestException('Email does not match');
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new BadRequestException('Password is incorrect');
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent);
			return { message: 'Deactivation token sent to your email' };
		}

		await this.validateDeactivateToken(req, res, pin);

		return { user };
	}

	private async validateDeactivateToken(
		req: Request,
		res: Response,
		token: string,
	) {
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.DEACTIVATE_ACCOUNT },
			include: { user: true },
		});

		if (!existingToken?.userId) {
			throw new NotFoundException('Token not found');
		}

		const hasExpired = existingToken.expiresIn < new Date();

		if (hasExpired) {
			throw new BadRequestException('Deactivation token has expired');
		}

		const user = await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: {
				isDeactivated: true,
				deactivatedAt: new Date(),
			},
		});

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT },
		});

		await this.clearSessions(user.id);

		res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

		return destroySession(req);
	}

	private async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string,
	) {
		const deactivateToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false,
		);

		const metadata = getSessionMetadata(req, userAgent);

		// await this.mailService.sendDeactivateToken(
		// 	user.email,
		// 	deactivateToken.token,
		// 	metadata,
		// );

		if (
			deactivateToken.user?.notificationSettings?.telegramNotifications &&
			deactivateToken.user.telegramId
		) {
			await this.telegramService.sendDeactivateToken(
				deactivateToken.user.telegramId,
				deactivateToken.token,
				metadata,
			);
		}

		return true;
	}

	private async clearSessions(userId: string) {
		const keys = await this.redisService.client.keys('*');
		for (const key of keys) {
			const sessionData = await this.redisService.client.get(key);
			if (!sessionData) continue;

			const session = JSON.parse(sessionData);
			if (session.userId === userId) {
				await this.redisService.del(key);
			}
		}
	}
}
