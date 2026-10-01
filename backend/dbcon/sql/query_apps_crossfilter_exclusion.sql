AND NOT EXISTS (
    SELECT 1
    FROM exclude_apps AS ea
    WHERE ea.store_app = sao.id
)