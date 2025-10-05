import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const prerender = true;
export const ssr = true;
export const csr = false;

import { blogPosts, getMetadataFromMatter } from '$lib/content';

export const load: PageServerLoad = async ({ params }) => {
	const matchPath = `/src/content/blog/${params.id}.mdx`;
	const rawContent = blogPosts[matchPath];
	if (!rawContent) return error(404);

	const { content, data } = matter(rawContent as string);

	const postMetaData = getMetadataFromMatter(params.id, data);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: postMetaData.title,
		description: postMetaData.description,
		image: `https://appgoblin.info${postMetaData.heroImage}`,
		datePublished: postMetaData.pubDate.toISOString(),
		dateModified: postMetaData.pubDate.toISOString(),
		url: `https://appgoblin.info${postMetaData.relativeURL}`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://appgoblin.info${postMetaData.relativeURL}`
		},
		author: {
			'@type': 'Organization',
			name: 'AppGoblin',
			url: 'https://appgoblin.info'
		},
		publisher: {
			'@type': 'Organization',
			name: 'AppGoblin',
			url: 'https://appgoblin.info',
			logo: {
				'@type': 'ImageObject',
				url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
			}
		},
		isPartOf: {
			'@type': 'Blog',
			name: 'AppGoblin Blog',
			url: 'https://appgoblin.info/blog'
		}
	};

	const contentHTML = (
		await unified()
			.use(remarkParse)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeStringify, { allowDangerousHtml: true })
			.process(content)
	).toString();

	return {
		...postMetaData,
		contentHTML,
		structuredData: JSON.stringify(structuredData)
	};
};
