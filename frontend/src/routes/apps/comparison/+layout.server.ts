import type { LayoutServerLoad } from './$types';
import { requireFullAuth } from '$lib/server/auth/auth';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: LayoutServerLoad = async (event) => {
    requireFullAuth(event);
    return {};
};