SELECT
    sa.*,
    akr.crawled_date,
    akr.rank
FROM app_keyword_rankings AS akr
LEFT JOIN keywords AS k ON akr.keyword = k.id
LEFT JOIN store_apps AS sa ON akr.store_app = sa.id
WHERE
    k.keyword_text = :keyword
    AND akr.crawled_date = (
        SELECT MAX(akr2.crawled_date)
        FROM app_keyword_rankings AS akr2
        LEFT JOIN keywords AS k2 ON akr2.keyword = k2.id
        WHERE k2.keyword_text = :keyword
    )
    AND akr.rank < :rank
    AND akr.country = 840 AND akr.lang = 1;
