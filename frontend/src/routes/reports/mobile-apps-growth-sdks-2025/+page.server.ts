import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

interface SdkGrowthData {
	company: string;
	companyName: string;
	category: string;
	appsAnalyzed: number;
	h1Apps: number;
	h2Apps: number;
	net: number;
	changePercent: number;
	logoUrl: string | null;
}

function parseCSV(csvContent: string): SdkGrowthData[] {
	const lines = csvContent.trim().split('\n');
	const data: SdkGrowthData[] = [];

	// Skip header row
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		const parts = line.split(',');

		if (parts.length >= 8) {
			const changePercentRaw = parseFloat(parts[7]);
			// Convert decimal to percentage (e.g., 0.4242 -> 42.42)
			const changePercent = changePercentRaw * 100;

			data.push({
				company: parts[0].trim(),
				companyName: parts[1].trim(),
				category: parts[2].trim(),
				appsAnalyzed: parseInt(parts[3], 10),
				h1Apps: parseInt(parts[4], 10),
				h2Apps: parseInt(parts[5], 10),
				net: parseInt(parts[6], 10),
				changePercent,
				logoUrl: parts[8]?.trim() || null
			});
		}
	}

	return data;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const csvResponse = await fetch(
		'/reports/mobile-apps-growth-sdks-2025/AppGoblin App SDKs Growth 2025.csv'
	);

	if (!csvResponse.ok) {
		throw error(500, 'CSV not available');
	}

	const csvContent = await csvResponse.text();

	const allData = parseCSV(csvContent);

	// Top 10 growth companies (positive change, sorted descending)
	const topGrowth = allData
		.filter((d) => d.changePercent > 0)
		.sort((a, b) => b.changePercent - a.changePercent)
		.slice(0, 10);

	// Top 10 shrinking companies (negative change, sorted by most negative)
	const topShrinking = allData
		.filter((d) => d.changePercent < 0)
		.sort((a, b) => a.changePercent - b.changePercent)
		.slice(0, 10);

	// Summary statistics
	const totalCompanies = allData.length;
	const growingCompanies = allData.filter((d) => d.changePercent > 0).length;
	const shrinkingCompanies = allData.filter((d) => d.changePercent < 0).length;
	const flatCompanies = allData.filter((d) => d.changePercent === 0).length;
	const appsAnalyzed = allData[0]?.appsAnalyzed ?? 0;

	// Get unique categories
	const categories = [...new Set(allData.map((d) => d.category))].sort();

	return {
		topGrowth,
		topShrinking,
		allData,
		categories,
		summary: {
			totalCompanies,
			growingCompanies,
			shrinkingCompanies,
			flatCompanies,
			appsAnalyzed,
			reportPeriod: '2025 (H1 vs H2)'
		},
		title: 'App SDK Growth Report 2025 | AppGoblin',
		description:
			'Analysis of mobile app SDK adoption trends in 2025. See which SDK providers grew and which saw declines in app integrations.',
		keywords:
			'mobile SDK, app SDK growth, SDK adoption, mobile app development, SDK analytics, app integrations'
	};
};
