import {
	Body,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

export function AccountDeletionTemplate() {
	return (
		<Html>
			<Head />
			<Body>
				<Preview>Account was deleted</Preview>
				<Tailwind>
					<Body className='max-w-2xl mx-auto p-6 bg-stage-50'>
						<Section className='text-center mb-6'>
							<Heading className='text-2xl font-bold text-stage-900 mb-2'>
								Your Account was deleted
							</Heading>
							<Text className='text-stage-700'>
								Your account was deleted from database.
							</Text>
						</Section>
						<Section className='mt-6 text-stage-600 text-sm'>
							<Text>Thank you</Text>
						</Section>
					</Body>
				</Tailwind>
			</Body>
		</Html>
	);
}
