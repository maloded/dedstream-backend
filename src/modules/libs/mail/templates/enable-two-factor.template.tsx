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

interface EnableTwoFactorTemplateProps {
	domain: string;
}

export const EnableTwoFactorTemplate = ({
	domain,
}: EnableTwoFactorTemplateProps) => {
	const settingsLink = `${domain}/dashboard/settings`;

	return (
		<Html>
			<Head />
			<Preview>Secure your Dedstream account</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-gray-50'>
					<Section className='text-center mb-6'>
						<Heading className='text-2xl font-bold text-gray-900 mb-2'>
							🔐 Protect Your Account
						</Heading>
						<Text className='text-gray-700'>
							Enable two-factor authentication to add an extra
							layer of security to your Dedstream account.
						</Text>
					</Section>

					<Section className='text-center'>
						<Link
							href={settingsLink}
							className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md'
						>
							Enable Two-Factor Authentication
						</Link>
					</Section>

					<Section className='mt-6 text-gray-600 text-sm text-center'>
						<Text>
							We strongly recommend enabling 2FA to keep your
							account safe.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
};
