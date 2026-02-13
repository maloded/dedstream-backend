import {
	TransactionStatusType,
	type Transaction,
} from '@/prisma/generated/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

registerEnumType(TransactionStatusType, { name: 'TransactionStatusType' });

@ObjectType()
export class TransactionModel implements Transaction {
	@Field(() => ID)
	public id: string;

	@Field(() => Number)
	public amount: number;

	@Field(() => String)
	public currency: string;

	@Field(() => String)
	public stripeSubscriptionId: string;

	@Field(() => TransactionStatusType)
	public status: TransactionStatusType;

	@Field(() => UserModel)
	public user: UserModel;

	@Field(() => String)
	public userId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
