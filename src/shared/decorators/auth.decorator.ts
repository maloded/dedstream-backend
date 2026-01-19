import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.quard';

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard));
}
