import type { User } from '@/prisma/generated/client';
import type { Request } from 'express';
import type { SessionMetadata } from '../types/session-metadata.types';
import { InternalServerErrorException } from '@nestjs/common';

export function saveSession(
	req: Request,
	user: User,
	metadata: SessionMetadata,
) {
	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date();
		req.session.userId = user.id;
		req.session.metadata = metadata;
		req.session.save(err => {
			if (err) {
				return reject(
					new InternalServerErrorException('Could not save session'),
				);
			}
			resolve(user);
		});
	});
}

export function destroySession(req: Request) {
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
