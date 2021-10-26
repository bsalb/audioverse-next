import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

import PresenterAppears, {
	PresenterAppearsProps,
} from '@containers/presenter/appears';
import {
	getPresenterAppearsPageData,
	getPresenterDetailPathsData,
} from '@lib/generated/graphql';
import { getDetailStaticPaths } from '@lib/getDetailStaticPaths';
import { getPaginatedStaticProps } from '@lib/getPaginatedStaticProps';

export default PresenterAppears;

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ language: string; id: string; i: string }>): Promise<
	GetStaticPropsResult<PresenterAppearsProps>
> {
	const id = params?.id as string;

	return getPaginatedStaticProps(
		params,
		(vars) => getPresenterAppearsPageData({ id, ...vars }),
		(d) => d.collections?.nodes,
		(d) => d.collections?.aggregate?.count
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	return getDetailStaticPaths(
		getPresenterDetailPathsData,
		(d) => d.persons.nodes,
		(languageRoute, node) =>
			`/${languageRoute}/presenters/${node.id}/appears/page/1`
	);
}
