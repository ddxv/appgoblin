import type { PageServerLoad } from './$types';
import { requireAuthOr401 } from '$lib/server/auth/auth';

export const load: PageServerLoad = async (event) => {
	requireAuthOr401(event);
	const { myapp, myPackageInfo } = await event.parent();

	return {
		myPackageInfo,
		myapp,
		toFollow: 'noindex, nofollow',
		title: `SKAdNetwork in ${myapp.name}`,
		description: `SKAdNetwork identifiers found in ${myapp.name}.`
	};
};
