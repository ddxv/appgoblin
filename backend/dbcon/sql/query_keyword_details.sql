SELECT *
FROM
    frontend.keyword_scores AS ks
WHERE
    ks.keyword_text = ks.:keyword;
