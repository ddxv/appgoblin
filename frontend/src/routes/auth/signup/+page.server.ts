import { fail, redirect } from '@sveltejs/kit';
import { checkEmailAvailability, verifyEmailInput } from '$lib/server/auth/email';
import { createUser, verifyUsernameInput } from '$lib/server/auth/user';
import { db } from '$lib/server/auth/db';
import { RefillingTokenBucket } from '$lib/server/auth/rate-limit';
import { verifyPasswordStrength } from '$lib/server/auth/password';
import {
	createSession,
	DEFAULT_SESSION_DURATION_HOURS,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth/session';
import {
	createEmailVerificationRequest,
	sendVerificationEmail,
	sendVerificationEmailBucket,
	setEmailVerificationRequestCookie
} from '$lib/server/auth/email-verification';
import { redirectIfAuthenticated, isSafeRedirect } from '$lib/server/auth/auth';
import { getClientIP } from '$lib/server/request';
import { altcha } from '$lib/server/altcha';

import type { SessionFlags } from '$lib/server/auth/session';
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';

export const ssr = true;
export const csr = true;

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export function load(event: PageServerLoadEvent) {
	// Redirect if already authenticated (public route)
	redirectIfAuthenticated(event);
	const redirectTo = event.url.searchParams.get('redirectTo') ?? '';
	return { redirectTo: isSafeRedirect(redirectTo) ? redirectTo : '' };
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	const clientIP = getClientIP(event.request);
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return fail(429, {
			message: 'Too many requests',
			email: '',
			username: '',
			referral_source: ''
		});
	}

	// Verify ALTCHA (payload comes via cookie — no body conflict)
	const result = await altcha.verifyEvent(event);
	if (result.error) {
		return fail(400, {
			message: result.error,
			email: '',
			username: '',
			referral_source: ''
		});
	}

	const formData = await event.request.formData();
	const email = formData.get('email');
	const username = formData.get('username');
	const password = formData.get('password');
	const redirectToParam = formData.get('redirectTo');
	const referralSource = formData.get('referral_source');

	if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
		return fail(400, {
			message: 'Invalid or missing fields',
			email: '',
			username: '',
			referral_source: ''
		});
	}
	if (email === '' || password === '' || username === '') {
		return fail(400, {
			message: 'Please enter your username, email, and password',
			email: '',
			username: '',
			referral_source: ''
		});
	}
	if (!verifyEmailInput(email)) {
		return fail(400, {
			message: 'Invalid email',
			email,
			username,
			referral_source: ''
		});
	}
	const emailAvailable = await checkEmailAvailability(email);
	if (!emailAvailable) {
		return fail(400, {
			message: 'Email is already used',
			email,
			username,
			referral_source: ''
		});
	}
	if (!verifyUsernameInput(username)) {
		return fail(400, {
			message: 'Invalid username',
			email,
			username,
			referral_source: ''
		});
	}
	const strongPassword = await verifyPasswordStrength(password);
	if (!strongPassword) {
		return fail(400, {
			message: 'Weak password',
			email,
			username,
			referral_source: ''
		});
	}
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return fail(429, {
			message: 'Too many requests',
			email,
			username,
			referral_source: ''
		});
	}
	const user = await createUser(email, username, password);

	// Store optional referral source (no 3rd-party analytics used)
	if (typeof referralSource === 'string' && referralSource.trim() !== '') {
		await db.execute('INSERT INTO user_signup_sources (user_id, referral_source) VALUES ($1, $2)', [
			user.id,
			referralSource.trim()
		]);
	}

	const emailVerificationRequest = await createEmailVerificationRequest(user.id, user.email);
	sendVerificationEmailBucket.consume(user.id, 1);
	await sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
	setEmailVerificationRequestCookie(event, emailVerificationRequest);

	const sessionFlags: SessionFlags = {
		twoFactorVerified: true
	};
	const sessionToken = generateSessionToken();
	const session = await createSession(
		sessionToken,
		user.id,
		sessionFlags,
		DEFAULT_SESSION_DURATION_HOURS
	);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	const redirectDest =
		typeof redirectToParam === 'string' && isSafeRedirect(redirectToParam) ? redirectToParam : '';
	if (redirectDest) {
		throw redirect(302, `/auth/verify-email?redirectTo=${encodeURIComponent(redirectDest)}`);
	}
	throw redirect(302, '/auth/verify-email');
}
