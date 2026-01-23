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
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import * as React from 'react';

interface DeactivateTemplateProps {
	token: string;
	metadata: SessionMetadata;
}

export function DeactivateTemplate({
	token,
	metadata,
}: DeactivateTemplateProps) {
	return (
		<Html>
			<Head />
			<Body>
				<Preview>Deactivate your account</Preview>
				<Tailwind>
					<Body className='max-w-2xl mx-auto p-6 bg-stage-50'>
						<Section className='text-center mb-6'>
							<Heading className='text-2xl font-bold text-stage-900 mb-2'>
								Deactivate Your Account
							</Heading>
							<Text className='text-stage-700'>
								Click the button below to deactivate your
								account.
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
							<Heading className='text-lg font-semibold text-stage-900 mb-2'>
								Pin to deactivate:
							</Heading>
							<Heading className='text-2xl font-bold text-red-600 mb-4'>
								{token}
							</Heading>
							<Text className='text-stage-700'>
								This pin is valid for the next 5 minutes.
							</Text>
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
