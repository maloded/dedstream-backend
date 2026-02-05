import {
	BadRequestException,
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookLivekit(
		@Body() body: string,
		@Headers('Authorization') authorization: string,
	) {
		if (!authorization) {
			throw new BadRequestException('Authorization header is missing');
		}
		return await this.webhookService.receiveWebhookLivekit(
			body,
			authorization,
		);
	}
}
