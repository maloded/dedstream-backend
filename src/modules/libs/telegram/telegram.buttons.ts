import { Markup } from 'telegraf';

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('My followings', 'follows'),
			Markup.button.callback('Visit profile', 'me'),
		],
		[Markup.button.url('On site', 'https://dedstream.ua')],
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'Profile settings',
			'https://dedstream.ua/dashboard/settings',
		),
	]),
};
