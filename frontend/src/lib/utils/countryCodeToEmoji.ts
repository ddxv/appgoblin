export function countryCodeToEmoji(code: string): string {
	if (!code) {
		return '';
	}
	return code
		.toUpperCase()
		.split('')
		.map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
		.join('');
}
