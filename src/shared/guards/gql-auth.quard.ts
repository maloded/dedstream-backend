import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

export interface GqlContext {
	req: Request & {
		session?: {
			userId?: string;
		};
		user?: unknown;
	};
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext<GqlContext>().req;

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('User not authenticated');
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId },
		});

		request.user = user;

		return true;
	}
}
