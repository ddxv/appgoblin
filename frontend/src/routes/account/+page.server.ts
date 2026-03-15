import { requireFullAuth } from '$lib/server/auth/auth';
import type { PageServerLoadEvent } from './$types';

export async function load(event: PageServerLoadEvent) {
	// Require auth at index too, but data is already passed implicitly from +layout.server.ts
	requireFullAuth(event);
	return {};
}
