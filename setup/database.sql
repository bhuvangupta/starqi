-- StarQI Database Initialization Script
-- This script sets up the initial database structure and seed data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS starqi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE starqi;

-- Note: Tables are auto-created by TypeORM in development
-- This script is primarily for production initialization and seed data

-- ============================================================================
-- Seed Data: Popular Locations
-- ============================================================================

-- Insert some pre-populated locations for popular dark sky sites
INSERT IGNORE INTO locations (id, name, city, country, latitude, longitude, created_at, updated_at) VALUES
('loc-1', 'Mauna Kea Observatory', 'Big Island', 'USA', 19.8207, -155.4681, NOW(), NOW()),
('loc-2', 'Atacama Desert', 'San Pedro de Atacama', 'Chile', -22.9576, -67.7889, NOW(), NOW()),
('loc-3', 'Cherry Springs State Park', 'Coudersport', 'USA', 41.6611, -77.8214, NOW(), NOW()),
('loc-4', 'NamibRand Nature Reserve', 'Sesriem', 'Namibia', -25.0, 16.0, NOW(), NOW()),
('loc-5', 'Aoraki Mackenzie', 'Lake Tekapo', 'New Zealand', -43.8833, 170.4667, NOW(), NOW()),
('loc-6', 'Death Valley National Park', 'Death Valley', 'USA', 36.5054, -117.0794, NOW(), NOW()),
('loc-7', 'Pic du Midi Observatory', 'Hautes-Pyrénées', 'France', 42.9369, 0.1425, NOW(), NOW()),
('loc-8', 'Jasper National Park', 'Jasper', 'Canada', 52.8734, -117.9543, NOW(), NOW()),
('loc-9', 'La Palma Observatory', 'La Palma', 'Spain', 28.7569, -17.8811, NOW(), NOW()),
('loc-10', 'Yeongyang Firefly Eco Park', 'Yeongyang', 'South Korea', 36.6667, 129.1167, NOW(), NOW());

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Spatial indexes for location queries
ALTER TABLE sky_readings ADD SPATIAL INDEX idx_spatial_coords (latitude, longitude);

-- Performance indexes for common queries
CREATE INDEX idx_readings_datetime ON sky_readings(observation_datetime DESC);
CREATE INDEX idx_readings_level ON sky_readings(light_pollution_level);
CREATE INDEX idx_readings_bortle ON sky_readings(bortle_scale);
CREATE INDEX idx_readings_sqm ON sky_readings(sqm_value DESC);
CREATE INDEX idx_readings_country_city ON sky_readings(country, city);

CREATE INDEX idx_photos_status ON photo_uploads(processing_status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created ON users(created_at DESC);

CREATE INDEX idx_devices_serial ON sqm_devices(device_serial);
CREATE INDEX idx_devices_active ON sqm_devices(is_active);
CREATE INDEX idx_devices_location ON sqm_devices(is_fixed_location, fixed_latitude, fixed_longitude);

CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);

-- ============================================================================
-- Views for Common Queries
-- ============================================================================

-- View for public readings (with user information)
CREATE OR REPLACE VIEW v_public_readings AS
SELECT
    r.id,
    r.latitude,
    r.longitude,
    r.location_name,
    r.city,
    r.country,
    r.sqm_value,
    r.bortle_scale,
    r.nelm,
    r.sky_brightness,
    r.star_count,
    r.light_pollution_level,
    r.observation_datetime,
    r.created_at,
    u.username,
    u.full_name,
    p.file_url,
    p.processing_status
FROM sky_readings r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN photo_uploads p ON r.id = p.reading_id
WHERE r.id IS NOT NULL
ORDER BY r.observation_datetime DESC;

-- View for location statistics
CREATE OR REPLACE VIEW v_location_stats AS
SELECT
    country,
    city,
    COUNT(*) as total_readings,
    AVG(sqm_value) as avg_sqm,
    AVG(bortle_scale) as avg_bortle,
    MIN(sqm_value) as min_sqm,
    MAX(sqm_value) as max_sqm,
    MAX(observation_datetime) as last_reading_date
FROM sky_readings
WHERE country IS NOT NULL
GROUP BY country, city
ORDER BY total_readings DESC;

-- View for user leaderboard
CREATE OR REPLACE VIEW v_user_leaderboard AS
SELECT
    u.id,
    u.username,
    u.full_name,
    COUNT(DISTINCT r.id) as total_readings,
    AVG(r.sqm_value) as avg_sqm,
    SUM(c.points) as total_points,
    MIN(r.created_at) as first_reading,
    MAX(r.created_at) as last_reading
FROM users u
LEFT JOIN sky_readings r ON u.id = r.user_id
LEFT JOIN contributions c ON u.id = c.user_id
GROUP BY u.id, u.username, u.full_name
ORDER BY total_points DESC, total_readings DESC;

-- ============================================================================
-- Stored Procedures
-- ============================================================================

DELIMITER //

-- Procedure to update location statistics
CREATE PROCEDURE update_location_stats()
BEGIN
    UPDATE locations l
    SET
        average_sqm = (
            SELECT AVG(sqm_value)
            FROM sky_readings
            WHERE city = l.city AND country = l.country
        ),
        average_bortle = (
            SELECT AVG(bortle_scale)
            FROM sky_readings
            WHERE city = l.city AND country = l.country
        ),
        total_readings = (
            SELECT COUNT(*)
            FROM sky_readings
            WHERE city = l.city AND country = l.country
        ),
        last_reading_at = (
            SELECT MAX(observation_datetime)
            FROM sky_readings
            WHERE city = l.city AND country = l.country
        )
    WHERE l.city IS NOT NULL AND l.country IS NOT NULL;
END //

-- Procedure to award contribution points
CREATE PROCEDURE award_contribution_points(
    IN p_user_id VARCHAR(36),
    IN p_contribution_type ENUM('reading', 'photo', 'device_install', 'verification'),
    IN p_points INT
)
BEGIN
    INSERT INTO contributions (user_id, contribution_type, points)
    VALUES (p_user_id, p_contribution_type, p_points);
END //

DELIMITER ;

-- ============================================================================
-- Triggers
-- ============================================================================

DELIMITER //

-- Trigger to auto-award points for new readings
CREATE TRIGGER after_reading_insert
AFTER INSERT ON sky_readings
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        CALL award_contribution_points(NEW.user_id, 'reading', 10);
    END IF;
END //

-- Trigger to auto-award points for photo uploads
CREATE TRIGGER after_photo_insert
AFTER INSERT ON photo_uploads
FOR EACH ROW
BEGIN
    DECLARE v_user_id VARCHAR(36);

    SELECT user_id INTO v_user_id
    FROM sky_readings
    WHERE id = NEW.reading_id;

    IF v_user_id IS NOT NULL THEN
        CALL award_contribution_points(v_user_id, 'photo', 5);
    END IF;
END //

DELIMITER ;

-- ============================================================================
-- Initial Admin User (Optional - Change Password!)
-- ============================================================================

-- Note: Password hash is for 'admin123' - CHANGE THIS IN PRODUCTION!
-- Use bcrypt to generate: bcrypt.hash('your_password', 10)

INSERT IGNORE INTO users (id, email, username, password_hash, full_name, is_active, created_at, updated_at)
VALUES (
    'admin-user-1',
    'admin@starqi.org',
    'admin',
    '$2a$10$XEwvJ3WsB7EoR5QhJLxF4.yHLd8gQxVmP5Z7KY9d8fJ3xN2wQ7Hua', -- admin123
    'System Administrator',
    TRUE,
    NOW(),
    NOW()
);

-- ============================================================================
-- Database Configuration
-- ============================================================================

-- Optimize for InnoDB
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_flush_log_at_trx_commit = 2;
SET GLOBAL innodb_flush_method = O_DIRECT;

-- Query cache (if enabled)
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL query_cache_type = 1;

-- Connection settings
SET GLOBAL max_connections = 200;
SET GLOBAL wait_timeout = 600;
SET GLOBAL interactive_timeout = 600;

-- Character set
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================================
-- Completion Message
-- ============================================================================

SELECT 'StarQI Database Initialized Successfully!' as Message;
SELECT COUNT(*) as 'Seeded Locations' FROM locations;
SELECT COUNT(*) as 'Total Tables' FROM information_schema.tables WHERE table_schema = 'starqi';
