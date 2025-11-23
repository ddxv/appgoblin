-- noqa: disable=LT02
-- noqa: disable=LT08
-- noqa: disable=RF02
-- noqa: disable=PRS
-- SQLFluff currently unable to parse the double @ below
-- https://github.com/sqlfluff/sqlfluff/issues/4837
WITH apps AS (
    SELECT *
    FROM store_apps
    WHERE textsearchable_index_col @@ to_tsquery('simple', :searchinput)
),
ranked_apps AS (
    SELECT
        a.*,
        agml.installs,
        agml.rating,
        agml.rating_count,
        row_number() OVER (
            PARTITION BY a.store
            ORDER BY
                coalesce(agml.installs, agml.rating_count, 0) DESC NULLS LAST
        ) AS store_rank,
        row_number() OVER (
            ORDER BY
                a.store,
                coalesce(agml.installs, agml.rating_count, 0) DESC NULLS LAST
        ) % (SELECT count(DISTINCT store) FROM apps) AS round_robin_rank
    FROM apps AS a
    LEFT JOIN app_global_metrics_latest AS agml ON a.id = agml.store_app
)
SELECT
    store,
store_id,
name,
icon_url_100,
icon_url_512,
    featured_image_url,
installs,
rating,
rating_count
FROM ranked_apps
ORDER BY store_rank, round_robin_rank
LIMIT :mylimit;
