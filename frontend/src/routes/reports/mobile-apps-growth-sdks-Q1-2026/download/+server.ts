import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	throw redirect(308, '/reports/app-ecosystem-report-Q1-2026/download');
};
