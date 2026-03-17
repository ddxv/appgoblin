/**
 * Formats a number with appropriate suffix (K, M, B, T)
 * @param num - The number to format
 * @returns Formatted string with suffix
 */
export function formatNumber(num: number): string | number {
	if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
	if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
	if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	if (num >= 10) return num.toFixed(0);
	if (num < 10 && num > 0) return num.toFixed(2);
	return num;
}

/**
 * Formats a number with locale string (adds commas)
 * @param num - The number to format
 * @returns Formatted string with commas
 */
export function formatNumberLocale(num: number): string {
	if (num) {
		return num.toLocaleString();
	} else {
		return '';
	}
}

/**
 * Formats revenue into threshold buckets with $ prefix.
 * Uses lower-bound labels (e.g., '$100K+') and reserves '<' for the smallest bucket.
 * @param value - The revenue value to bucket
 * @returns Formatted string with bucket label (e.g., '$1M+') or empty string
 */
export function getRevenueBucket(value: number): string {
	if (value <= 0) return '';

	if (value < 10000) return '$<10K';
	if (value >= 10000000) return '$10M+';
	if (value >= 1000000) return '$1M+';
	if (value >= 500000) return '$500K+';
	if (value >= 200000) return '$200K+';
	if (value >= 100000) return '$100K+';
	if (value >= 50000) return '$50K+';

	return '$10K+';
}

/**
 * Formats counts into broad MAU-style buckets.
 * Uses lower-bound labels (e.g. '100K+') and reserves '<' for the smallest bucket.
 * @param value - The count to bucket
 * @returns Bucket label (e.g. '1M+') or empty string
 */
export function getMauBucket(value: number): string {
	if (value <= 0) return '';

	if (value < 10000) return '<10K';
	if (value >= 10000000) return '10M+';
	if (value >= 1000000) return '1M+';
	if (value >= 500000) return '500K+';
	if (value >= 200000) return '200K+';
	if (value >= 100000) return '100K+';
	if (value >= 50000) return '50K+';

	return '10K+';
}
