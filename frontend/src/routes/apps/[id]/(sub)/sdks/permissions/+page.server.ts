import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { myapp, myPackageInfo } = await parent();

	return {
		myPackageInfo,
		myapp,
		toFollow: 'noindex, nofollow',
		title: `Permissions in ${myapp.name}`,
		description: `Android permissions requested by ${myapp.name}.`
	};
};
