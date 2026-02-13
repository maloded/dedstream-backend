import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { StripeService } from '../../libs/stripe/stripe.service';
import type { User } from '@/prisma/generated/client';
import { CreatePlanInput } from './inputs/create-plan.input';

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService,
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id,
			},
		});

		return plans;
	}

	public async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input;

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!channel?.isVerified) {
			throw new ForbiddenException(
				'Plan creation is only allowed for verified channels',
			);
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'uah',
			interval: 'month',
			product: {
				name: title,
			},
		});

		const productId =
			typeof stripePlan.product === 'string'
				? stripePlan.product
				: stripePlan.product?.id;

		if (!productId) {
			throw new Error('Stripe product ID is missing');
		}

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: productId,
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return true;
	}

	public async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId,
			},
		});

		if (!plan) {
			throw new NotFoundException('Plan is not found');
		}

		await this.stripeService.plans.del(plan.stripePlanId);
		await this.stripeService.products.del(plan.stripeProductId);

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id,
			},
		});

		return true;
	}
}
