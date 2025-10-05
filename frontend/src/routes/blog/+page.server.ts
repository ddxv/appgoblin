import { getBlogPostsMetadata } from '$lib/content';

import type { PageServerLoad } from './$types';

export const prerender = true;
export const ssr = true;
export const csr = false;

export const load: PageServerLoad = () => {
	const posts = getBlogPostsMetadata();

	return { posts };
};
