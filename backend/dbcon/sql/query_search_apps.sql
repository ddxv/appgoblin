-- noqa: disable=LT02
-- noqa: disable=LT08
-- noqa: disable=RF02
-- noqa: disable=PRS
-- SQLFluff currently unable to parse the double @ below
-- https://github.com/sqlfluff/sqlfluff/issues/4837
WITH apps AS (
    SELECT *
    FROM
        store_apps
    WHERE
        textsearchable_index_col @@ to_tsquery(
            'simple',
            :searchinput
        )
)
SELECT
   a.store,
   a.store_id,
   a.name,
   a.icon_url_100,
   a.icon_url_512,
   a.featured_image_url,
   agml.installs,
   agml.rating,
   agml.rating_count
FROM apps AS a
   LEFT JOIN app_global_metrics_latest AS agml ON a.id = agml.store_app
ORDER BY
   (
        coalesce(
            agml.installs,
coalesce(
            agml.rating_count,
            0
        )
        )
    ) DESC NULLS LAST
LIMIT :mylimit;
