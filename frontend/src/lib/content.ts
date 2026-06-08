import matter from 'gray-matter';
import * as v from 'valibot';

// import { BASE_URL } from './constants';
const BASE_URL = 'http://localhost:5173';

export const blogPosts = import.meta.glob('/src/content/blog/*.mdx', {
	query: '?raw',
	import: 'default',
	eager: true
});

const reportModules = import.meta.glob('/src/routes/reports/*/+page.svelte');
const reportSourceModules = import.meta.glob('/src/routes/reports/*/+page.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

export function getMetadataFromMatter(
	id: string,
	data: {
		[key: string]: unknown;
	}
) {
	const post = v.parse(blogPostMetadataSchema, {
		id,
		...data
	});
	const canonicalURL = new URL(`/blog/${post.id}`, BASE_URL).toString();
	const relativeURL = `/blog/${post.id}`;
	const ogImage = `/content/${post.id}/og.jpg`;

	return { ...post, canonicalURL, relativeURL, ogImage };
}

export const blogPostMetadataSchema = v.object({
	id: v.pipe(v.string(), v.trim()),
	title: v.pipe(v.string(), v.trim()),
	description: v.pipe(v.string(), v.trim()),
	heroImage: v.pipe(v.string(), v.trim()),
	pubDate: v.pipe(
		v.string(),
		v.transform((i) => new Date(i)),
		v.date()
	)
});

export function getBlogPostsMetadata() {
	const posts = Object.entries(blogPosts)
		.map(([filePath, rawContent]) => {
			const { data } = matter(rawContent as string);
			const id = filePath
				.split('/')
				.pop()
				?.replace(/\.mdx$/, '') as string;

			return getMetadataFromMatter(id, data);
		})
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return posts;
}

function getReportPublishedDate(source: string): string | null {
	const match = source.match(/const\s+reportPublishedDate\s*=\s*'([^']+)'/);
	if (match) return match[1];

	const inlineMatch = source.match(/datePublished:\s*'([^']+)'/);
	if (inlineMatch) return inlineMatch[1];

	return null;
}

function extractReportTitle(slug: string): string {
	return slug
		.split('-')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');
}

export type ContentEntry = {
	kind: 'blog' | 'report';
	relativeURL: string;
	title: string;
	description: string;
	pubDate: Date;
};

export function getReportsMetadata(): ContentEntry[] {
	const entries: ContentEntry[] = [];

	for (const [path, rawContent] of Object.entries(reportSourceModules)) {
		const match = path.match(/\/reports\/([^/]+)\/\+page\.svelte$/);
		if (!match) continue;

		const slug = match[1];
		const publishedDateStr = getReportPublishedDate(rawContent);
		if (!publishedDateStr) continue;

		const pubDate = new Date(publishedDateStr);
		const title = extractReportTitle(slug);

		entries.push({
			kind: 'report',
			relativeURL: `/reports/${slug}`,
			title,
			description: `${title} — mobile app marketing report from AppGoblin.`,
			pubDate
		});
	}

	return entries;
}

export function getMixedContentFeed(limit = 6): ContentEntry[] {
	const blogs: ContentEntry[] = getBlogPostsMetadata().map((p) => ({
		kind: 'blog' as const,
		relativeURL: p.relativeURL,
		title: p.title,
		description: p.description,
		pubDate: p.pubDate
	}));

	const reports = getReportsMetadata();

	return [...blogs, ...reports]
		.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
		.slice(0, limit);
}
