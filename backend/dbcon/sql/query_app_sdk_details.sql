SELECT
    vs.xml_path,
    vs.value_name,
    c.name AS company_name,
    d.domain_name AS company_domain,
    c2.url_slug AS category_slug
FROM
    adtech.store_app_sdk_strings AS sass
LEFT JOIN store_apps sa ON sass.store_app = sa.id
LEFT JOIN
    version_strings AS vs
    ON
        sass.version_string_id = vs.id
LEFT JOIN adtech.companies c ON sass.company_id = c.id
LEFT JOIN domains d ON c.domain_id = d.id
LEFT JOIN adtech.company_categories cc ON sass.company_id = cc.company_id
LEFT JOIN adtech.categories c2 ON cc.category_id = c2.id
WHERE
    sa.store_id = :store_id
ORDER BY vs.xml_path, vs.value_name;
