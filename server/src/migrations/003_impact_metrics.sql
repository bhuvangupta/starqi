-- Migration: Impact Metrics Table
-- Purpose: Store manually updated metrics for community impact dashboard
-- Created: 2025-01-25

-- Create impact_metrics table
CREATE TABLE IF NOT EXISTS impact_metrics (
  id VARCHAR(36) PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL UNIQUE,
  metric_value INT NOT NULL DEFAULT 0,
  description VARCHAR(255),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial metrics
INSERT INTO impact_metrics (id, metric_name, metric_value, description) VALUES
(UUID(), 'schools_partnered', 0, 'Number of schools partnered with StarQI'),
(UUID(), 'workshops_conducted', 0, 'Number of community workshops conducted'),
(UUID(), 'students_engaged', 0, 'Total number of students engaged'),
(UUID(), 'media_mentions', 0, 'Number of media mentions/features')
ON DUPLICATE KEY UPDATE metric_name=metric_name;

-- Create index for faster lookups
CREATE INDEX idx_metric_name ON impact_metrics(metric_name);

-- Comments
ALTER TABLE impact_metrics COMMENT = 'Stores manually updated community impact metrics';
