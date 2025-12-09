-- Unified events table for all client-side analytics
-- Consolidates: page_views, web_vitals, and custom events
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    timestamp INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_data TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(event_category);

-- Migrate page_views data to events table
INSERT INTO events (session_id, timestamp, event_type, event_category, event_data)
SELECT
    session_id,
    timestamp,
    'pageview',
    'navigation',
    json_object(
        'path', path,
        'duration', duration,
        'referrerPath', referrer_path
    )
FROM page_views;

-- Migrate web_vitals data to events table
INSERT INTO events (session_id, timestamp, event_type, event_category, event_data)
SELECT
    session_id,
    timestamp,
    metric_name,
    'performance',
    json_object(
        'path', path,
        'value', metric_value,
        'rating', metric_rating,
        'id', metric_id,
        'navigationType', navigation_type
    )
FROM web_vitals;

-- Migrate ai_requests data to events table
INSERT INTO events (session_id, timestamp, event_type, event_category, event_data)
SELECT
    session_id,
    timestamp,
    'ai_request',
    'ai',
    json_object(
        'endpoint', endpoint,
        'model', model,
        'projectSlug', project_slug,
        'inputTokens', input_tokens,
        'outputTokens', output_tokens,
        'totalTokens', total_tokens,
        'latencyMs', latency_ms,
        'firstTokenMs', first_token_ms,
        'userMessage', user_message,
        'responseText', response_text
    )
FROM ai_requests;

-- Drop old indexes
DROP INDEX IF EXISTS idx_page_views_timestamp;
DROP INDEX IF EXISTS idx_page_views_path;
DROP INDEX IF EXISTS idx_page_views_session;
DROP INDEX IF EXISTS idx_page_views_timestamp_null_duration;
DROP INDEX IF EXISTS idx_web_vitals_timestamp;
DROP INDEX IF EXISTS idx_web_vitals_metric;
DROP INDEX IF EXISTS idx_web_vitals_path;
DROP INDEX IF EXISTS idx_ai_requests_timestamp;
DROP INDEX IF EXISTS idx_ai_requests_session;
DROP INDEX IF EXISTS idx_ai_requests_model;
DROP INDEX IF EXISTS idx_ai_requests_endpoint;

-- Drop old tables
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS web_vitals;
DROP TABLE IF EXISTS ai_requests;
