import { Button } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CopyrightInfo from '@components/molecules/copyrightInfo';
import Player from '@components/molecules/player';
import PlaylistButton from '@components/molecules/playlistButton';
import SpeakerName from '@components/molecules/speakerName';
import SponsorInfo from '@components/molecules/sponsorInfo';
import { RecordingFragment } from '@lib/generated/graphql';
import { makeSeriesDetailRoute, makeSermonRoute } from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

import ArrowLeft from '../../../public/img/icon-arrow-left.svg';
import ArrowRight from '../../../public/img/icon-arrow-right.svg';
import ListIcon from '../../../public/img/icon-list-alt-solid.svg';

import styles from './recording.module.scss';

interface RecordingProps {
	recording: RecordingFragment;
}

function getSiblingByIndexOffset(recording: RecordingFragment, offset: number) {
	const nodes = recording.sequence?.recordings?.nodes;

	if (!nodes || recording.sequenceIndex === null) return;

	const zeroBasedIndex = recording.sequenceIndex - 1;
	const targetIndex = zeroBasedIndex + offset;

	return nodes[targetIndex];
}

export function Recording({ recording }: RecordingProps): JSX.Element {
	const langRoute = useLanguageRoute();

	const speakers = recording?.persons || [];
	const tags = recording?.recordingTags?.nodes || [];
	const { sponsor } = recording;
	const recordingDateString = new Date(recording.recordingDate).toLocaleString(
		[],
		{
			hour: 'numeric',
			minute: 'numeric',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	);
	const previousRecording = getSiblingByIndexOffset(recording, -1);
	const nextRecording = getSiblingByIndexOffset(recording, 1);

	// TODO: Switch embed link to new site when route is implemented
	// language=HTML
	// noinspection HtmlDeprecatedAttribute
	const embedCode = `<iframe src="https://www.audioverse.org/english/embed/media/${recording.id}" width="500" height="309" scrolling="no" frameBorder="0" ></iframe>`;

	return (
		<div className={styles.base}>
			{recording?.sequence && (
				<a
					href={makeSeriesDetailRoute(langRoute, recording?.sequence?.id)}
					className={styles.hat}
				>
					<div>
						<ListIcon width={16} height={16} />
						<FormattedMessage
							id="sermonDetailPage__seriesTitle"
							defaultMessage="Series"
							description="Sermon detail series title"
						/>
					</div>
					<h4>{recording?.sequence?.title}</h4>
				</a>
			)}
			<div className={styles.content}>
				<div className={styles.meta}>
					{recording.sequenceIndex && (
						<span className={styles.part}>Part {recording.sequenceIndex}</span>
					)}
					<h1>{recording.title}</h1>
					<ul className={styles.speakers}>
						{speakers.map((speaker) => (
							<li key={speaker.id}>
								<SpeakerName person={speaker} />
							</li>
						))}
					</ul>
				</div>
				<div className={styles.sequenceNav}>
					{previousRecording && (
						<Button
							href={makeSermonRoute(langRoute, previousRecording.id)}
							aria-label={'Previous'}
							className={styles.previous}
							variant={'outlined'}
							startIcon={<ArrowLeft />}
						>
							Previous
						</Button>
					)}
					{nextRecording && (
						<Button
							href={makeSermonRoute(langRoute, nextRecording.id)}
							aria-label={'Next'}
							className={styles.next}
							variant={'outlined'}
							endIcon={<ArrowRight />}
						>
							Next
						</Button>
					)}
				</div>
				<PlaylistButton recordingId={recording.id} />
				<Player recording={recording} />

				{recording.description && (
					<>
						<h6>
							<FormattedMessage
								id="sermonDetailPage__descriptionTitle"
								defaultMessage="Description"
								description="Sermon detail description title"
							/>
						</h6>
						<div dangerouslySetInnerHTML={{ __html: recording.description }} />
					</>
				)}
				{tags.length > 0 && (
					<>
						<h6>
							<FormattedMessage
								id="sermonDetailPage__tagsTitle"
								defaultMessage="Tags"
								description="Sermon detail tags title"
							/>
						</h6>
						<ul>
							{tags.map((t) => (
								<li key={t.tag.id}>
									{/* TODO: link tags */}
									<Link href="#">
										<a>{t.tag.name}</a>
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
				{/*TODO: Add related sermons*/}
				{sponsor && (
					<>
						<h6>
							<FormattedMessage
								id="sermonDetailPage__sponsorInfoTitle"
								defaultMessage="Sponsor"
								description="Sermon detail sponsor info title"
							/>
						</h6>
						<SponsorInfo sponsor={sponsor} />
					</>
				)}
				{recording.recordingDate ? (
					<>
						<h6>
							<FormattedMessage
								id="sermonDetailPage__recordedTitle"
								defaultMessage="Recorded"
								description="Sermon detail recorded date title"
							/>
						</h6>
						<p>{recordingDateString}</p>
					</>
				) : null}
				{/* TODO: Disable if downloads not allowed */}
				{/*{hasDownloads && (*/}
				{/*	<>*/}
				{/*		<h6>*/}
				{/*			<FormattedMessage*/}
				{/*				id="sermonDetailPage__downloadsTitle"*/}
				{/*				defaultMessage="Downloads"*/}
				{/*				description="Sermon detail downloads title"*/}
				{/*			/>*/}
				{/*		</h6>*/}
				{/*		{hasAudioDownloads && (*/}
				{/*			<>*/}
				{/*				<h6>*/}
				{/*					<FormattedMessage*/}
				{/*						id="sermonDetailPage__downloadsAudioTitle"*/}
				{/*						defaultMessage="Audio Files"*/}
				{/*						description="Sermon detail audio downloads title"*/}
				{/*					/>*/}
				{/*				</h6>*/}
				{/*				<ul>*/}
				{/*					{audioDownloads.map((file) => (*/}
				{/*						<li key={file.id}>*/}
				{/*							<Link href={file.url}>*/}
				{/*								<a>{readableBytes(file.filesize)}</a>*/}
				{/*							</Link>*/}
				{/*						</li>*/}
				{/*					))}*/}
				{/*				</ul>*/}
				{/*			</>*/}
				{/*		)}*/}
				{/*		{hasVideoDownloads && (*/}
				{/*			<>*/}
				{/*				<h6>*/}
				{/*					<FormattedMessage*/}
				{/*						id="sermonDetailPage__downloadsVideoTitle"*/}
				{/*						defaultMessage="Video Files"*/}
				{/*						description="Sermon detail video downloads title"*/}
				{/*					/>*/}
				{/*				</h6>*/}
				{/*				<ul>*/}
				{/*					{videoDownloads.map((file) => (*/}
				{/*						<li key={file.id}>*/}
				{/*							<Link href={file.url}>*/}
				{/*								<a>{readableBytes(file.filesize)}</a>*/}
				{/*							</Link>*/}
				{/*						</li>*/}
				{/*					))}*/}
				{/*				</ul>*/}
				{/*			</>*/}
				{/*		)}*/}
				{/*	</>*/}
				{/*)}*/}
				<h6>
					<FormattedMessage
						id="sermonDetailPage__shareTitle"
						defaultMessage="Share"
						description="Sermon detail share section title"
					/>
				</h6>
				<h6>
					<FormattedMessage
						id="sermonDetailPage__shortUrlLabel"
						defaultMessage="Short URL"
						description="Sermon detail short url label"
					/>
				</h6>
				<p>{recording.shareUrl}</p>
				<label>
					<FormattedMessage
						id="sermonDetailPage__embedCodeLabel"
						defaultMessage="Embed Code"
						description="Sermon detail embed code label"
					/>{' '}
					<input readOnly={true} value={embedCode} />
				</label>
				{recording.transcript?.text && (
					<>
						<h6>
							<FormattedMessage
								id="sermonDetailPage__transcriptTitle"
								defaultMessage="Transcript"
								description="Sermon detail transcript title"
							/>
						</h6>
						<p>
							<FormattedMessage
								id="sermonDetailPage__transcriptDisclaimer"
								defaultMessage="This transcript may be automatically generated."
								description="Sermon detail transcript disclaimer"
							/>
						</p>
						<p>
							<FormattedMessage
								id="sermonDetailPage__transcriptHelp"
								defaultMessage="Our auto-generated transcripts need your help. Feel free to e-mail us your edited text of this transcript for your benefit and others. media@audioverse.org"
								description="Sermon detail transcript assistance request"
							/>
						</p>
						<p>{recording.transcript?.text}</p>
					</>
				)}
				<CopyrightInfo recording={recording} />
			</div>
		</div>
	);
}
