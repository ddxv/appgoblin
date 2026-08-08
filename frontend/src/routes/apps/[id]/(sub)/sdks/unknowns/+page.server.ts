import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { myapp, companyTypes, myPackageInfo } = await parent();

	return {
		myPackageInfo,
		myapp,
		companyTypes,
		toFollow: 'noindex, nofollow',
		title: `Unmapped SDKs in ${myapp.name}`,
		description: `Unrecognized SDKs and trackers found in ${myapp.name}.`
	};
};
