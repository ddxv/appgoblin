FROM include_apps AS ia
JOIN frontend.store_apps_overview AS sao
    ON sao.id = ia.store_app