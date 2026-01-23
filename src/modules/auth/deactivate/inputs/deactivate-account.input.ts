import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength,
} from 'class-validator';

@InputType()
export class DeactivateAccountInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	public pin?: string;
}
