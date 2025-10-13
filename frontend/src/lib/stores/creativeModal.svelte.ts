import { get_raw_cdn_url } from '$lib/utils/getUrls';

/**
 * Reusable state management for CreativeModal component
 * Provides open/close functionality and URL generation for ad creatives
 *
 * @example
 * ```svelte
 * <script>
 *   import { createCreativeModal } from '$lib/stores/creativeModal.svelte';
 *   const creativeModal = createCreativeModal();
 * </script>
 *
 * <button onclick={() => creativeModal.open(md5Hash, 'mp4', 'My Creative')}>
 *   View Creative
 * </button>
 *
 * <CreativeModal
 *   bind:isOpen={creativeModal.isOpen}
 *   creativeUrl={creativeModal.creativeUrl}
 *   title={creativeModal.title}
 * />
 * ```
 */
export function createCreativeModal() {
	let isOpen = $state(false);
	let creativeUrl = $state('');
	let title = $state('');

	return {
		get isOpen() {
			return isOpen;
		},
		set isOpen(value: boolean) {
			isOpen = value;
		},
		get creativeUrl() {
			return creativeUrl;
		},
		get title() {
			return title;
		},

		/**
		 * Open modal with a creative
		 * @param md5Hash - The MD5 hash of the creative file
		 * @param fileExtension - File extension (mp4, jpg, png, webm, etc)
		 * @param creativeTitle - Display title for the modal
		 */
		open(md5Hash: string, fileExtension: string, creativeTitle: string) {
			creativeUrl = get_raw_cdn_url(md5Hash, fileExtension);
			title = `${creativeTitle} - Ad Creative`;
			isOpen = true;
		},

		/**
		 * Close the modal
		 */
		close() {
			isOpen = false;
		}
	};
}
