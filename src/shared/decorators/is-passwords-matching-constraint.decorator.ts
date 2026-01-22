import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input';
import {
	ValidatorConstraint,
	type ValidationArguments,
	type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
	public validate(
		passwordRepeat: string,
		args: ValidationArguments,
	): boolean {
		const object = args.object as NewPasswordInput;
		return object.password === passwordRepeat;
	}

	public defaultMessage(): string {
		return 'Passwords do not match';
	}
}
