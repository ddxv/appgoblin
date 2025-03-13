import type { PageServerLoad } from './$types.js';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ parent }) => {
	const { devs } = await parent();

	try {
		return {
			devs
		};
	} catch (error) {
		console.error('Failed to load data:', error);
		return {
			devs: {},
			status: 500,
			error: 'Failed to load developer apps'
		};
	}
};
