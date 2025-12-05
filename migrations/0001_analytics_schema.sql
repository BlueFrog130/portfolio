-- Sessions table: tracks unique visits
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    country TEXT,
    region TEXT,
    device_type TEXT,
    browser TEXT,
    browser_version TEXT,
    os TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

-- Page views table: individual page visits
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    duration INTEGER,
    referrer_path TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Web vitals table: Core Web Vitals and extended metrics
CREATE TABLE IF NOT EXISTS web_vitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_rating TEXT NOT NULL,
    metric_id TEXT NOT NULL,
    navigation_type TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for efficient Grafana queries
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON sessions(country);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_web_vitals_timestamp ON web_vitals(timestamp);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric ON web_vitals(metric_name);
CREATE INDEX IF NOT EXISTS idx_web_vitals_path ON web_vitals(path);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp_null_duration ON page_views(timestamp) WHERE duration IS NULL;