SELECT
    *
FROM
    frontend.keyword_scores ks
WHERE
    ks.keyword_text = :keyword
;