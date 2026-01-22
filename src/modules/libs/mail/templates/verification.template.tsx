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
import * as React from 'react';

interface VerificationTemplateProps {
	domain: string;
	token: string;
}

export const VerificationTemplate = ({
	domain,
	token,
}: VerificationTemplateProps) => {
	const verificationLink = `${domain}/account/verify?token=${token}`;

	return (
		<Html>
			<Head />
			<Body>
				<Preview>Verify your email address</Preview>
				<Tailwind>
					<Body className='max-w-2xl mx-auto p-6 bg-stage-50'>
						<Section className='text-center mb-6'>
							<Heading className='text-2xl font-bold text-stage-900 mb-2'>
								Verify Your Email Address
							</Heading>
							<Text className='text-stage-700'>
								Click the button below to verify your email
								address and activate your account.
							</Text>
						</Section>
						<Section className='text-center'>
							<Link
								href={verificationLink}
								className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700'
							>
								Verify Email
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
};
