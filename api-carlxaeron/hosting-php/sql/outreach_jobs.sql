-- Outreach schedule (Namecheap hosting cron auto follow-ups)

CREATE TABLE IF NOT EXISTS outreach_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  preview_url VARCHAR(512) NOT NULL,
  package_name VARCHAR(255) NULL,
  quoted_amount VARCHAR(64) NULL,
  timeline VARCHAR(255) NULL,
  cadence VARCHAR(8) NOT NULL DEFAULT '1w',
  auto_followup TINYINT(1) NOT NULL DEFAULT 1,
  max_followups TINYINT UNSIGNED NOT NULL DEFAULT 2,
  follow_up_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'sent',
  initial_sent_at DATETIME NULL,
  next_follow_up_at DATETIME NULL,
  last_follow_up_at DATETIME NULL,
  last_error VARCHAR(512) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_outreach_slug_email (slug, contact_email),
  INDEX idx_outreach_due (auto_followup, status, next_follow_up_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
