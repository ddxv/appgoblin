import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { requireFullAuth } from '$lib/server/auth/auth';
import { userHasTierAccess } from '$lib/server/subscription';

/** Base URL of the public data bucket where run_reports.py uploads CSVs. */
const PUBLIC_DATA_URL = 'https://data.appgoblin.info';

/**
 * Build the S3 URL for a report's premium advertiser CSV.
 * Must match the key pattern in run_reports.py's _build_advertiser_csv_s3_key().
 */
function buildCsvUrl(slug: string): string {
	return `${PUBLIC_DATA_URL}/reports/${slug}/advertisers.csv`;
}

export async function GET(event: RequestEvent) {
	const { user } = requireFullAuth(event);

	const hasB2B = await userHasTierAccess(user.id, 'b2b_sdk', 'b2b_appads', 'b2b_premium');
	if (!hasB2B) {
		throw error(403, 'A B2B Intelligence subscription is required to download this CSV.');
	}

	// Derive the report slug from the request path:
	//   /reports/ad-user-acquisition-2026-june/advertisers-csv
	//   → slug = "ad-user-acquisition-2026-june"
	const pathParts = event.url.pathname.split('/').filter(Boolean);
	// pathParts = ["reports", "<slug>", "advertisers-csv"]
	const reportsIdx = pathParts.indexOf('reports');
	if (reportsIdx === -1 || reportsIdx + 1 >= pathParts.length) {
		throw error(500, 'Could not determine report slug from request path.');
	}
	const slug = pathParts[reportsIdx + 1];

	const csvUrl = buildCsvUrl(slug);

	let s3Response: Response;
	try {
		s3Response = await fetch(csvUrl);
	} catch (err) {
		console.error('S3 fetch failed for advertiser CSV:', err);
		throw error(502, 'Unable to reach the CSV storage. Please try again later.');
	}

	if (!s3Response.ok) {
		if (s3Response.status === 404) {
			throw error(404, 'The advertiser CSV for this report has not been published yet.');
		}
		console.error(
			`S3 returned ${s3Response.status} for advertiser CSV: ${csvUrl}`
		);
		throw error(502, 'Failed to retrieve the CSV from storage.');
	}

	// Stream the CSV back to the client
	return new Response(s3Response.body, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="appgoblin-${slug}-advertisers.csv"`
		}
	});
}
