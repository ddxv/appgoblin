SELECT
    cdm.company_id,
    ad.domain_name
FROM
    adtech.company_domain_mapping AS cdm
LEFT JOIN domains AS ad
    ON
        cdm.domain_id = ad.id
WHERE
    cdm.domain_id NOT IN (
        SELECT domain_id
        FROM
            adtech.companies
    );
