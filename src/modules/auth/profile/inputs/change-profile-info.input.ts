import { Field, InputType } from '@nestjs/graphql';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
} from 'class-validator';

@InputType()
export class ChangeProfileInfoInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain letters, numbers, and underscores',
	})
	public username: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public displayName: string;

	@Field(() => String)
	@IsString()
	@IsOptional()
	@MaxLength(300)
	public bio?: string;
}
