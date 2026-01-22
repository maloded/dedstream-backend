import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request } from 'express';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly verificationService: VerificationService,
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId;
		if (!userId) {
			throw new UnauthorizedException('No active session found');
		}

		const keys = await this.redisService.client.keys('*');
		const userSessions: Array<any> = [];
		for (const key of keys) {
			const sessionData = await this.redisService.client.get(key);
			if (!sessionData) continue;

			const session = JSON.parse(sessionData);
			if (session.userId === userId) {
				userSessions.push({
					...session,
					id: key.split(':')[1],
				});
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt);
		// eslint-disable-next-line
		return userSessions.filter(session => session.id !== req.session.id);
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id;

		const sessionData = await this.redisService.client.get(
			`${this.configService.getOrThrow<string>('REDIS_SESSION_PREFIX')}${sessionId}`,
		);

		const session = sessionData ? JSON.parse(sessionData) : null;
		if (!session) {
			throw new UnauthorizedException('No active session found');
		}
		// eslint-disable-next-line
		return {
			...session,
			id: sessionId,
		};
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
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

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user);
			throw new BadRequestException(
				'Email not verified. Verification email sent.',
			);
		}

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata);
	}

	public async logout(req: Request) {
		return destroySession(req);
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new UnauthorizedException(
				'Cannot remove current active session',
			);
		}

		await this.redisService.client.del(
			`${this.configService.getOrThrow<string>('REDIS_SESSION_PREFIX')}${id}`,
		);
		return true;
	}
}
