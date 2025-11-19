import { createHmac } from "crypto";


/**
 * Some functions are adapted from https://github.com/oslojs
*/


const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE32_LOWERCASE_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const HEX_ALPHABET_LOWER = "0123456789abcdef";

export function encodeBase32(
	bytes: Uint8Array,
	padding: boolean = false,
	uppercase: boolean = true
): string {
	let result = "";
	let alphabet = uppercase ? BASE32_ALPHABET : BASE32_LOWERCASE_ALPHABET;
	for (let i = 0; i < bytes.byteLength; i += 5) {
		let buffer = 0n;
		let bufferBitSize = 0;
		for (let j = 0; j < 5 && i + j < bytes.byteLength; j++) {
			buffer = (buffer << 8n) | BigInt(bytes[i + j]);
			bufferBitSize += 8;
		}
		if (bufferBitSize % 5 !== 0) {
			buffer = buffer << BigInt(5 - (bufferBitSize % 5));
			bufferBitSize += 5 - (bufferBitSize % 5);
		}
		for (let j = 0; j < 8; j++) {
			if (bufferBitSize >= 5) {
				result += alphabet[Number((buffer >> BigInt(bufferBitSize - 5)) & 0x1fn)];
				bufferBitSize -= 5;
			} else if (bufferBitSize > 0) {
				result += alphabet[Number((buffer << BigInt(6 - bufferBitSize)) & 0x3fn)];
				bufferBitSize = 0;
			} else if (padding) {
				result += "=";
			}
		}
	}
	return result;
}


export function generateRandomOTP(): string {
	const bytes = new Uint8Array(5);
	crypto.getRandomValues(bytes);
	const code = encodeBase32(bytes, false);
	return code;
}

export function generateRandomRecoveryCode(): string {
	const recoveryCodeBytes = new Uint8Array(10);
	crypto.getRandomValues(recoveryCodeBytes);
	const recoveryCode = encodeBase32(recoveryCodeBytes, false);
	return recoveryCode;
}



export function encodeBase64(
	bytes: Uint8Array,
	padding: boolean = true
): string {
	let result = "";
	for (let i = 0; i < bytes.byteLength; i += 3) {
		let buffer = 0;
		let bufferBitSize = 0;
		for (let j = 0; j < 3 && i + j < bytes.byteLength; j++) {
			buffer = (buffer << 8) | bytes[i + j];
			bufferBitSize += 8;
		}
		for (let j = 0; j < 4; j++) {
			if (bufferBitSize >= 6) {
				result += BASE64_ALPHABET[(buffer >> (bufferBitSize - 6)) & 0x3f];
				bufferBitSize -= 6;
			} else if (bufferBitSize > 0) {
				result += BASE64_ALPHABET[(buffer << (6 - bufferBitSize)) & 0x3f];
				bufferBitSize = 0;
			} else if (padding) {
				result += "=";
			}
		}
	}
	return result;
}


export function decodeBase64(
	encoded: string,
	padding: boolean = true
): Uint8Array {
	const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
	let totalBytes = 0;
	for (let i = 0; i < encoded.length; i += 4) {
		let chunk = 0;
		let bitsRead = 0;
		for (let j = 0; j < 4; j++) {
			if (padding && encoded[i + j] === "=") {
				continue;
			}
			if (
				!padding &&
				(i + j >= encoded.length || encoded[i + j] === "=")
			) {
				continue;
			}
			if (j > 0 && encoded[i + j - 1] === "=") {
				throw new Error("Invalid padding");
			}
			if (!(encoded[i + j] in base64DecodeMap)) {
				throw new Error("Invalid character");
			}
			chunk |= base64DecodeMap[encoded[i + j] as keyof typeof base64DecodeMap] << ((3 - j) * 6);
			bitsRead += 6;
		}
		if (bitsRead < 24) {
			let unused: number;
			if (bitsRead === 12) {
				unused = chunk & 0xffff;
			} else if (bitsRead === 18) {
				unused = chunk & 0xff;
			} else {
				throw new Error("Invalid padding");
			}
			if (unused !== 0) {
				throw new Error("Invalid padding");
			}
		}
		const byteLength = Math.floor(bitsRead / 8);
		for (let i = 0; i < byteLength; i++) {
			result[totalBytes] = (chunk >> (16 - i * 8)) & 0xff;
			totalBytes++;
		}
	}
	return result.slice(0, totalBytes);
}


const base64DecodeMap = {
	"0": 52,
	"1": 53,
	"2": 54,
	"3": 55,
	"4": 56,
	"5": 57,
	"6": 58,
	"7": 59,
	"8": 60,
	"9": 61,
	A: 0,
	B: 1,
	C: 2,
	D: 3,
	E: 4,
	F: 5,
	G: 6,
	H: 7,
	I: 8,
	J: 9,
	K: 10,
	L: 11,
	M: 12,
	N: 13,
	O: 14,
	P: 15,
	Q: 16,
	R: 17,
	S: 18,
	T: 19,
	U: 20,
	V: 21,
	W: 22,
	X: 23,
	Y: 24,
	Z: 25,
	a: 26,
	b: 27,
	c: 28,
	d: 29,
	e: 30,
	f: 31,
	g: 32,
	h: 33,
	i: 34,
	j: 35,
	k: 36,
	l: 37,
	m: 38,
	n: 39,
	o: 40,
	p: 41,
	q: 42,
	r: 43,
	s: 44,
	t: 45,
	u: 46,
	v: 47,
	w: 48,
	x: 49,
	y: 50,
	z: 51,
	"+": 62,
	"/": 63
};


export function encodeHexLowerCase(data: Uint8Array): string {
	let result = "";
	for (let i = 0; i < data.length; i++) {
		result += HEX_ALPHABET_LOWER[data[i] >> 4];
		result += HEX_ALPHABET_LOWER[data[i] & 0x0f];
	}
	return result;
}



export async function sha256(input: Uint8Array): Promise<Uint8Array> {
    // Force into a plain Uint8Array backed by a real ArrayBuffer
    const bytes = new Uint8Array(input);

    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return new Uint8Array(hash);
}





export function createTOTPKeyURI(
	issuer: string,
	accountName: string,
	key: Uint8Array,
	periodInSeconds: number,
	digits: number
): string {
	const encodedIssuer = encodeURIComponent(issuer);
	const encodedAccountName = encodeURIComponent(accountName);
	const base = `otpauth://totp/${encodedIssuer}:${encodedAccountName}`;
	const params = new URLSearchParams();
	params.set("issuer", issuer);
	params.set("algorithm", "SHA1");
	params.set("secret", encodeBase32(key, false, true));
	params.set("period", periodInSeconds.toString());
	params.set("digits", digits.toString());
	return base + "?" + params.toString();
}



export function generateHOTP(key: Uint8Array, counter: bigint, digits: number): string {
	if (digits < 6 || digits > 8) {
		throw new TypeError("Digits must be between 6 and 8");
	}
	
	// Convert counter to big-endian bytes
	const counterBytes = new Uint8Array(8);
	for (let i = 7; i >= 0; i--) {
		counterBytes[i] = Number(counter & 0xFFn);
		counter >>= 8n;
	}
	
	// Use Web Crypto API for HMAC-SHA1
	const hmacInstance = createHmac("sha1", key);
	hmacInstance.update(counterBytes);
	const HS = new Uint8Array(hmacInstance.digest());
	
	const hsArray = new Uint8Array(HS);
	const offset = hsArray[hsArray.byteLength - 1] & 0x0f;
	const truncated = hsArray.slice(offset, offset + 4);
	truncated[0] &= 0x7f;
	
	// Read 32-bit big-endian integer
	const SNum = new DataView(truncated.buffer).getUint32(0, false);
	const D = SNum % 10 ** digits;
	return D.toString().padStart(digits, "0");
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.length; i++) {
		c |= a[i]! ^ b[i]!;
	}
	return c === 0;
}

export function verifyHOTP(key: Uint8Array, counter: bigint, digits: number, otp: string): boolean {
	if (digits < 6 || digits > 8) {
		throw new TypeError("Digits must be between 6 and 8");
	}
	if (otp.length !== digits) {
		return false;
	}
	const bytes = new TextEncoder().encode(otp);
	const expected = generateHOTP(key, counter, digits);
	const expectedBytes = new TextEncoder().encode(expected);
	const valid = constantTimeEqual(bytes, expectedBytes);
	return valid;
}


export function verifyTOTP(
	key: Uint8Array,
	intervalInSeconds: number,
	digits: number,
	otp: string
): boolean {
	const counter = BigInt(Math.floor(Date.now() / (intervalInSeconds * 1000)));
	const valid = verifyHOTP(key, counter, digits, otp);
	return valid;
}



export function verifyTOTPWithGracePeriod(
	key: Uint8Array,
	intervalInSeconds: number,
	digits: number,
	otp: string,
	gracePeriodInSeconds: number
): boolean {
	if (gracePeriodInSeconds < 0) {
		throw new TypeError("Grace period must be a positive number");
	}
	const nowUnixMilliseconds = Date.now();
	let counter = BigInt(
		Math.floor((nowUnixMilliseconds - gracePeriodInSeconds * 1000) / (intervalInSeconds * 1000))
	);
	const maxCounterInclusive = BigInt(
		Math.floor((nowUnixMilliseconds + gracePeriodInSeconds * 1000) / (intervalInSeconds * 1000))
	);
	while (counter <= maxCounterInclusive) {
		const valid = verifyHOTP(key, counter, digits, otp);
		if (valid) {
			return true;
		}
		counter++;
	}
	return false;
}