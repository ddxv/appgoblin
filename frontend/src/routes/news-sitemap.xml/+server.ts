import { getBlogPostsMetadata, getReportsMetadata } from '$lib/content';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
	const siteUrl = 'https://appgoblin.info';

	const blogPosts = getBlogPostsMetadata();
	const reports = getReportsMetadata();

	const recentContent = [...blogPosts, ...reports]
		.filter((entry) => entry.pubDate >= fortyEightHoursAgo)
		.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	// Google limits News sitemaps to 1000 URLs
	const limitedContent = recentContent.slice(0, 1000);

	const urlElements = limitedContent
		.map(
			(entry) => `    <url>
      <loc>${siteUrl}${entry.relativeURL}</loc>
      <news:news>
        <news:publication>
          <news:name>AppGoblin</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${entry.pubDate.toISOString()}</news:publication_date>
        <news:title><![CDATA[${entry.title}]]></news:title>
        <news:keywords>mobile apps, app marketing, user acquisition, adtech, aso</news:keywords>
      </news:news>
    </url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600, public'
		}
	});
};
