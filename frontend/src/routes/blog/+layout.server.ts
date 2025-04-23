export const csr = false;

import { PUBLIC_BLOG_HOST } from '$env/static/public';

async function fetchContent(url: URL) {
	let htmlContent;
	if (url && !url.pathname.includes('.')) {
		// Ensure the path correctly points to where mkdocs HTML files were generated to.
		// ie www/static/documentation/docs/index.html
		const processedPathname = url.pathname.replace('', '');
		var mypath = `${PUBLIC_BLOG_HOST}/generated-blog${processedPathname}/index.html`;
		console.log(`Try rendering static blog path=${mypath}`);
		const response = await fetch(mypath);
		if (response.ok) {
			htmlContent = await response.text();
		} else {
			htmlContent = 'Page not found.';
		}
	}
	return htmlContent;
}

export async function load({ url }: { url: URL }) {
	const myhtml = await fetchContent(url);
	return {
		props: {
			myblog: myhtml
		}
	};
}
