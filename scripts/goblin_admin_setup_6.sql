CREATE TABLE user_generated_reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id),
    report_name VARCHAR(255) NOT NULL,
    s3_key TEXT NOT NULL,
    filters JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_generated_reports_user_created
ON user_generated_reports (user_id, created_at DESC);

CREATE TABLE user_requested_mapping (
    id SERIAL PRIMARY KEY,
    user_id INT NULL REFERENCES users (id),
    map_type VARCHAR(255) NOT NULL,
    value_to_be_mapped TEXT NOT NULL,
    additional_info JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_requested_mapping_created
ON user_requested_mapping (user_id, created_at DESC);
