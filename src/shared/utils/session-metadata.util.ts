import { Request } from 'express';
import { lookup } from 'geoip-lite';
import { SessionMetadata } from '../types/session-metadata.types';
// eslint-disable-next-line
import DeviceDetector = require('device-detector-js');
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { IS_DEV_ENV } from './is-dev.util';

countries.registerLocale(enLocale);

export function getSessionMetadata(
	req: Request,
	userAgent: string,
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '63.116.61.253'
		: Array.isArray(req.headers['cf-connection-ip'])
			? req.headers['cf-connection-ip'][0]
			: req.headers['cf-connection-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip);
	const safeIp = ip ?? '127.0.0.1';
	const location = lookup(safeIp);

	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country: location?.country
				? (countries.getName(location.country, 'en') ?? 'Unknown')
				: 'Unknown',
			city: location?.city || 'Unknown',
			latitude: location?.ll ? location.ll[0] : 0,
			longitude: location?.ll ? location.ll[1] : 0,
		},
		device: {
			browser: device.client?.name || 'Unknown',
			os: device.os?.name || 'Unknown',
			type: device.device?.type || 'Unknown',
		},
		ip: safeIp,
	};
}
