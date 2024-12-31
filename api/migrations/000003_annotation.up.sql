CREATE TABLE annotation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_time BIGINT NOT NULL CHECK (start_time >= 0),
    end_time BIGINT NOT NULL CHECK (end_time >= 0),
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time)
);
