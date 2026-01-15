import type { RequestHandler } from './$types';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const GET: RequestHandler = async () => {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const csvPath = join(__dirname, '..', 'AppGoblin App SDKs Growth 2025.csv');

	try {
		const csvContent = readFileSync(csvPath, 'utf-8');

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': 'attachment; filename="AppGoblin App SDKs Growth 2025.csv"'
			}
		});
	} catch {
		return new Response('File not found', { status: 404 });
	}
};
