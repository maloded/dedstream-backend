import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request } from 'express';

@Injectable()
export class SessionService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async login(req: Request, input: LoginInput) {
		const { login, password } = input;

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } },
				],
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isPasswordValid = await verify(user.password, password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date();
			req.session.userId = user.id;
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Could not save session',
						),
					);
				}
				resolve(user);
			});
		});
	}

	public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Could not destroy session',
						),
					);
				}

				resolve(true);
			});
		});
	}
}
