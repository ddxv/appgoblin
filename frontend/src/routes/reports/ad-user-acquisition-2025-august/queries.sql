--
-- AppGoblin User Acquisition Report - August 2025
-- https://appgoblin.info/reports/ad-user-acquisition-2025-august
-- SQL Query Reproducibility Documentation
--
-- This file contains all SQL queries used to generate the data for the August 2025
-- User Acquisition Intelligence Report. These queries are provided for reproducibility
-- and transparency of the data sources and methodologies used in this analysis.
--
-- IMPORTANT NOTES:
-- - These queries are intended to be run against the AppGoblin database as of October 2025
-- - Data is filtered to the period: August 1, 2025 - August 31, 2025 (inclusive)
-- - Results may vary if run against updated database versions or after schema changes
-- - Each query section corresponds to a specific report section (see headers below)
--
-- Report Sections:
-- 1. SUMMARY EXECUTIVE - Key metrics dashboard
-- 2. IMPACT GROWTH - App growth table with creative and MMP details
-- 3. CREATIVES - Creative performance analysis
-- 4. AD NETWORKS LANDSCAPE - Ad network distribution and reach
-- 5. REACH - Publisher reach analysis by advertiser
--
-- For questions about methodology or data validation, refer to the report's
-- Executive Summary or contact: contact@appgoblin.info
--


----- SUMMARY EXECUTIVE -----------

SELECT
    count(DISTINCT store_app) AS apps_analyzed,
    count(*) AS https_tracked,
    count(DISTINCT tld_url) AS api_domains,
    count(DISTINCT cdm.company_id) AS adtech_companies,
    count(DISTINCT advertiser_store_app_id) AS advertisers,
    count(DISTINCT phash) AS creative_count
FROM
    api_calls AS ac
LEFT JOIN domains AS d ON ac.tld_url = d.domain_name
LEFT JOIN adtech.company_domain_mapping AS cdm ON d.id = cdm.domain_id
LEFT JOIN creative_records AS cr ON ac.id = cr.api_call_id
LEFT JOIN creative_assets AS ca ON cr.creative_asset_id = ca.id
WHERE
    called_at >= '2025-08-01'
    AND called_at < '2025-09-01';


-------- IMPACT GROWTH -------

WITH advertiser_z_scores AS (
    SELECT *
    FROM
        (
            SELECT
                sazh.target_week,
                sazh.store,
                sazh.store_app,
                sazh.app_name,
                sazh.store_id,
                sazh.installs,
                sazh.icon_url_100,
                sazh.installs_pct_increase,
                sazh.ratings_pct_increase,
                sazh.target_week_installs,
                row_number() OVER (
                    PARTITION BY sazh.target_week
                    ORDER BY
                        sazh.installs_pct_increase DESC
                ) AS rn
            FROM
                store_app_z_scores_history AS sazh
            WHERE
                sazh.target_week IN (
                    '2025-08-04',
                    '2025-08-11',
                    '2025-08-18',
                    '2025-08-25'
                )
                AND (
                    sazh.installs_z_score_1w > 10
                    OR sazh.installs_pct_increase > 10
                )
        ) AS ranked
    WHERE
        rn <= 5
        -- top 5 advertisers per week
),

adv_mmp AS (
    SELECT DISTINCT
        cr_1.advertiser_store_app_id,
        cr_1.mmp_domain_id,
        ad.domain_name AS mmp_domain
    FROM
        creative_records AS cr_1
    LEFT JOIN domains AS ad
        ON
            cr_1.mmp_domain_id = ad.id
            AND cr_1.advertiser_store_app_id IS NOT NULL
    WHERE
        cr_1.mmp_domain_id IS NOT NULL
    UNION
    SELECT DISTINCT
        csac.store_app AS advertiser_store_app_id,
        c.domain_id AS mmp_domain_id,
        csac.ad_domain AS mmp_domain
    FROM
        adtech.combined_store_apps_companies AS csac
    LEFT JOIN adtech.company_categories AS cc
        ON
            csac.company_id = cc.company_id
    LEFT JOIN adtech.companies AS c
        ON
            csac.company_id = c.id
    WHERE
        cc.category_id = 2
        AND csac.company_id > 0
),

main_results AS (
    SELECT
        adv.target_week AS best_week,
        adv.app_name,
        adv.store_app,
        adv.store_id,
        adv.icon_url_100,
        ca.phash,
        ca.file_extension,
        had.domain_name AS host_ad_domain,
        hc.logo_url AS host_company_logo_url,
        iad.domain_name AS initial_ad_domain,
        ic.logo_url AS initial_company_logo_url,
        max(adv.target_week_installs) AS weekly_installs,
        max(adv.installs_pct_increase) AS weekly_percent_increase,
        nullif(
            array_agg(DISTINCT am.mmp_domain) FILTER (
                WHERE am.mmp_domain IS NOT NULL
            ),
            '{}'::CHARACTER VARYING []
        ) AS mmp_domains,
        (
            SELECT ca_inner.md5_hash
            FROM
                creative_assets AS ca_inner
            INNER JOIN creative_records AS cr_inner
                ON
                    ca_inner.id = cr_inner.creative_asset_id
            WHERE
                cr_inner.advertiser_store_app_id IS NOT NULL
                AND cr_inner.advertiser_store_app_id = adv.store_app
            GROUP BY
                ca_inner.md5_hash
            ORDER BY
                count(*) DESC
            LIMIT 1
        ) AS md5_hash,
        count(DISTINCT pub.id) AS pub_count
    FROM
        creative_records AS cr
    LEFT JOIN creative_assets AS ca
        ON
            cr.creative_asset_id = ca.id
    LEFT JOIN store_apps AS adv_app
        ON
            cr.advertiser_store_app_id = adv_app.id
    INNER JOIN advertiser_z_scores AS adv
        ON
            adv_app.id = adv.store_app
    LEFT JOIN api_calls AS ac
        ON
            cr.api_call_id = ac.id
    LEFT JOIN version_code_api_scan_results AS pub
        ON
            ac.run_id = pub.id
    -- Get creative company domain
    LEFT JOIN adtech.company_domain_mapping AS icdm
        ON
            cr.creative_initial_domain_id = icdm.domain_id
    LEFT JOIN adtech.companies AS ic
        ON
            icdm.company_id = ic.id
    LEFT JOIN domains AS iad
        ON
            ic.domain_id = iad.id
    -- get host domain    
    LEFT JOIN adtech.company_domain_mapping AS hcdm
        ON
            cr.creative_host_domain_id = hcdm.domain_id
    LEFT JOIN adtech.companies AS hc
        ON
            hcdm.company_id = hc.id
    LEFT JOIN domains AS had
        ON
            hc.domain_id = had.id
    LEFT JOIN adv_mmp AS am
        ON
            adv_app.id = am.advertiser_store_app_id
    WHERE
        pub.run_at >= adv.target_week - INTERVAL '8 days'
        AND pub.run_at < adv.target_week + INTERVAL '2 days'
    GROUP BY
        adv.target_week,
        adv.app_name,
        adv.store_app,
        adv.store_id,
        adv.icon_url_100,
        adv.target_week_installs,
        ca.phash,
        ca.file_extension,
        host_ad_domain,
        host_company_logo_url,
        initial_ad_domain,
        initial_company_logo_url,
        mmp_domain
),

best_week_results AS (
    SELECT DISTINCT ON
    (store_app)
        best_week,
        store_app,
        app_name,
        store_id,
        icon_url_100,
        weekly_installs,
        weekly_percent_increase,
        phash,
        file_extension,
        host_ad_domain,
        host_company_logo_url,
        initial_ad_domain,
        initial_company_logo_url,
        mmp_domains,
        md5_hash,
        pub_count
    FROM
        main_results
    ORDER BY
        store_app ASC,
        weekly_percent_increase DESC
)

SELECT
    best_week,
    app_name,
    store_id,
    icon_url_100,
    weekly_installs,
    weekly_percent_increase,
    phash,
    file_extension,
    host_ad_domain,
    host_company_logo_url,
    initial_ad_domain,
    initial_company_logo_url,
    mmp_domains,
    md5_hash,
    pub_count
FROM
    best_week_results
ORDER BY
    weekly_percent_increase DESC,
    store_id ASC;


---------- CREATIVES --------

WITH
ranked_md5s AS (
    SELECT
        md5_hash,
        file_extension,
        right(phash, 12) AS phash,
        count(*) AS cnt,
        row_number() OVER (
            PARTITION BY right(phash, 12)
            ORDER BY count(*) DESC
        ) AS rn
    FROM creative_assets
    GROUP BY right(phash, 12), md5_hash, file_extension
),

most_common_md5 AS (
    SELECT
        phash,
        md5_hash,
        file_extension,
        cnt AS frequency
    FROM ranked_md5s
    WHERE rn = 1
),

top_adv_per_phash AS (
    SELECT DISTINCT ON (right(ca_inner.phash, 12))
        sa_inner.store_id,
        sa_inner.icon_url_100,
        right(ca_inner.phash, 12) AS phash
    FROM creative_assets AS ca_inner
    INNER JOIN
        creative_records AS cr_inner
        ON ca_inner.id = cr_inner.creative_asset_id
    INNER JOIN
        store_apps AS sa_inner
        ON cr_inner.advertiser_store_app_id = sa_inner.id
    LEFT JOIN api_calls AS ac_inner ON cr_inner.api_call_id = ac_inner.id
    LEFT JOIN version_code_api_scan_results AS pub_inner
        ON ac_inner.run_id = pub_inner.id
    WHERE
        pub_inner.run_at >= '2025-08-01'
        AND pub_inner.run_at < '2025-09-01'
    GROUP BY right(ca_inner.phash, 12), sa_inner.store_id, sa_inner.icon_url_100
    ORDER BY right(ca_inner.phash, 12), count(*) DESC
),

creative_stats AS (
    SELECT
        cr.advertiser_store_app_id,
        right(ca.phash, 12) AS phash,
        count(DISTINCT cr.advertiser_store_app_id) AS advertiser_count,
        count(DISTINCT pub.id) AS publisher_count,
        min(pub.run_at) AS first_seen,
        max(pub.run_at) AS last_seen
    FROM creative_records AS cr
    LEFT JOIN creative_assets AS ca ON cr.creative_asset_id = ca.id
    LEFT JOIN api_calls AS ac ON cr.api_call_id = ac.id
    LEFT JOIN store_apps AS adv_app ON ac.store_app = adv_app.id
    LEFT JOIN version_code_api_scan_results AS pub ON ac.run_id = pub.id
    WHERE
        pub.run_at >= '2025-08-01'
        AND pub.run_at < '2025-09-01'
        AND ca.phash IS NOT NULL
        AND ca.file_extension IN ('mp4', 'webm')
    GROUP BY right(ca.phash, 12), cr.advertiser_store_app_id
),

ranked_creatives AS (
    SELECT
        *,
        row_number() OVER (
            PARTITION BY advertiser_store_app_id
            ORDER BY publisher_count DESC, phash ASC
        ) AS rn
    FROM creative_stats
)

SELECT
    rc.phash,
    mcm.md5_hash,
    mcm.file_extension,
    advertiser_count,
    publisher_count,
    first_seen,
    last_seen,
    tap.store_id AS advertiser_store_id,
    tap.icon_url_100 AS advertiser_icon_url_100
FROM ranked_creatives AS rc
LEFT JOIN most_common_md5 AS mcm ON rc.phash = mcm.phash
LEFT JOIN top_adv_per_phash AS tap ON rc.phash = tap.phash
WHERE
    rn <= 2
    AND advertiser_store_app_id IS NOT NULL
ORDER BY publisher_count DESC
LIMIT 10;


------- AD NETWORKS LANDSCAPE ----------

WITH
creative_ad_networks AS (
    -- host ad domains
    SELECT DISTINCT
        cr.id AS creative_record_id,
        pub.id AS publisher_id,
        ca.phash,
        cr.advertiser_store_app_id AS advertiser_store_app,
        coalesce(phc.name, hc.name) AS parent_ad_network_name,
        coalesce(phad.domain_name, had.domain_name) AS parent_ad_network_domain,
        had.domain_name AS ad_network_domain,
        coalesce(phc.logo_url, hc.logo_url) AS company_logo_url
    FROM
        creative_records AS cr
    LEFT JOIN creative_assets AS ca
        ON
            cr.creative_asset_id = ca.id
    LEFT JOIN store_apps AS adv_app
        ON
            cr.advertiser_store_app_id = adv_app.id
    LEFT JOIN api_calls AS ac
        ON
            cr.api_call_id = ac.id
    LEFT JOIN version_code_api_scan_results AS pub
        ON
            ac.run_id = pub.id
    -- Get host domain    
    LEFT JOIN adtech.company_domain_mapping AS hcdm
        ON
            cr.creative_host_domain_id = hcdm.domain_id
    LEFT JOIN adtech.companies AS hc
        ON
            hcdm.company_id = hc.id
    LEFT JOIN adtech.companies AS phc
        ON
            hc.parent_company_id = phc.id
    LEFT JOIN domains AS had
        ON
            hc.domain_id = had.id
    LEFT JOIN domains AS phad
        ON
            phc.domain_id = phad.id
    LEFT JOIN adtech.company_categories AS cc
        ON
            hc.id = cc.company_id
    WHERE
        pub.run_at >= '2025-08-01'
        AND pub.run_at < '2025-09-01'
        AND had.domain_name IS NOT NULL
        AND cc.category_id = 1
        AND hc.id != 48
    UNION
    -- initial ad domains
    SELECT DISTINCT
        cr.id AS creative_record_id,
        pub.id AS publisher_id,
        ca.phash,
        cr.advertiser_store_app_id AS advertiser_store_app,
        coalesce(pic.name, ic.name) AS parent_ad_network_name,
        coalesce(piad.domain_name, iad.domain_name) AS parent_ad_network_domain,
        iad.domain_name AS ad_network_domain,
        coalesce(pic.logo_url, ic.logo_url) AS company_logo_url
    FROM
        creative_records AS cr
    LEFT JOIN creative_assets AS ca
        ON
            cr.creative_asset_id = ca.id
    LEFT JOIN store_apps AS adv_app
        ON
            cr.advertiser_store_app_id = adv_app.id
    LEFT JOIN api_calls AS ac
        ON
            cr.api_call_id = ac.id
    LEFT JOIN version_code_api_scan_results AS pub
        ON
            ac.run_id = pub.id
    -- Get creative initial company domain
    LEFT JOIN adtech.company_domain_mapping AS icdm
        ON
            cr.creative_initial_domain_id = icdm.domain_id
    LEFT JOIN adtech.companies AS ic
        ON
            icdm.company_id = ic.id
    LEFT JOIN adtech.companies AS pic
        ON
            ic.parent_company_id = pic.id
    LEFT JOIN domains AS iad
        ON
            ic.domain_id = iad.id
    LEFT JOIN domains AS piad
        ON
            pic.domain_id = piad.id
    LEFT JOIN adtech.company_categories AS cc
        ON
            ic.id = cc.company_id
    WHERE
        pub.run_at >= '2025-08-01'
        AND pub.run_at < '2025-09-01'
        AND iad.domain_name IS NOT NULL
        AND cc.category_id = 1
        AND ic.id != 48
)

SELECT
    parent_ad_network_name AS ad_network_name,
    parent_ad_network_domain AS ad_network_domain,
    company_logo_url,
    array_agg(DISTINCT ad_network_domain) AS all_domains,
    count(DISTINCT publisher_id) AS publisher_count,
    count(DISTINCT advertiser_store_app) AS advertiser_count,
    count(DISTINCT phash) AS creatives_count
FROM
    creative_ad_networks
GROUP BY
    parent_ad_network_name,
    parent_ad_network_domain,
    company_logo_url
ORDER BY
    publisher_count DESC
LIMIT 10;


------------ REACH --------------
WITH adv_mmp AS (
    SELECT DISTINCT
        cr_1.advertiser_store_app_id,
        cr_1.mmp_domain_id,
        ad.domain_name AS mmp_domain
    FROM
        creative_records AS cr_1
    LEFT JOIN domains AS ad
        ON
            cr_1.mmp_domain_id = ad.id
            AND cr_1.advertiser_store_app_id IS NOT NULL
    WHERE
        cr_1.mmp_domain_id IS NOT NULL
    UNION
    SELECT DISTINCT
        csac.store_app AS advertiser_store_app_id,
        c.domain_id AS mmp_domain_id,
        csac.ad_domain AS mmp_domain
    FROM
        adtech.combined_store_apps_companies AS csac
    LEFT JOIN adtech.company_categories AS cc
        ON
            csac.company_id = cc.company_id
    LEFT JOIN adtech.companies AS c
        ON
            csac.company_id = c.id
    WHERE
        cc.category_id = 2
        AND csac.company_id > 0
),

ad_network_domain_ids AS (
    SELECT
        cr_1.advertiser_store_app_id,
        coalesce(icp.domain_id, ic.domain_id) AS domain_id
    FROM
        creative_records AS cr_1
    INNER JOIN adtech.company_domain_mapping AS icdm
        ON
            cr_1.creative_initial_domain_id = icdm.domain_id
    LEFT JOIN adtech.companies AS ic
        ON
            icdm.company_id = ic.id
    LEFT JOIN adtech.companies AS icp
        ON
            ic.parent_company_id = icp.id
    LEFT JOIN api_calls AS ac_1
        ON
            cr_1.api_call_id = ac_1.id
    LEFT JOIN version_code_api_scan_results AS vcasr_1
        ON
            ac_1.run_id = vcasr_1.id
    WHERE
        vcasr_1.run_at >= '2025-08-01'
        AND vcasr_1.run_at < '2025-09-01'
    UNION
    SELECT
        cr_1.advertiser_store_app_id,
        coalesce(hcp.domain_id, hc.domain_id) AS domain_id
    FROM
        creative_records AS cr_1
    INNER JOIN adtech.company_domain_mapping AS hcdm
        ON
            cr_1.creative_host_domain_id = hcdm.domain_id
    LEFT JOIN adtech.companies AS hc
        ON
            hcdm.company_id = hc.id
    LEFT JOIN adtech.companies AS hcp
        ON
            hc.parent_company_id = hcp.id
    LEFT JOIN api_calls AS ac_1
        ON
            cr_1.api_call_id = ac_1.id
    LEFT JOIN version_code_api_scan_results AS vcasr_1
        ON
            ac_1.run_id = vcasr_1.id
    WHERE
        vcasr_1.run_at >= '2025-08-01'
        AND vcasr_1.run_at < '2025-09-01'
),

ad_network_domains AS (
    SELECT
        adi.advertiser_store_app_id,
        ad.domain_name AS ad_network_domain
    FROM
        ad_network_domain_ids AS adi
    LEFT JOIN domains AS ad ON
        adi.domain_id = ad.id
),

creative_rankings AS (
    SELECT
        ca_1.md5_hash,
        ca_1.file_extension,
        cr_1.advertiser_store_app_id,
        vcasr_1.run_at,
        row_number() OVER (
            PARTITION BY cr_1.advertiser_store_app_id
            ORDER BY
                vcasr_1.run_at DESC
        ) AS rn
    FROM
        creative_records AS cr_1
    LEFT JOIN creative_assets AS ca_1
        ON
            cr_1.creative_asset_id = ca_1.id
    LEFT JOIN api_calls AS ac_1
        ON
            cr_1.api_call_id = ac_1.id
    LEFT JOIN version_code_api_scan_results AS vcasr_1
        ON
            ac_1.run_id = vcasr_1.id
    WHERE
        vcasr_1.run_at >= '2025-08-01'
        AND vcasr_1.run_at < '2025-09-01'
)

SELECT
    saa.name AS advertiser_name,
    saa.store_id AS advertiser_store_id,
    saa.icon_url_100 AS advertiser_icon_url_100,
    saa.category AS advertiser_category,
    saa.installs AS advertiser_installs,
    count(DISTINCT ca.phash) AS unique_creatives,
    count(DISTINCT ac.store_app) AS unique_publishers,
    min(vcasr.run_at) AS first_seen,
    max(vcasr.run_at) AS last_seen,
    array_agg(DISTINCT adis.ad_network_domain) AS ad_network_domains,
    avg(sap.installs) AS avg_publisher_installs,
    nullif(
        array_agg(DISTINCT adv_mmp.mmp_domain) FILTER (
            WHERE adv_mmp.mmp_domain IS NOT NULL
        ),
        '{}'::CHARACTER VARYING []
    ) AS mmp_domains,
    array(
        SELECT crk.md5_hash
        FROM creative_rankings AS crk
        WHERE crk.advertiser_store_app_id = saa.id AND crk.rn <= 5
        ORDER BY crk.rn
    ) AS top_md5_hashes
FROM
    creative_records AS cr
LEFT JOIN api_calls AS ac
    ON
        cr.api_call_id = ac.id
LEFT JOIN creative_assets AS ca
    ON
        cr.creative_asset_id = ca.id
LEFT JOIN frontend.store_apps_overview AS sap
    ON
        ac.store_app = sap.id
LEFT JOIN frontend.store_apps_overview AS saa
    ON
        cr.advertiser_store_app_id = saa.id
LEFT JOIN version_code_api_scan_results AS vcasr
    ON
        ac.run_id = vcasr.id
LEFT JOIN adv_mmp
    ON
        cr.advertiser_store_app_id = adv_mmp.advertiser_store_app_id
LEFT JOIN ad_network_domains AS adis
    ON
        cr.advertiser_store_app_id = adis.advertiser_store_app_id
WHERE
    vcasr.run_at >= '2025-08-01'
    AND vcasr.run_at < '2025-08-31'
    AND cr.advertiser_store_app_id IS NOT NULL
GROUP BY
    saa.name,
    saa.store_id,
    saa.category,
    saa.installs,
    saa.id,
    saa.icon_url_100,
    saa.rating,
    saa.rating_count,
    saa.installs_sum_1w,
    saa.installs_sum_4w
ORDER BY
    unique_publishers DESC
LIMIT 50;
