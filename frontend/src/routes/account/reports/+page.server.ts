import { requireAuthOr401 } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import type { PageServerLoad } from './$types';

interface GeneratedReportRow {
	id: number;
	report_name: string;
	s3_key: string;
	row_count: number | null;
	created_at: Date;
}

export const load: PageServerLoad = async (event) => {
	const { user } = requireAuthOr401(event);
	const reports = await db.query<GeneratedReportRow>(
		`SELECT id, report_name, s3_key, row_count, created_at
		 FROM user_generated_reports
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT 25`,
		[user.id]
	);
	const generatedReports = reports.map((report) => {
		return {
			id: report.id,
			reportName: report.report_name,
			rowCount: report.row_count,
			createdAt: report.created_at.toISOString()
		};
	});

	return { generatedReports };
};
