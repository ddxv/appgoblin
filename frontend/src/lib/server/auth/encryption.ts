import { decodeBase64 } from "./utils";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { ENCRYPTION_KEY } from "$env/static/private";

const key = decodeBase64(ENCRYPTION_KEY);

export function encrypt(data: Uint8Array): Uint8Array {
	const iv = randomBytes(16); // Use Node.js crypto for consistency
	const cipher = createCipheriv("aes-128-gcm", key, iv);
	
	return Buffer.concat([
		iv,
		cipher.update(data),
		cipher.final(),
		cipher.getAuthTag()
	]);
}

export function encryptString(data: string): Uint8Array {
	return encrypt(new TextEncoder().encode(data));
}

export function decrypt(encrypted: Uint8Array): Uint8Array {
	if (encrypted.byteLength < 33) {
		throw new Error("Invalid data");
	}
	
	const iv = encrypted.slice(0, 16);
	const authTag = encrypted.slice(-16); // Cleaner than byteLength - 16
	const ciphertext = encrypted.slice(16, -16);
	
	const decipher = createDecipheriv("aes-128-gcm", key, iv);
	decipher.setAuthTag(authTag);
	
	return Buffer.concat([
		decipher.update(ciphertext),
		decipher.final()
	]);
}

export function decryptToString(data: Uint8Array): string {
	return new TextDecoder().decode(decrypt(data));
}