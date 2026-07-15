import type { LayoutServerLoad } from './$types';
import { requireAuthOr401 } from '$lib/server/auth/auth';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: LayoutServerLoad = async (event) => {
	requireAuthOr401(event);
	return {};
};
