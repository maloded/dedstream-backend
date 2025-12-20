import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisService extends Redis {
// 	public constructor(private readonly configService: ConfigService) {
// 		super(configService.getOrThrow<string>('REDIS_URL'));
// 		this.on('connect', () => console.log('✅ Redis connected'));
// 		this.on('error', err => console.error('❌ Redis error', err));
// 	}
// }
@Injectable()
export class RedisService {
	public client: RedisClientType;

	constructor(private readonly configService: ConfigService) {
		const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		this.client = createClient({ url: redisUrl });
		// eslint-disable-next-line
		this.client.on('connect', () => console.log('✅ Redis connected'));
		// eslint-disable-next-line
		this.client.on('error', (err: unknown) =>
			console.error(
				'❌ Redis error',
				err instanceof Error ? err.message : err,
			),
		);

		// подключение
		// eslint-disable-next-line
		this.client.connect().catch((err: unknown) => {
			console.error(
				'❌ Redis connection failed',
				err instanceof Error ? err.message : err,
			);
		});
	}
}
