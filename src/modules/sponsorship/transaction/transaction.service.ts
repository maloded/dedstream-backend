import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../../libs/stripe/stripe.service';
import type { User } from '@/prisma/generated/client';

@Injectable()
export class TransactionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly stripeService: StripeService,
	) {}

	public async findMyTransactions(user: User) {
		const transactions = await this.prismaService.transaction.findMany({
			where: {
				userId: user.id,
			},
		});

		return transactions;
	}

	public async makePayment(user: User, planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId,
			},
			include: {
				channel: true,
			},
		});

		if (!plan) {
			throw new NotFoundException('Plan is not found');
		}

		if (user.id === plan.channelId) {
			throw new ConflictException(
				'You cannot make transaction on yourself',
			);
		}

		const existingSubscription =
			await this.prismaService.sponsorshipSubscription.findFirst({
				where: {
					userId: user.id,
					channelId: plan.channelId,
				},
			});

		if (existingSubscription) {
			throw new ConflictException(
				'A sponsorship for this channel already exists',
			);
		}

		if (!plan.channel) {
			throw new NotFoundException('Channel not found');
		}

		const customer = await this.stripeService.customers.create({
			name: user.username,
			email: user.email,
		});

		const session = await this.stripeService.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'uah',
						product_data: {
							name: plan.title,
						},
						unit_amount: Math.round(plan.price * 100),
						recurring: {
							interval: 'month',
						},
					},
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${plan.price}&username=${plan.channel?.username}`,
			cancel_url: this.configService.getOrThrow<string>('ALLOWED_ORIGIN'),
			customer: customer.id,
			metadata: {
				planId: plan.id,
				userId: user.id,
				channelId: plan.channel.id,
			},
		});

		await this.prismaService.transaction.create({
			data: {
				amount: plan.price,
				currency: session.currency ?? 'uah',
				stripeSubscriptionId: session.id,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return { url: session.url };
	}
}
