import type { SponsorshipPlan, User } from '@/prisma/generated/client';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
	welcome:
		`<b>👋 Welcome to Dedstream Bot!</b>\n\n` +
		`To receive notifications and get the best experience on the platform, ` +
		`please link your Telegram account with Dedstream.\n\n` +
		`Tap the button below and go to the <b>Notifications</b> section to complete the setup.`,

	authSuccess:
		`🎉 You have successfully authorized!\n\n` +
		`Your Telegram account is now linked to <b>Dedstream</b>.`,

	invalidToken: `❌ Invalid or expired token.`,
	profile: (user: User, followersCount: number) =>
		`<b>👤 User Profile</b>\n\n` +
		`👤 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Followers: <b>${followersCount}</b>\n` +
		`📝 Bio: <b>${user.bio || 'Not provided'}</b>\n\n` +
		`⚙️ Tap the button below to open profile settings.`,
	follows: (user: User) =>
		`<a href="https://dedstream.ua/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Password Reset</b>\n\n` +
		`You requested a password reset for your account on the <b>DedStream</b> platform.\n\n` +
		`To create a new password, please follow the link below:\n\n` +
		`<b><a href="https://dedstream.ua/account/recovery/${token}">Reset password</a></b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`💻 <b>Request information:</b>\n\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`🖥 <b>Operating system:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`📡 <b>IP address:</b> ${metadata.ip}\n\n` +
		`If you did not make this request, simply ignore this message.\n\n` +
		`Thank you for using <b>DedStream</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Account Deactivation Request</b>\n\n` +
		`You have initiated the account deactivation process on the <b>DedStream</b> platform.\n\n` +
		`To complete this operation, please confirm your request by entering the following confirmation code:\n\n` +
		`<b>Confirmation code: ${token}</b>\n\n` +
		`📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`💻 <b>Request information:</b>\n\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`🖥 <b>Operating system:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`📡 <b>IP address:</b> ${metadata.ip}\n\n` +
		`<b>What will happen after deactivation?</b>\n\n` +
		`1. You will be automatically logged out and lose access to your account.\n\n` +
		`2. If you do not cancel the deactivation within 7 days, your account will be ` +
		`<b>permanently deleted</b> along with all your information, data, and subscriptions.\n\n` +
		`<b>⏳ Please note:</b> If you change your mind within 7 days, you may contact our support team ` +
		`to restore access to your account before it is permanently deleted.\n\n` +
		`After the account is deleted, recovery will be impossible, and all data will be lost permanently.\n\n` +
		`Kind regards,\n` +
		`DedStream Team`,
	accountDeleted: () =>
		`<b>⚠️ Your account has been permanently deleted.</b>\n\n` +
		`Your DedStream account has been completely erased from our database. ` +
		`All your data and information have been permanently deleted. ❌\n\n` +
		`🔒 You will no longer receive notifications via Telegram or email.\n\n` +
		`If you decide to return to the platform, you can register again using the link below:\n\n` +
		`<b><a href="https://dedstream.ua/account/create">Register on DedStream</a></b>\n\n` +
		`Thank you for being with us! We will always be happy to see you on our platform. 🚀\n\n` +
		`Kind regards,\n` +
		`DedStream Team`,
	streamStart: (channel: User) =>
		`<b>Channel ${channel.displayName} started stream!</b>\n\n` +
		`Watch here: <a> href="https://dedstream.ua/${channel.username}">Visit stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>You have new follower!</b>\n\nThis is user <a href="https://dedstream.ua/${follower.username}">` +
		`${follower.displayName}</a>\n\nFollowers count: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 New Sponsorship!</b>\n\n` +
		`You have received a new sponsorship for the <b>${plan.title}</b> plan.\n` +
		`💰 Amount: <b>${plan.price} ₴</b>\n` +
		`👤 Sponsor: <a href="https://dedstream.com/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>\n\n` +
		`Thank you for your work and for being part of Dedstream!`,
};
