import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { myapp, myPackageInfo } = await parent();

	return {
		myPackageInfo,
		myapp,
		toFollow: 'noindex, nofollow',
		title: `SKAdNetwork in ${myapp.name}`,
		description: `SKAdNetwork identifiers found in ${myapp.name}.`
	};
};
