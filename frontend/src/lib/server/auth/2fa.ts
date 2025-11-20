import { db } from './db';
import { decryptToString, encryptString } from './encryption';
import { ExpiringTokenBucket } from './rate-limit';
import { generateRandomRecoveryCode } from './utils';

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
	userId: number,
	recoveryCode: string
): Promise<boolean> {
	const row = await db.queryOne<{ recovery_code: Buffer }>(
		'SELECT recovery_code FROM users WHERE id = $1',
		[userId]
	);
	if (row === null) {
		return false;
	}
	const encryptedRecoveryCode = row.recovery_code;
	const userRecoveryCode = decryptToString(encryptedRecoveryCode);
	if (recoveryCode !== userRecoveryCode) {
		return false;
	}

	const newRecoveryCode = generateRandomRecoveryCode();
	const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
	await db.execute('UPDATE sessions SET two_factor_verified = 0 WHERE user_id = $1', [userId]);
	// Compare old recovery code to ensure recovery code wasn't updated.
	const result = await db.execute(
		'UPDATE users SET recovery_code = $1, totp_key = NULL WHERE id = $2 AND recovery_code = $3',
		[encryptedNewRecoveryCode, userId, encryptedRecoveryCode]
	);
	return result.changes > 0;
}
