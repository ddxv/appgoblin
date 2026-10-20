import { redirectIfAuthenticated, isSafeRedirect } from '#lib/server/auth/auth.js';
import { handleSignup } from '#lib/server/auth/signup.js';
import type { Actions, PageServerLoadEvent } from './$types';

export const ssr = true;
export const csr = true;

export function load(event: PageServerLoadEvent) {
	redirectIfAuthenticated(event);
	const invitationToken = event.url.searchParams.get('token') ?? '';
	const requestedRedirect = event.url.searchParams.get('redirectTo') ?? '/account';
	return {
		redirectTo: isSafeRedirect(requestedRedirect) ? requestedRedirect : '/account',
		invitationToken
	};
}

export const actions: Actions = {
	default: handleSignup
};
