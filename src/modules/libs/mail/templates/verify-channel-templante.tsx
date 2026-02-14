import {
	Body,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from '@react-email/components';
import * as React from 'react';

export const ChannelVerifiedTemplate = () => {
	return (
		<Html>
			<Head />
			<Body>
				<Preview>Your channel has been verified</Preview>

				<Section>
					<Heading>
						🎉 Congratulations! Your channel has been verified
					</Heading>

					<Text>
						We’re happy to inform you that your channel is now
						verified and you have received an official badge.
					</Text>

					<Text>
						The verification badge confirms the authenticity of your
						channel and increases viewers' trust.
					</Text>

					<Text>
						Thank you for being with us and continuing to grow your
						channel with Dedstream!
					</Text>
				</Section>
			</Body>
		</Html>
	);
};
