import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import sessionPkg from 'express-session';
import { RedisStore } from 'connect-redis';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ms, type StringValue } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.unit';
import { RedisService } from './core/redis/redis.service';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	const config = app.get(ConfigService);
	const session = sessionPkg as unknown as (
		options?: sessionPkg.SessionOptions,
	) => any;
	const redis = app.get(RedisService);

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
	app.use(
		config.getOrThrow<string>('GRAPHQL_PREFIX'),
		graphqlUploadExpress(),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				// domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY'),
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE'),
				),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis.client,
				prefix: config.getOrThrow<string>('REDIS_SESSION_PREFIX'),
			}),
		}),
	);

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	});

	await app.listen(config.getOrThrow<number>('APP_PORT') ?? 3000);
}
void bootstrap();
