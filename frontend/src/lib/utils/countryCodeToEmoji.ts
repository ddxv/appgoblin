export function countryCodeToEmoji(code: string): string {
		return code
			.toUpperCase()
			.split('')
			.map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
			.join('');
	}