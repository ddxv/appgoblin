import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({ out: 'build_tmp' }),

		prerender: {
			entries: [
				'*',
				'/blog',
				'/blog/apple-ios-ipa-downloads-working-again',
				'/blog/first-post',
				'/blog/free-ad-creatives-from-ad-networks',
				'/blog/new-app-marketing-and-aso-features-for-2025',
				'/blog/new-top-mobile-app-advertisers-this-month'
			]
		}
	}
};

export default config;
