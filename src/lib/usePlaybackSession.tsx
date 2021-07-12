import React, { useContext, useEffect, useRef, useState } from 'react';

import {
	PlaybackContext,
	PlaybackContextType,
} from '@components/templates/andMiniplayer';
import { AndMiniplayerFragment } from '@lib/generated/graphql';

interface PlaybackSessionInfo {
	shiftTime: (delta: number) => void;
	setProgress: (percent: number) => void;
	pause: () => void;
	play: () => void;
	requestFullscreen: () => void;
	setPrefersAudio: (prefersAudio: boolean) => void;
	setSpeed: (speed: number) => void;
	isLoaded: boolean;
	progress: number;
	prefersAudio: boolean;
	isAudioLoaded: boolean;
	isVideoLoaded: boolean;
	isPaused: boolean;
	speed: number;
	duration: number;
	video: JSX.Element;
	supportsFullscreen: boolean;
}

export default function usePlaybackSession(
	recording: AndMiniplayerFragment
): PlaybackSessionInfo {
	if (!recording) {
		throw new Error('Missing recording');
	}

	const context = useContext(PlaybackContext);
	const loadedRecording = context.getRecording();
	const isLoaded = !!loadedRecording && loadedRecording.id === recording.id;
	const progress = isLoaded ? context.getProgress() : 0;
	const isAudioLoaded = isLoaded && !context.isShowingVideo();
	const isVideoLoaded = isLoaded && context.isShowingVideo();
	const prefersAudio = context.getPrefersAudio();
	const supportsFullscreen = context.supportsFullscreen();
	const speed = context.getSpeed();
	// TODO: return duration according to current media file
	const duration = isLoaded ? context.getDuration() : recording.duration;
	const [, setSpeedFingerprint] = useState<number>(speed);
	const isPaused = !isLoaded || context.paused();
	const portalContainerRef = useRef<HTMLDivElement>(null);
	const [video] = useState<JSX.Element>(
		<div ref={portalContainerRef} data-testid={'portal'} />
	);

	useEffect(() => {
		if (!isLoaded) return;
		context.loadPortalContainer(portalContainerRef.current);
		return () => {
			context.loadPortalContainer(null);
		};
	}, [portalContainerRef.current, isLoaded]);

	// TODO: What should function be named? `withContext`?
	function act(func: (c: PlaybackContextType) => void) {
		if (isLoaded) {
			func(context);
			return;
		}

		context.loadRecording(recording, {
			onLoad: (c: PlaybackContextType) => {
				func(c);
			},
		});
	}

	function shiftTime(delta: number) {
		act((c) => {
			c.setTime(c.getTime() + delta);
		});
	}

	function setProgress(percent: number) {
		act((c) => c.setProgress(percent));
	}

	function pause() {
		// TODO: Maybe only if `isLoaded` is true
		// Or perhaps throw an exception, since the user should never be presented
		// with a pause button for a recording that isn't loaded.
		context.pause();
	}

	function play() {
		act((c) => c.play());
	}

	function setPrefersAudio(prefersAudio: boolean) {
		act((c) => c.setPrefersAudio(prefersAudio));
	}

	function setSpeed(speed: number) {
		act((c) => c.setSpeed(speed));
		setSpeedFingerprint(speed);
	}

	function requestFullscreen() {
		act((c) => c.requestFullscreen());
	}

	// TODO: Consider not returning isLoaded
	return {
		shiftTime,
		setProgress,
		pause,
		play,
		setPrefersAudio,
		setSpeed,
		requestFullscreen,
		isLoaded,
		progress,
		duration,
		isAudioLoaded,
		isVideoLoaded,
		isPaused,
		prefersAudio,
		video,
		speed,
		supportsFullscreen,
	};
}
