SELECT *
FROM
    adtech.companies_parent_by_d30_counts
WHERE category_id IN :categories;
