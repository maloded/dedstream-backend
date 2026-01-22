import { TokenType, type User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	IsUUID: boolean = false,
) {
	let token: string;
	if (IsUUID) {
		token = uuidv4();
	} else {
		token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000,
		).toString();
	}

	const expiresIn = new Date(new Date().getTime() + 15 * 60 * 1000);

	const existentToken = await prismaService.token.findFirst({
		where: {
			type,
			user: {
				id: user.id,
			},
		},
	});

	if (existentToken) {
		await prismaService.token.delete({
			where: {
				id: existentToken.id,
			},
		});
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: {
					id: user.id,
				},
			},
		},
		include: {
			user: true,
		},
	});

	return newToken;
}
