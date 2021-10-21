import React from 'react';

import { CardRecordingFragment } from '@lib/generated/graphql';

import TeaseRecording from '../teaseRecording';

import CardWithTheme from './base/withTheme';
import CardHatSermon from './hat/sermon';

export interface CardSermonProps {
	recording: CardRecordingFragment;
	hideHat?: boolean;
	isOptionalLink?: boolean;
}

export default function CardSermon({
	recording,
	hideHat,
	isOptionalLink,
}: CardSermonProps): JSX.Element {
	const { sequence } = recording;
	const theme = 'sermon';

	return (
		<CardWithTheme {...{ theme }}>
			{sequence && !hideHat && <CardHatSermon sequence={sequence} />}
			<TeaseRecording {...{ recording, theme, isOptionalLink }} />
		</CardWithTheme>
	);
}
