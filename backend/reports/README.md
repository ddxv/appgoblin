# Report Export CLI

This directory contains manual tooling for monthly report generation.

## Current flow

1. Copy the previous frontend report route under `frontend/src/routes/reports/`.
2. Copy or create the matching SQL directory under `backend/reports/queries/`.
3. Update the SQL files for the new report month.
4. Run the CLI to export one JSON file per SQL file into the matching frontend route.
5. Update the report narrative and layout manually in `+page.svelte`.

## Query layout

Use one SQL file per report section under a directory matching the report slug.

Example:

- `backend/reports/queries/ad-user-acquisition-2026-february/summary_executive.sql`
- `backend/reports/queries/ad-user-acquisition-2026-february/impact_growth.sql`
- `backend/reports/queries/ad-user-acquisition-2026-february/creatives.sql`
- `backend/reports/queries/ad-user-acquisition-2026-february/ad_networks_landscape.sql`
- `backend/reports/queries/ad-user-acquisition-2026-february/reach.sql`

The CLI writes JSON files with the same stem into the frontend route directory.

## Supported bind parameters

These are supplied automatically to every query:

- `:start_date`
- `:next_month_start_date`
- `:first_target_week`

`first_target_week` is the first Monday of the report month (on or after day 1). It exists for queries like impact growth that rank weekly windows rather than simple month-bounded events.

## Usage

From the repo root:

```bash
source backend/.venv/bin/activate
python backend/reports/run_reports.py ad-user-acquisition-2026-february
```

You can also pass only the year-month part for ad user acquisition reports:

```bash
python backend/reports/run_reports.py 2026-february
```

If you accidentally use a shell-style key-value positional argument, that works too:

```bash
python backend/reports/run_reports.py report=ad-user-acquisition-2026-february
```

Run only one section while iterating on a broken query:

```bash
python backend/reports/run_reports.py ad-user-acquisition-2026-february --section impact_growth
```

Use a different configured database server if needed:

```bash
python backend/reports/run_reports.py ad-user-acquisition-2026-february --server madrone
```

## Output

For `ad-user-acquisition-2026-february`, the CLI writes into:

- `frontend/src/routes/reports/ad-user-acquisition-2026-february/summary_executive.json`
- `frontend/src/routes/reports/ad-user-acquisition-2026-february/impact_growth.json`
- `frontend/src/routes/reports/ad-user-acquisition-2026-february/creatives.json`
- `frontend/src/routes/reports/ad-user-acquisition-2026-february/ad_networks_landscape.json`
- `frontend/src/routes/reports/ad-user-acquisition-2026-february/reach.json`

## Notes

- The executable SQL source of truth lives in `backend/reports/queries/`.
- The frontend `queries.sql` file can stay as a reproducibility document.
- The CLI expects the target frontend report route directory to already exist.
