/**
 * Generate URL for raw creative files on CDN
 * Uses 2-character prefix subdirectory for file organization
 * @param md5_hash - MD5 hash of the creative file
 * @param extension - File extension (e.g., 'mp4', 'jpg', 'png')
 * @returns Full CDN URL for the raw creative file
 */
export function get_raw_cdn_url(md5_hash: string, extension: string): string {
	const prefix = md5_hash.substring(0, 3);
	return `https://media.appgoblin.info/creatives/raw/${prefix}/${md5_hash}.${extension}`;
}
