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
SELECT * FROM apps
ORDER BY
   (
        coalesce(
            installs,
coalesce(
            rating_count * 100,
            0
        )
        )
    ) DESC NULLS LAST
LIMIT :mylimit;
