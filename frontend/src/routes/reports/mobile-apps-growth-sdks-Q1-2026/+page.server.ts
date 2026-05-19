import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(308, '/reports/app-ecosystem-report-Q1-2026');
};
