import { error, redirect } from '@sveltejs/kit';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';
import type { RequestHandler } from './$types';

interface GeneratedReportRow {
	s3_key: string;
}

export const GET: RequestHandler = async (event) => {
	const { user } = requireAuthOr401(event);
	const reportId = Number(event.params.id);

	if (!Number.isSafeInteger(reportId) || reportId < 1) {
		error(400, 'Invalid report ID.');
	}

	const reports = await db.query<GeneratedReportRow>(
		`SELECT s3_key
		 FROM user_generated_reports
		 WHERE id = $1 AND user_id = $2
		 LIMIT 1`,
		[reportId, user.id]
	);
	const report = reports[0];

	if (!report) {
		error(404, 'Report not found.');
	}

	const api = createApiClient(event.fetch);
	const signed = (await api.get(
		`/internal/exports/user-report-signed-url?s3_key=${encodeURIComponent(report.s3_key)}`,
		'User Report Download'
	)) as { url?: string };

	if (!signed.url) {
		error(502, 'The report download URL could not be created.');
	}

	redirect(303, signed.url);
};
