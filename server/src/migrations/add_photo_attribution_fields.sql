-- Migration: Add photo attribution fields to photo_uploads table
-- Date: 2025-01-26
-- Purpose: Support crawled photos from external sources with proper attribution

ALTER TABLE photo_uploads
ADD COLUMN source_name VARCHAR(100) NULL COMMENT 'Photo source (e.g., NASA APOD, Unsplash, User Upload)',
ADD COLUMN source_url VARCHAR(512) NULL COMMENT 'Original photo URL',
ADD COLUMN photographer_name VARCHAR(255) NULL COMMENT 'Photographer name if different from user',
ADD COLUMN license_type VARCHAR(100) NULL COMMENT 'License type (e.g., Public Domain, CC BY 4.0)',
ADD COLUMN attribution_text TEXT NULL COMMENT 'Full attribution text';

-- Add index on source_name for filtering
CREATE INDEX idx_photo_uploads_source_name ON photo_uploads(source_name);
