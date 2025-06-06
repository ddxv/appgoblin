-- noqa: disable=LT02
-- noqa: disable=LT08
-- noqa: disable=RF02
-- noqa: disable=PRS
-- SQLFluff currently unable to parse the double @ below
-- https://github.com/sqlfluff/sqlfluff/issues/4837
SELECT
    cac.tag_source,
    cac.store,
    cac.company_domain,
    cac.company_name,
    sum(app_count) AS app_count,
    coalesce(sum(installs_d30), 0) AS installs_d30,
    coalesce(sum(rating_count_d30), 0) AS rating_count_d30
FROM
    frontend.companies_category_tag_stats AS cac
WHERE
    cac.company_name ILIKE '%' || :searchinput || '%'
    OR cac.company_domain ILIKE '%' || :searchinput || '%'
GROUP BY
    cac.tag_source,
    cac.store,
    cac.company_domain,
    cac.company_name
ORDER BY
    app_count DESC
LIMIT :mylimit;
