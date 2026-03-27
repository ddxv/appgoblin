import { getBlogPostsMetadata } from '$lib/content';

import type { PageServerLoad } from './$types';

export const prerender = true;
export const ssr = true;
export const csr = false;

export const load: PageServerLoad = () => {
	const posts = getBlogPostsMetadata();

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: 'AppGoblin Blog',
		description: 'Mobile app marketing, ASO and advertising insights and news.',
		url: 'https://appgoblin.info/blog',
		publisher: {
			'@type': 'Organization',
			name: 'AppGoblin',
			url: 'https://appgoblin.info',
			logo: {
				'@type': 'ImageObject',
				url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
			}
		},
		blogPost: posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			datePublished: post.pubDate.toISOString(),
			url: `https://appgoblin.info${post.relativeURL}`,
			image: `https://appgoblin.info${post.heroImage}`,
			description: post.description,
			author: {
				'@type': 'Organization',
				name: 'AppGoblin'
			},
			publisher: {
				'@type': 'Organization',
				name: 'AppGoblin',
				logo: {
					'@type': 'ImageObject',
					url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
				}
			}
		}))
	};

	return { posts, structuredData: JSON.stringify(structuredData) };
};
