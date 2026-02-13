import {
	NotificationType,
	type SponsorshipPlan,
	TokenType,
	type User,
} from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';
import { generateToken } from '@/src/shared/utils/generate-token-util';

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id,
			},
		});

		return count;
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id,
			},
			data: {
				isRead: true,
			},
		});

		const notification = await this.prismaService.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return notification;
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Don't skip!</b>
                <p>Join stream on channel <a href='/$${channel.username}' className='font-semibold'>
                ${channel.displayName}</a>.</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have new following!</b>
                <p>This is a user <a href='/$${follower.username}' className='font-semibold'>
                ${follower.displayName}</a>.</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User,
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b class="font-medium">🎉 You have a new sponsor!</b>
				<p>User <a href="/${sponsor.username}" class="font-semibold">${sponsor.displayName}</a> has become your sponsor by selecting the <strong>${plan.title}</strong> plan.</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationSettingsInput,
	) {
		const { siteNotifications, telegramNotifications } = input;

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id,
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id,
						},
					},
				},
				update: {
					siteNotifications,
					telegramNotifications,
				},
				include: {
					user: true,
				},
			});

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user?.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH as TokenType,
				true,
			);

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token,
			};
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user?.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id,
				},
				data: {
					telegramId: null,
				},
			});

			return {
				notificationSettings,
			};
		}

		return { notificationSettings };
	}
}
