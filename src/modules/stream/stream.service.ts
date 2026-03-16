import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { FiltersInput } from './inputs/filters.input';
import { Prisma, User } from '@/prisma/generated/client';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { StorageService } from '../libs/storage/storage.service';
import type { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import sharp from 'sharp';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService,
	) {}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm ? this.findBySearchTerm(searchTerm) : {};

		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false,
				},
				...whereClause,
			},
			include: {
				user: true,
				category: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return streams;
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false,
				},
			},
		});

		const randomIndexes = new Set<number>();
		while (randomIndexes.size < 4) {
			const randomIndex = Math.floor(Math.random() * total);
			randomIndexes.add(randomIndex);
		}

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false,
				},
			},
			include: {
				user: true,
				category: true,
			},
			skip: 0,
			take: total,
		});

		return Array.from(randomIndexes).map(index => streams[index]);
	}

	public async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input;

		if (!user) {
			throw new UnauthorizedException('User not authenticated');
		}

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				title,
				category: {
					connect: {
						id: categoryId,
					},
				},
			},
		});

		return true;
	}

	public async changeThumbnail(user: User, file: FileUpload) {
		const stream = await this.findByUserId(user);
		if (!stream) {
			throw new NotFoundException('Stream not found');
		}

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl);
		}

		const chunks: Buffer[] = [];

		for await (const chunk of file.createReadStream()) {
			// eslint-disable-next-line
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const fileName = `/streams/${user.username}.webp`;

		if (file.filename && file.filename.endsWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp',
			);
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp',
			);
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				thumbnailUrl: fileName,
			},
		});

		return true;
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user);
		if (!stream || !stream.thumbnailUrl) {
			return;
		}

		await this.storageService.remove(stream.thumbnailUrl);

		await this.prismaService.stream.update({
			where: {
				userId: user.id,
			},
			data: {
				thumbnailUrl: null,
			},
		});

		return true;
	}

	public async generateToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input;

		let self: { id: string; username: string };

		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});

		if (user) {
			self = { id: user.id, username: user.username };
		} else {
			self = {
				id: userId,
				username: `user_${userId.substring(0, 6)}`,
			};
		}

		const channel = await this.prismaService.user.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('Channel not found');
		}

		const isHost = self.id === channel.id;

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : `Viewer-${self.id}`,
				name: self.username,
			},
		);

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false,
		});

		return { token: token.toJwt() };
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: { userId: user.id },
		});

		return stream;
	}

	private findBySearchTerm(searchTerm: string): Prisma.StreamWhereInput {
		return {
			OR: [
				{ title: { contains: searchTerm, mode: 'insensitive' } },
				{
					user: {
						username: { contains: searchTerm, mode: 'insensitive' },
					},
				},
				{
					category: {
						title: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				},
			],
		};
	}
}
