import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerificationTemplate } from './templates/verification.template';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { DeactivateTemplate } from './templates/deactivate.template';
import { AccountDeletionTemplate } from './templates/account-deletion.template';
import { EnableTwoFactorTemplate } from './templates/enable-two-factor.template';
import { ChannelVerifiedTemplate } from './templates/verify-channel-templante';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
		const html = await render(VerificationTemplate({ domain, token }));

		return this.sendMail(email, 'Verify your email address', html);
	}

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata }),
		);

		return this.sendMail(email, 'Reset your password', html);
	}

	public async sendDeactivateToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	) {
		const html = await render(DeactivateTemplate({ token, metadata }));

		return this.sendMail(email, 'Deactivate your account', html);
	}

	public async sendAccountDeletion(email: string) {
		const html = await render(AccountDeletionTemplate());

		return this.sendMail(email, 'Account was deleted', html);
	}

	public async sendEnableTwoFactor(email: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
		const html = await render(EnableTwoFactorTemplate({ domain }));

		return this.sendMail(email, 'Secure your account', html);
	}

	public async sendVerifyChannel(email: string) {
		const html = await render(ChannelVerifiedTemplate());

		return this.sendMail(email, 'Account was verified', html);
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
