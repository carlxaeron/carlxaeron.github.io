-- api-carlxaeron schema (MySQL / MariaDB)

CREATE TABLE IF NOT EXISTS visits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visitor_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(32) NOT NULL DEFAULT 'pageview',
  section VARCHAR(32) NULL,
  preview_slug VARCHAR(64) NULL,
  path VARCHAR(512) NULL,
  referrer VARCHAR(512) NULL,
  user_agent VARCHAR(512) NULL,
  language VARCHAR(32) NULL,
  screen_json JSON NULL,
  viewport_json JSON NULL,
  device VARCHAR(32) NULL,
  ip_hash VARCHAR(16) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visits_created (created_at),
  INDEX idx_visits_event (event_type),
  INDEX idx_visits_slug (preview_slug),
  INDEX idx_visits_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preview_feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visitor_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) NOT NULL,
  preview_slug VARCHAR(64) NOT NULL,
  preview_label VARCHAR(128) NULL,
  sentiment VARCHAR(16) NOT NULL,
  comment VARCHAR(1000) NULL,
  ip_hash VARCHAR(16) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_feedback_visitor_slug (visitor_id, preview_slug),
  INDEX idx_feedback_sentiment (sentiment),
  INDEX idx_feedback_slug (preview_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quotations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  project_type VARCHAR(128) NULL,
  budget_range VARCHAR(128) NULL,
  timeline VARCHAR(128) NULL,
  services_json JSON NULL,
  details TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
