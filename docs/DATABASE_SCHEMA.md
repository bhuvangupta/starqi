# Light Pollution Portal - Database Schema

## Overview
This schema supports photo-based sky quality measurements, SQM device readings, and global light pollution tracking.

## Tables

### 1. users
Stores user account information
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_username (username)
);
```

### 2. sky_readings
Core table for all sky quality measurements
```sql
CREATE TABLE sky_readings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  reading_type ENUM('photo', 'sqm_device', 'manual') NOT NULL,

  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),

  -- Sky Quality Metrics
  sqm_value DECIMAL(4, 2), -- Sky Quality Meter value (mag/arcsec²)
  bortle_scale TINYINT, -- 1-9 scale
  nelm DECIMAL(3, 1), -- Naked Eye Limiting Magnitude

  -- Photo analysis results (if photo-based)
  sky_brightness DECIMAL(5, 2), -- Average luminance
  star_count INT, -- Detected stars
  light_pollution_level ENUM('excellent', 'good', 'moderate', 'poor', 'very_poor') NOT NULL,

  -- Metadata
  observation_datetime TIMESTAMP NOT NULL,
  weather_conditions VARCHAR(255),
  moon_phase DECIMAL(3, 2), -- 0-1 (0=new, 1=full)

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_location (latitude, longitude),
  INDEX idx_datetime (observation_datetime),
  INDEX idx_user (user_id),
  INDEX idx_bortle (bortle_scale)
);
```

### 3. photo_uploads
Stores photo metadata and analysis results
```sql
CREATE TABLE photo_uploads (
  id VARCHAR(36) PRIMARY KEY,
  reading_id VARCHAR(36) UNIQUE NOT NULL,

  -- File information
  file_url VARCHAR(512) NOT NULL,
  file_size INT, -- bytes
  file_format VARCHAR(10), -- jpg, png, etc.

  -- Camera metadata (EXIF)
  camera_model VARCHAR(100),
  iso_value INT,
  exposure_time VARCHAR(20),
  aperture VARCHAR(10),

  -- Image analysis metrics
  average_brightness DECIMAL(5, 2),
  sky_region_brightness DECIMAL(5, 2),
  horizon_glow_detected BOOLEAN,
  color_temperature INT, -- Kelvin

  processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  processing_error TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (reading_id) REFERENCES sky_readings(id) ON DELETE CASCADE,
  INDEX idx_status (processing_status)
);
```

### 4. sqm_devices
Registered Sky Quality Meter devices
```sql
CREATE TABLE sqm_devices (
  id VARCHAR(36) PRIMARY KEY,
  device_serial VARCHAR(100) UNIQUE NOT NULL,
  device_model VARCHAR(100),
  owner_user_id VARCHAR(36),

  -- Installation location (if fixed)
  is_fixed_location BOOLEAN DEFAULT FALSE,
  fixed_latitude DECIMAL(10, 8),
  fixed_longitude DECIMAL(11, 8),
  fixed_location_name VARCHAR(255),

  last_reading_at TIMESTAMP,
  calibration_date DATE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_serial (device_serial),
  INDEX idx_owner (owner_user_id)
);
```

### 5. locations
Pre-populated cities and regions for quick lookup
```sql
CREATE TABLE locations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  -- Aggregated statistics
  average_sqm DECIMAL(4, 2),
  average_bortle DECIMAL(3, 1),
  total_readings INT DEFAULT 0,
  last_reading_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_country (country),
  INDEX idx_city (city),
  INDEX idx_coords (latitude, longitude)
);
```

### 6. contributions
Track user contributions and gamification
```sql
CREATE TABLE contributions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  contribution_type ENUM('reading', 'photo', 'device_install', 'verification') NOT NULL,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_points (user_id, points)
);
```

## Indexes for Performance

```sql
-- Spatial queries
CREATE INDEX idx_readings_spatial ON sky_readings(latitude, longitude, bortle_scale);

-- Time-series queries
CREATE INDEX idx_readings_time ON sky_readings(observation_datetime, location_name);

-- Leaderboard queries
CREATE INDEX idx_contributions_leaderboard ON contributions(user_id, points DESC);
```

## Light Pollution Scale Reference

### Bortle Scale (1-9)
1. Excellent dark-sky site
2. Typical truly dark site
3. Rural sky
4. Rural/suburban transition
5. Suburban sky
6. Bright suburban sky
7. Suburban/urban transition
8. City sky
9. Inner-city sky

### SQM Values (mag/arcsec²)
- 21.7+ = Class 1 (Excellent)
- 21.5-21.7 = Class 2
- 21.3-21.5 = Class 3
- 20.4-21.3 = Class 4
- 19.1-20.4 = Class 5
- 18.0-19.1 = Class 6
- 18.0-18.4 = Class 7
- <18.0 = Class 8-9 (Severe light pollution)
