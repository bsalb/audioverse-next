import SermonDetail, { SermonDetailProps } from '@containers/sermon/detail';
import { REVALIDATE } from '@lib/constants';
import {
	getSermonDetailData,
	getSermonDetailStaticPaths,
} from '@lib/generated/graphql';
import { getDetailStaticPaths } from '@lib/getDetailStaticPaths';
import { makeSermonRoute } from '@lib/routes';

export default SermonDetail;

interface StaticProps {
	props: SermonDetailProps;
	revalidate: number;
}

export async function getStaticProps({
	params,
}: {
	params: { id: string };
}): Promise<StaticProps> {
	const { id } = params;
	const { sermon } = await getSermonDetailData({ id }).catch(() => ({
		sermon: undefined,
	}));

	return {
		props: {
			sermon,
		},
		revalidate: REVALIDATE,
	};
}

export async function getStaticPaths(): Promise<StaticPaths> {
	// TODO: extract route generation
	return getDetailStaticPaths(
		getSermonDetailStaticPaths,
		'sermons.nodes',
		(baseUrl, node) => makeSermonRoute(baseUrl, node.id)
	);
}
