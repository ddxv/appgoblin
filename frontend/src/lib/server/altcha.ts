import { create, randomInt, CappedMap } from 'altcha-lib/frameworks/sveltekit';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { ALTCHA_HMAC_SECRET } from '$env/static/private';

export const altcha = create({
	hmacSignatureSecret: ALTCHA_HMAC_SECRET,

	createChallengeParameters: () => ({
		algorithm: 'PBKDF2/SHA-256',
		cost: 5_000,
		counter: randomInt(5_000, 10_000),
		expiresAt: new Date(Date.now() + 600_000) // 10 minutes
	}),

	deriveKey,

	setCookie: {
		name: 'altcha',
		path: '/'
	},

	store: new CappedMap<string, boolean>({ maxSize: 1_000 })
});
