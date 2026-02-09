import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserModel } from '../../auth/account/models/user.model';
import { Notification, NotificationType } from '@/prisma/generated/client';

registerEnumType(NotificationType, {
	name: 'NotificationType',
});

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => String)
	public id: string;

	@Field(() => String)
	public message: string;

	@Field(() => Boolean)
	public isRead: boolean;

	@Field(() => NotificationType)
	public type: NotificationType;

	@Field(() => UserModel)
	public user: UserModel;

	@Field(() => String)
	public userId: string;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
}
