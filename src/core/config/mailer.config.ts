import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAILER_HOST'),
			port: configService.getOrThrow<number>('MAILER_PORT'),
			secure: configService.getOrThrow<boolean>('MAILER_SECURE'),
			auth: {
				user: configService.getOrThrow<string>('MAILER_USER'),
				pass: configService.getOrThrow<string>('MAILER_PASSWORD'),
			},
		},
		defaults: {
			from: `"DedStream" <configService.getOrThrow<string>('MAILER_USER')>`,
		},
	};
}
