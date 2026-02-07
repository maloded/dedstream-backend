import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FollowService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findMyFollowers(user: User) {
		const followers = await this.prismaService.follow.findMany({
			where: {
				followingId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				follower: true,
			},
		});

		return followers;
	}

	public async findMyFollowings(user: User) {
		const followings = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				following: true,
			},
		});

		return followings;
	}

	public async follow(user: User, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
			},
		});

		if (!channel) {
			throw new NotFoundException('Channel is not found');
		}

		if (channel.id === user.id) {
			throw new ConflictException('Following yourself is not allowed');
		}

		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followerId: user.id,
				followingId: channelId,
			},
		});

		if (existingFollow) {
			throw new ConflictException(
				'You are already following this channel',
			);
		}

		await this.prismaService.follow.create({
			data: {
				followerId: user.id,
				followingId: channelId,
			},
		});

		return true;
	}

	public async unfollow(user: User, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
			},
		});

		if (!channel) {
			throw new NotFoundException('Channel is not found');
		}

		if (channel.id === user.id) {
			throw new ConflictException('Unfollowing yourself is not allowed');
		}

		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followerId: user.id,
				followingId: channelId,
			},
		});

		if (!existingFollow) {
			throw new ConflictException('You are not following this channel');
		}

		await this.prismaService.follow.delete({
			where: {
				id: existingFollow.id,
				followerId: user.id,
				followingId: channelId,
			},
		});

		return true;
	}
}
