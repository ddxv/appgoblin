import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { myapp, myPackageInfo } = await parent();

	return {
		myPackageInfo,
		myapp,
		toFollow: 'noindex, nofollow',
		title: `App Queries in ${myapp.name}`,
		description: `Other apps that ${myapp.name} queries for availability.`
	};
};
