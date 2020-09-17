import { render } from '@testing-library/react';
import React from 'react';
import Testimonies, { getStaticPaths, getStaticProps } from '@pages/[language]/testimonies/page/[i]';
import { getTestimonies, getTestimonyCount } from '@lib/api';
import { ENTRIES_PER_PAGE } from '@lib/constants';

jest.mock('@lib/api');

function setEntityCount(count: number) {
	(getTestimonyCount as jest.Mock).mockReturnValue(Promise.resolve(count));
}

function loadTestimonies() {
	(getTestimonies as jest.Mock).mockResolvedValue([]);
}

describe('testimonies pages', () => {
	it('renders', async () => {
		loadTestimonies();

		const params = { i: '1', language: 'en' };
		const { props } = await getStaticProps({ params });

		await render(<Testimonies {...props} />);
	});

	it('revalidates', async () => {
		loadTestimonies();

		const { revalidate } = await getStaticProps({ params: { i: '1', language: 'en' } });

		expect(revalidate).toBe(10);
	});

	it('gets testimony count', async () => {
		setEntityCount(0);

		await getStaticPaths();

		expect(getTestimonyCount).toBeCalledWith('ENGLISH');
	});

	it('generates static paths', async () => {
		setEntityCount(1);

		const result = await getStaticPaths();

		expect(result.paths).toContain('/en/testimonies/page/1');
	});

	it('sets path fallback strategy', async () => {
		setEntityCount(1);

		const result = await getStaticPaths();

		expect(result.fallback).toBe('unstable_blocking');
	});

	it('gets page of testimonies', async () => {
		loadTestimonies();

		await getStaticProps({ params: { language: 'en', i: '1' } });

		expect(getTestimonies).toBeCalledWith('ENGLISH', {
			offset: 0,
			first: ENTRIES_PER_PAGE,
		});
	});
});
