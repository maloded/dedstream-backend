import { ConfigService } from '@nestjs/config';
import type { TelegrafModuleOptions } from 'nestjs-telegraf';

export function getTelegrafConfig(
        ConfigService: ConfigService,
): TelegrafModuleOptions {
        return {
                token: ConfigService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
                launchOptions: false,
        };
}
