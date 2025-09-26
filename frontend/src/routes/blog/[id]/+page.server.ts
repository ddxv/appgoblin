import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const ssr = true;
export const csr = false;

import { blogPosts, getMetadataFromMatter } from '$lib/content';

export const load: PageServerLoad = async ({ params }) => {
	const matchPath = `/src/content/blog/${params.id}.mdx`;
	const rawContent = blogPosts[matchPath];
	if (!rawContent) return error(404);

	const { content, data } = matter(rawContent);

	const postMetaData = getMetadataFromMatter(params.id, data);

	const contentHTML = (
		await unified()
			.use(remarkParse)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeStringify, { allowDangerousHtml: true })
			.process(content)
	).toString();

	return {
		...postMetaData,
		contentHTML
	};
};
