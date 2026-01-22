import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import * as React from 'react';

interface PasswordRecoveryTemplateProps {
	domain: string;
	token: string;
	metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata,
}: PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`;
	return (
		<Html>
			<Head />
			<Body>
				<Preview>Reset your password</Preview>
				<Tailwind>
					<Body className='max-w-2xl mx-auto p-6 bg-stage-50'>
						<Section className='text-center mb-6'>
							<Heading className='text-2xl font-bold text-stage-900 mb-2'>
								Reset Your Password
							</Heading>
							<Text className='text-stage-700'>
								Click the button below to reset your password.
							</Text>
						</Section>
						<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
							<Heading className='text-lg font-semibold text-stage-900 mb-2'>
								Session Details
							</Heading>
							<Text className='text-stage-700 mb-1'>
								IP Address: {metadata.ip || 'Unknown'}
							</Text>
							<Text className='text-stage-700 mb-1'>
								Device: {metadata.device.os || 'Unknown'}
							</Text>
							<Text className='text-stage-700'>
								Location:{' '}
								{metadata.location.country || 'Unknown'}
							</Text>
						</Section>
						<Section className='text-center'>
							<Link
								href={resetLink}
								className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700'
							>
								Reset Password
							</Link>
						</Section>
						<Section className='mt-6 text-stage-600 text-sm'>
							<Text>
								If you did not create an account, no further
								action is required.
							</Text>
						</Section>
					</Body>
				</Tailwind>
			</Body>
		</Html>
	);
}
