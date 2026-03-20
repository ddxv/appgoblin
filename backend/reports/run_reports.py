"""Run monthly report SQL files and export JSON artifacts."""

from __future__ import annotations

import argparse
import calendar
import importlib
import json
import pathlib
import sys
from dataclasses import dataclass
from datetime import date, timedelta
from typing import TYPE_CHECKING, Any

import pandas as pd
from sqlalchemy import text

if TYPE_CHECKING:
    from sqlalchemy.engine import Engine

try:
    from config import MODULE_DIR, get_logger
    from dbcon.connections import get_db_connection
except ModuleNotFoundError:
    backend_dir = pathlib.Path(__file__).resolve().parents[1]
    backend_dir_text = str(backend_dir)
    if backend_dir_text not in sys.path:
        sys.path.insert(0, backend_dir_text)

    config_module = importlib.import_module("config")
    MODULE_DIR = config_module.MODULE_DIR
    get_logger = config_module.get_logger
    get_db_connection = importlib.import_module("dbcon.connections").get_db_connection

logger = get_logger(__name__, log_name="reports")
QUERY_ROOT = MODULE_DIR / "reports" / "queries"
REPORT_ROUTE_ROOT = MODULE_DIR.parent / "frontend" / "src" / "routes" / "reports"
DEFAULT_REPORT_PREFIX = "ad-user-acquisition-"
MIN_SLUG_PARTS = 2


@dataclass(frozen=True)
class ReportContext:
    """Resolved metadata and paths for a report export run."""

    slug: str
    query_dir: pathlib.Path
    route_dir: pathlib.Path
    start_date: date
    next_month_start_date: date
    first_target_week: date


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(
        description=(
            "Run monthly report SQL and export JSON into the frontend report route."
        ),
    )
    parser.add_argument(
        "report",
        help=(
            "Report slug or YYYY-month value. Examples: "
            "ad-user-acquisition-2026-february or 2026-february"
        ),
    )
    parser.add_argument(
        "--server",
        default="madrone",
        help="Database server key from config.toml. Defaults to madrone.",
    )
    parser.add_argument(
        "--section",
        action="append",
        dest="sections",
        default=[],
        help="Only run a specific section filename stem. Can be passed multiple times.",
    )
    return parser.parse_args()


def normalize_report_slug(report_value: str) -> str:
    """Resolve a CLI report argument to a report slug."""
    if report_value.startswith("report="):
        report_value = report_value.split("=", maxsplit=1)[1]

    query_candidate = QUERY_ROOT / report_value
    route_candidate = REPORT_ROUTE_ROOT / report_value
    if query_candidate.is_dir() or route_candidate.is_dir():
        return report_value

    prefixed_value = f"{DEFAULT_REPORT_PREFIX}{report_value}"
    prefixed_query_candidate = QUERY_ROOT / prefixed_value
    prefixed_route_candidate = REPORT_ROUTE_ROOT / prefixed_value
    if prefixed_query_candidate.is_dir() or prefixed_route_candidate.is_dir():
        return prefixed_value

    message = (
        f"Could not resolve report '{report_value}'. Expected a directory under "
        f"{QUERY_ROOT} or {REPORT_ROUTE_ROOT}."
    )
    raise FileNotFoundError(message)


def parse_month_from_slug(slug: str) -> tuple[int, int]:
    """Extract year and month number from the trailing slug components."""
    parts = slug.split("-")
    if len(parts) < MIN_SLUG_PARTS:
        message = f"Report slug '{slug}' does not include a year and month."
        raise ValueError(message)

    year_str = parts[-2]
    month_name = parts[-1].lower()

    try:
        year = int(year_str)
    except ValueError as exc:
        message = f"Report slug '{slug}' has an invalid year component."
        raise ValueError(message) from exc

    month_lookup = {
        month.lower(): month_number
        for month_number, month in enumerate(calendar.month_name)
        if month
    }
    if month_name not in month_lookup:
        message = f"Report slug '{slug}' has an invalid month component."
        raise ValueError(message)

    return year, month_lookup[month_name]


def add_months(value: date, month_count: int) -> date:
    """Add whole calendar months to a date aligned to the first of the month."""
    month_index = value.month - 1 + month_count
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    return date(year, month, 1)


def build_report_context(report_value: str) -> ReportContext:
    """Resolve filesystem paths and derived date parameters for a report run."""
    slug = normalize_report_slug(report_value)
    query_dir = QUERY_ROOT / slug
    route_dir = REPORT_ROUTE_ROOT / slug

    if not query_dir.is_dir():
        message = f"Missing query directory: {query_dir}"
        raise FileNotFoundError(message)
    if not route_dir.is_dir():
        message = f"Missing frontend report directory: {route_dir}"
        raise FileNotFoundError(message)

    year, month = parse_month_from_slug(slug)
    start_date = date(year, month, 1)
    next_month_start_date = add_months(start_date, 1)
    # First Monday of month
    first_target_week = start_date + timedelta(days=(-start_date.weekday()) % 7)

    return ReportContext(
        slug=slug,
        query_dir=query_dir,
        route_dir=route_dir,
        start_date=start_date,
        next_month_start_date=next_month_start_date,
        first_target_week=first_target_week,
    )


def get_sql_files(
    query_dir: pathlib.Path, selected_sections: list[str]
) -> list[pathlib.Path]:
    """Return the SQL files to execute in deterministic order."""
    sql_files = sorted(path for path in query_dir.glob("*.sql") if path.is_file())
    if not sql_files:
        message = f"No SQL files found in {query_dir}"
        raise FileNotFoundError(message)

    if not selected_sections:
        return sql_files

    section_set = set(selected_sections)
    filtered_files = [path for path in sql_files if path.stem in section_set]
    found_sections = {path.stem for path in filtered_files}
    missing_sections = sorted(section_set - found_sections)
    if missing_sections:
        missing_text = ", ".join(missing_sections)
        message = f"Unknown report section(s): {missing_text}"
        raise FileNotFoundError(message)

    return filtered_files


def build_query_params(context: ReportContext) -> dict[str, date]:
    """Build the default bind parameters shared across report SQL files."""
    return {
        "start_date": context.start_date,
        "next_month_start_date": context.next_month_start_date,
        "first_target_week": context.first_target_week,
    }


def execute_query(
    sql_path: pathlib.Path,
    params: dict[str, date],
    engine: Engine,
) -> pd.DataFrame:
    """Execute a single SQL file and return its result DataFrame."""
    sql_text = sql_path.read_text(encoding="utf-8")
    return pd.read_sql(text(sql_text), engine, params=params)


def dataframe_to_records(frame: pd.DataFrame) -> list[dict[str, Any]]:
    """Convert a DataFrame to JSON-safe records using ISO datetimes."""
    if frame.empty:
        return []
    return json.loads(frame.to_json(orient="records", date_format="iso"))


def write_json_output(output_path: pathlib.Path, records: list[dict[str, Any]]) -> None:
    """Write JSON records with stable pretty formatting."""
    output_path.write_text(f"{json.dumps(records, indent=2)}\n", encoding="utf-8")


def run_report(
    context: ReportContext, server_name: str, selected_sections: list[str]
) -> int:
    """Execute all selected report queries and write JSON artifacts."""
    params = build_query_params(context)
    sql_files = get_sql_files(context.query_dir, selected_sections)
    dbcon = get_db_connection(server_name)

    logger.info("Running report %s", context.slug)
    logger.info("Using query directory %s", context.query_dir)
    logger.info("Writing JSON into %s", context.route_dir)

    try:
        for sql_path in sql_files:
            logger.info("Executing %s", sql_path.name)
            frame = execute_query(sql_path, params=params, engine=dbcon.engine)
            output_path = context.route_dir / f"{sql_path.stem}.json"
            records = dataframe_to_records(frame)
            write_json_output(output_path, records)
            logger.info("Wrote %s rows to %s", len(records), output_path)
    finally:
        dbcon.engine.dispose()

    return 0


def main() -> int:
    """CLI entrypoint."""
    args = parse_args()
    context = build_report_context(args.report)
    return run_report(context, server_name=args.server, selected_sections=args.sections)


if __name__ == "__main__":
    raise SystemExit(main())
