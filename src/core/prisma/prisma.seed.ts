import 'dotenv/config';
import { PrismaClient } from '../../../prisma/generated/client';
import { BadRequestException, Logger } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.POSTGRES_URI!,
	}),
});

async function main() {
	try {
		Logger.log('Connecting to database...');
		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		]);
		Logger.log('Database connected and cleaned');
		const categoriesData = [
			{
				title: 'Technology',
				slug: 'technology',
				description:
					'Latest news, trends, and innovations in technology.',
				thumbnailUrl: '/categories/technology.webp',
			},
			{
				title: 'Programming',
				slug: 'programming',
				description:
					'Code, frameworks, best practices, and software development.',
				thumbnailUrl: '/categories/programming.webp',
			},
			{
				title: 'Artificial Intelligence',
				slug: 'artificial-intelligence',
				description:
					'AI, machine learning, neural networks, and automation.',
				thumbnailUrl: '/categories/ai.webp',
			},
			{
				title: 'Startups',
				slug: 'startups',
				description:
					'Startup culture, ideas, funding, and growth stories.',
				thumbnailUrl: '/categories/startups.webp',
			},
			{
				title: 'Gaming',
				slug: 'gaming',
				description:
					'Video games, esports, reviews, and gaming culture.',
				thumbnailUrl: '/categories/gaming.webp',
			},
			{
				title: 'Streaming',
				slug: 'streaming',
				description:
					'Live streaming, content creators, platforms, and trends.',
				thumbnailUrl: '/categories/streaming.webp',
			},
			{
				title: 'Design',
				slug: 'design',
				description:
					'UI/UX, graphic design, inspiration, and creative work.',
				thumbnailUrl: '/categories/design.webp',
			},
			{
				title: 'Education',
				slug: 'education',
				description:
					'Learning resources, tutorials, and self-improvement.',
				thumbnailUrl: '/categories/education.webp',
			},
			{
				title: 'Science',
				slug: 'science',
				description: 'Discoveries, research, and how the world works.',
				thumbnailUrl: '/categories/science.webp',
			},
			{
				title: 'Business',
				slug: 'business',
				description:
					'Entrepreneurship, management, and business strategies.',
				thumbnailUrl: '/categories/business.webp',
			},
			{
				title: 'Lifestyle',
				slug: 'lifestyle',
				description:
					'Daily life, habits, productivity, and personal growth.',
				thumbnailUrl: '/categories/lifestyle.webp',
			},
			{
				title: 'Entertainment',
				slug: 'entertainment',
				description: 'Movies, music, shows, and pop culture.',
				thumbnailUrl: '/categories/entertainment.webp',
			},
		];

		await prisma.category.createMany({
			data: categoriesData,
		});
		Logger.log('Categories seeded successfully');
		const categories = await prisma.category.findMany();

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category]),
		);

		const streamTitles: Record<string, string[]> = {
			technology: [
				'Future of Tech: What’s Next?',
				'Top Gadgets You Should Know About',
				'Tech News Weekly',
				'Building Smart Devices Live',
				'How Technology Changes Our Lives',
			],

			programming: [
				'Live Coding: Building a REST API',
				'Fixing Bugs in Real Time',
				'TypeScript vs JavaScript — Live Discussion',
				'Refactoring Legacy Code',
				'NestJS + Prisma From Scratch',
			],

			'artificial-intelligence': [
				'AI Explained for Beginners',
				'Training a Neural Network Live',
				'ChatGPT and the Future of Work',
				'Machine Learning Mistakes to Avoid',
				'Can AI Replace Developers?',
			],

			startups: [
				'Building a Startup From Zero',
				'How to Pitch Your Idea to Investors',
				'Startup Failures and Lessons Learned',
				'From Idea to MVP',
				'Growth Hacks That Actually Work',
			],

			gaming: [
				'Let’s Play: New Game Release',
				'Ranked Matches — Road to Top Tier',
				'Chill Gaming Stream',
				'Speedrun Attempts Live',
				'Best Games of This Year',
			],

			streaming: [
				'Streaming Setup: Camera, Mic, Light',
				'Growing Your Channel From Zero',
				'Live Q&A With Streamers',
				'How to Monetize Your Streams',
				'Behind the Scenes of Streaming',
			],

			design: [
				'UI/UX Design Live Review',
				'Redesigning a Landing Page',
				'Figma Tips and Tricks',
				'Designing a Mobile App From Scratch',
				'Common Design Mistakes',
			],

			education: [
				'Learning to Code — Day 1',
				'Study With Me: Pomodoro Session',
				'How to Learn Faster',
				'Best Online Resources for Developers',
				'Roadmap to Becoming a Developer',
			],

			science: [
				'Space Discoveries Explained',
				'Physics Experiments Live',
				'How the Brain Works',
				'Science News This Week',
				'Mind-Blowing Scientific Facts',
			],

			business: [
				'Building a Personal Brand',
				'How to Make Money Online',
				'Business Mistakes Beginners Make',
				'Marketing Strategies That Work',
				'Scaling a Small Business',
			],

			lifestyle: [
				'Morning Routine for Productivity',
				'Healthy Habits Live Talk',
				'Balancing Work and Life',
				'Minimalism and Focus',
				'Improving Daily Discipline',
			],

			entertainment: [
				'Movie Reviews Live',
				'Reacting to New Trailers',
				'Music Chill Stream',
				'Top Series to Watch',
				'Pop Culture News',
			],
		};

		const usernames: string[] = [
			'ded',
			'neo',
			'pixel',
			'void',
			'shadow',
			'flux',
			'orbit',
			'echo',
			'nova',
			'blaze',
			'vortex',
			'byte',
			'glitch',
			'spark',
			'raven',
			'ghost',
			'storm',
			'zen',
			'frost',
			'lunar',
			'atlas',
			'drift',
			'comet',
			'cipher',
			'omega',
			'pulse',
			'static',
			'ember',
			'cosmo',
			'nexus',
		];

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length,
							)
						]
					];

				const userExists = await tx.user.findUnique({
					where: { username },
				});

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@dedstream.com`,
							password: await hash('87654321'),
							username,
							displayName:
								username.charAt(0).toUpperCase() +
								username.slice(1),
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Twitter',
											url: `https://twitter.com/${username}`,
											position: 1,
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/${username}`,
											position: 2,
										},
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 3,
										},
									],
								},
							},
							notificationSettings: {
								create: {},
							},
						},
					});

					const randomTitles = streamTitles[randomCategory.slug];
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						];

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${createdUser.username}.webp`,
							user: {
								connect: {
									id: createdUser.id,
								},
							},
							category: {
								connect: {
									id: randomCategory.id,
								},
							},
						},
					});
					Logger.log(
						`User ${createdUser.username} created with a stream in category ${randomCategory.title}`,
					);
				}
			}
		});

		Logger.log('Users and streams seeded successfully');
	} catch (error) {
		Logger.log(error);
		throw new BadRequestException('Seeding failed');
	} finally {
		Logger.log('Seeding finished');
		await prisma.$disconnect();
		Logger.log('Disconnected from database');
	}
}
main().catch(error => {
	console.error('Seeding failed:', error);
	process.exit(1);
});
