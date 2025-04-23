import fs from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';
import os from 'os';

export const csr = false;

// Path to the static/generated-blog/ directory
const STATIC_BLOG_DIR = path.resolve(
	os.homedir(),
	'appgoblin',
	'frontend',
	'static',
	'generated-blog'
);

async function fetchContent(url: URL): Promise<string> {
	if (url.pathname.includes('.')) {
		throw error(404, 'Invalid path: File extensions not allowed');
	}

	const processedPathname = url.pathname.replace(/^\/|\/$/g, '');
	const filePath = path.join(STATIC_BLOG_DIR, processedPathname, 'index.html');

	console.log(`Trying to read static blog file: ${filePath}`);

	try {
		// Read the HTML file from the filesystem
		const htmlContent = await fs.readFile(filePath, 'utf-8');
		return htmlContent;
	} catch (err) {
		console.error(`Failed to read ${filePath}:`, err);
		throw error(404, 'Page not found');
	}
}

export async function load({ url }: { url: URL }) {
	try {
		const myhtml = await fetchContent(url);
		return {
			myblog: myhtml
		};
	} catch (err) {
		throw error(404, 'Page not found');
	}
}
