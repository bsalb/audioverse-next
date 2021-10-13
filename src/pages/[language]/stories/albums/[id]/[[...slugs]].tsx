import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

import { IBaseProps } from '@containers/base';
import StoryAlbumDetail, {
	StoryAlbumDetailProps,
} from '@containers/story/albums/detail';
import { REVALIDATE } from '@lib/constants';
import {
	getStoryAlbumDetailPageData,
	getStoryAlbumDetailPathsData,
} from '@lib/generated/graphql';
import { getDetailStaticPaths } from '@lib/getDetailStaticPaths';

export default StoryAlbumDetail;

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ id: string; language: string }>): Promise<
	GetStaticPropsResult<StoryAlbumDetailProps & IBaseProps>
> {
	const id = params?.id as string;

	const { storySeason: sequence } = await getStoryAlbumDetailPageData({
		id,
	}).catch(() => ({
		storySeason: null,
	}));

	return {
		props: { sequence, title: sequence?.title },
		revalidate: REVALIDATE,
	};
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	return getDetailStaticPaths(
		getStoryAlbumDetailPathsData,
		(d) => d.storySeasons.nodes,
		(languageRoute, { canonicalPath }) => canonicalPath
	);
}
