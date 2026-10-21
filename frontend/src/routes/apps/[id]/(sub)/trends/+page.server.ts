import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { getCachedData } from '../../../../../hooks.server';
import type { AppCountryMetrics } from '../../../../../types';

export const load: PageServerLoad = async ({ fetch, params, parent, url }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	const { myapp } = await parent();
	const selectedCountryParam = url.searchParams.get('country');
	const { countries } = await getCachedData();

	const availableCountries = Object.entries(countries)
		.filter(([, value]) => value.app_details)
		.map(([code, value]) => ({ code: code.toUpperCase(), name: value.langen }))
		.sort((a, b) => a.name.localeCompare(b.name));

	const selectedCountry = selectedCountryParam ? selectedCountryParam.toUpperCase() : 'global';
	const selectedCountryIsValid =
		selectedCountry !== 'global' &&
		availableCountries.some((country) => country.code === selectedCountry);

	let appMetrics = [];
	if (selectedCountryIsValid) {
		const appCountryMetrics = await api.get(
			`/apps/${id}/country-metrics-history`,
			'App Country Metrics History'
		);
		appMetrics = (appCountryMetrics as AppCountryMetrics[]).filter(
			(metric) => String(metric.country).toUpperCase() === selectedCountry
		);
	} else {
		appMetrics = await api.get(`/apps/${id}/global-metrics-history`, 'App Global Metrics History');
	}

	return {
		appMetrics,
		selectedCountry: selectedCountryIsValid ? selectedCountry : 'global',
		availableCountries,
		// Meta Tags
		toFollow: 'noindex, nofollow',
		title: `Install and Rating History for ${myapp.name}`,
		description: `Explore the install and rating history for ${myapp.name}. See the install and rating history for ${myapp.name}.`,
		keywords: `trends, install history, rating history, install and rating history`
	};
};
