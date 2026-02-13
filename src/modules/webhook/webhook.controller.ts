import {
	BadRequestException,
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException,
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

	@Post('stripe')
	@HttpCode(HttpStatus.OK)
	public async receiveWebhookStripe(
		@RawBody() rawBody: string,
		@Headers('stripe-signature') sig: string,
	) {
		if (!sig) {
			throw new UnauthorizedException('No stripe sign in headers');
		}
		const event = this.webhookService.constructStripeEvent(rawBody, sig);

		await this.webhookService.receiveWebhookStripe(event);
	}
}
