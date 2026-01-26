import { db } from './db';
import { encodeHexLowerCase, generateRandomOTP, sha256 } from '$lib/server/auth/utils';

import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './user';

export async function createPasswordResetSession(
	token: string,
	userId: number,
	email: string
): Promise<PasswordResetSession> {
	const sessionId = encodeHexLowerCase(await sha256(new TextEncoder().encode(token)));
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false,
		twoFactorVerified: false
	};
	await db.execute(
		'INSERT INTO password_reset_sessions (id, user_id, email, code, expires_at) VALUES ($1, $2, $3, $4, $5)',
		[session.id, session.userId, session.email, session.code, session.expiresAt]
	);
	return session;
}

interface SessionQueryResult {
	id: string;
	user_id: number;
	email: string;
	code: string;
	expires_at: number;
	email_verified: boolean;
	two_factor_verified: boolean;
	user_table_id: number;
	user_table_email: string;
	username: string;
	user_email_verified: boolean;
	registered_2fa: boolean;
}

export async function validatePasswordResetSessionToken(
	token: string
): Promise<PasswordResetSessionValidationResult> {
	const sessionId = encodeHexLowerCase(await sha256(new TextEncoder().encode(token)));
	const row = await db.queryOne<SessionQueryResult>(
		`SELECT 
    prs.id, 
    prs.user_id, 
    prs.email, 
    prs.code, 
    prs.expires_at, 
    prs.email_verified, 
    prs.two_factor_verified,
    u.id AS user_table_id,
    u.email AS user_table_email,
    u.username, 
    u.email_verified AS user_email_verified,
    (u.totp_key IS NOT NULL) AS registered_2fa
FROM password_reset_sessions prs 
INNER JOIN users u ON u.id = prs.user_id
WHERE prs.id = $1`,
		[sessionId]
	);
	if (row === null) {
		return { session: null, user: null };
	}
	const session: PasswordResetSession = {
		id: row.id,
		userId: row.user_table_id,
		email: row.user_table_email,
		code: row.code,
		expiresAt: new Date(row.expires_at),
		emailVerified: row.user_email_verified,
		twoFactorVerified: row.two_factor_verified
	};
	const user: User = {
		id: row.user_table_id,
		email: row.user_table_email,
		username: row.username,
		emailVerified: row.user_email_verified,
		registered2FA: row.registered_2fa
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute('DELETE FROM password_reset_sessions WHERE id = $1', [session.id]);
		return { session: null, user: null };
	}
	return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string): Promise<void> {
	await db.execute('UPDATE password_reset_sessions SET email_verified = TRUE WHERE id = $1', [
		sessionId
	]);
}

export async function setPasswordResetSessionAs2FAVerified(sessionId: string): Promise<void> {
	await db.execute('UPDATE password_reset_sessions SET two_factor_verified = TRUE WHERE id = $1', [
		sessionId
	]);
}

export async function invalidateUserPasswordResetSessions(userId: number): Promise<void> {
	await db.execute('DELETE FROM password_reset_sessions WHERE user_id = $1', [userId]);
}

export async function validatePasswordResetSessionRequest(
	event: RequestEvent
): Promise<PasswordResetSessionValidationResult> {
	const token = event.cookies.get('password_reset_session') ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validatePasswordResetSessionToken(token);
	if (result.session === null) {
		deletePasswordResetSessionTokenCookie(event);
	}
	return result;
}

export async function setPasswordResetSessionTokenCookie(
	event: RequestEvent,
	token: string,
	expiresAt: Date
): Promise<void> {
	await event.cookies.set('password_reset_session', token, {
		expires: expiresAt,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: !import.meta.env.DEV
	});
}

export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('password_reset_session', '', {
		maxAge: 0,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: !import.meta.env.DEV
	});
}

export function sendPasswordResetEmail(email: string, code: string): void {
	console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
	id: string;
	userId: number;
	email: string;
	expiresAt: Date;
	code: string;
	emailVerified: boolean;
	twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
	| { session: PasswordResetSession; user: User }
	| { session: null; user: null };
