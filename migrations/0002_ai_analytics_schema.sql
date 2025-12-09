-- AI Analytics table: tracks AI chat requests and token usage
CREATE TABLE IF NOT EXISTS ai_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    timestamp INTEGER NOT NULL,
    endpoint TEXT NOT NULL,
    model TEXT NOT NULL,
    project_slug TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    latency_ms INTEGER,
    first_token_ms INTEGER,
    user_message TEXT,
    response_text TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_ai_requests_timestamp ON ai_requests(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_requests_session ON ai_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_model ON ai_requests(model);
CREATE INDEX IF NOT EXISTS idx_ai_requests_endpoint ON ai_requests(endpoint);
