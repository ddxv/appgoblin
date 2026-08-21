SELECT
    store,
    app_category,
    tag_source,
    total_active_scanned_apps_with_tag AS app_count,
    total_scanned_installs_d30_with_tag AS installs_d30,
    total_scanned_installs_with_tag AS installs_total,
    active_apps_universe,
    universe_installs_total,
    universe_installs_d30
FROM adtech.tag_totals;
