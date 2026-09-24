import { redirectIfAuthenticated, isSafeRedirect } from '$lib/server/auth/auth';
import { handleSignup } from '$lib/server/auth/signup';
import type { Actions, PageServerLoadEvent } from './$types';

export const ssr = true;
export const csr = true;

export function load(event: PageServerLoadEvent) {
	// Redirect if already authenticated (public route)
	const redirectTo = event.url.searchParams.get('redirectTo') ?? '';
	redirectIfAuthenticated(event);
	return { redirectTo: isSafeRedirect(redirectTo) ? redirectTo : '' };
}

export const actions: Actions = {
	default: handleSignup
};
