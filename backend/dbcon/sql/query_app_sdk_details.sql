SELECT
    vs.xml_path,
    vs.value_name,
    cavd.company_name,
    cavd.company_domain,
    cavd.category_slug
FROM
    frontend.store_apps_version_details AS cavd
LEFT JOIN
    version_strings AS vs
    ON
        cavd.version_string_id = vs.id
WHERE
    cavd.store_id = :store_id
ORDER BY vs.xml_path, vs.value_name;
