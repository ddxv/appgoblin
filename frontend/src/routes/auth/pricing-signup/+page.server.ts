import { redirectIfAuthenticated, isSafeRedirect } from '$lib/server/auth/auth';
import { handleSignup } from '$lib/server/auth/signup';
import { parseSubscribeIntent } from '$lib/plans';
import type { Actions, PageServerLoadEvent } from './$types';

export const ssr = true;
export const csr = true;

export function load(event: PageServerLoadEvent) {
    redirectIfAuthenticated(event);
    const requestedRedirect = event.url.searchParams.get('redirectTo') ?? '';
    const redirectTo = isSafeRedirect(requestedRedirect) ? requestedRedirect : '';
    return {
        redirectTo,
        planKey: parseSubscribeIntent(redirectTo)?.plan ?? null
    };
}

export const actions: Actions = {
    default: handleSignup
};
