import { db } from './db';
import { decrypt, decryptToString, encrypt, encryptString } from './encryption';
import { hashPassword } from './password';
import { generateRandomRecoveryCode } from './utils';

export interface User {
	id: number;
	email: string;
	username: string;
	emailVerified: boolean;
	registered2FA: boolean;
}

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);

	const row = await db.queryOne<{ id: number }>(
		'INSERT INTO users (email, username, password_hash, recovery_code) VALUES ($1, $2, $3, $4) RETURNING id',
		[email, username, passwordHash, encryptedRecoveryCode]
	);

	if (row === null) {
		throw new Error('Failed to create user');
	}

	const user: User = {
		id: row.id,
		username,
		email,
		emailVerified: false,
		registered2FA: false
	};

	return user;
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
	const passwordHash = await hashPassword(password);
	await db.execute('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
}

export async function updateUserEmailAndSetEmailAsVerified(
	userId: number,
	email: string
): Promise<void> {
	await db.execute('UPDATE users SET email = $1, email_verified = true WHERE id = $2', [
		email,
		userId
	]);
}

export async function setUserAsEmailVerifiedIfEmailMatches(
	userId: number,
	email: string
): Promise<boolean> {
	const result = await db.execute(
		'UPDATE users SET email_verified = true WHERE id = $1 AND email = $2',
		[userId, email]
	);
	return result.changes > 0;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
	const row = await db.queryOne<{ password_hash: string }>(
		'SELECT password_hash FROM users WHERE id = $1',
		[userId]
	);

	if (row === null) {
		throw new Error('Invalid user ID');
	}

	return row.password_hash;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
	const row = await db.queryOne<{ recovery_code: Buffer }>(
		'SELECT recovery_code FROM users WHERE id = $1',
		[userId]
	);

	if (row === null) {
		throw new Error('Invalid user ID');
	}

	return decryptToString(row.recovery_code);
}

export async function getUserTOTPKey(userId: number): Promise<Uint8Array | null> {
	const row = await db.queryOne<{ totp_key: Buffer | null }>(
		'SELECT totp_key FROM users WHERE id = $1',
		[userId]
	);

	if (row === null) {
		throw new Error('Invalid user ID');
	}

	if (row.totp_key === null) {
		return null;
	}

	return decrypt(row.totp_key);
}

export async function updateUserTOTPKey(userId: number, key: Uint8Array): Promise<void> {
	const encrypted = encrypt(key);
	await db.execute('UPDATE users SET totp_key = $1 WHERE id = $2', [encrypted, userId]);
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
	const recoveryCode = generateRandomRecoveryCode();
	const encrypted = encryptString(recoveryCode);
	await db.execute('UPDATE users SET recovery_code = $1 WHERE id = $2', [encrypted, userId]);
	return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
	const row = await db.queryOne<{
		id: number;
		email: string;
		username: string;
		email_verified: boolean;
		totp_key: Buffer | null;
	}>('SELECT id, email, username, email_verified, totp_key FROM users WHERE email = $1', [email]);

	if (row === null) {
		return null;
	}

	const user: User = {
		id: row.id,
		email: row.email,
		username: row.username,
		emailVerified: row.email_verified,
		registered2FA: row.totp_key !== null
	};

	return user;
}
