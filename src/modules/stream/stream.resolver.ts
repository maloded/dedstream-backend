import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from './models/stream.model';
import { FiltersInput } from './inputs/filters.input';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { type User } from '@/prisma/generated/client';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { type FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';

@Resolver('Stream')
export class StreamResolver {
	public constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	public async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input);
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandom() {
		return this.streamService.findRandom();
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeStreamInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput,
	) {
		return this.streamService.changeStreamInfo(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeStreamThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: FileUpload,
	) {
		return this.streamService.changeThumbnail(user, thumbnail);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user);
	}
}
