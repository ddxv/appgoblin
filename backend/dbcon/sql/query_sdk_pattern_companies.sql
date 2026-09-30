SELECT
	company_name,
	company_domain,
	sp.parent_company_domain,
	sdk_name,
	pattern_type,
	pattern_value,
	app_count,
	parent_company_name
FROM
	frontend.companies_sdks_overview sp
WHERE
	sp.pattern_value ILIKE :value_pattern || '%'
	OR 
	:value_pattern ILIKE sp.pattern_value || '%'
;
