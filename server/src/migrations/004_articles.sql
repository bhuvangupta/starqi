-- Migration: Articles Table for Blog
-- Purpose: Store blog articles/educational content
-- Created: 2025-01-25

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category ENUM('basics', 'science', 'how-to', 'impact', 'action', 'news') DEFAULT 'basics',
  language ENUM('en', 'hi') DEFAULT 'en',
  author_id VARCHAR(36),
  author_name VARCHAR(255) DEFAULT 'StarQI Team',
  featured_image VARCHAR(500),
  tags VARCHAR(500),
  status ENUM('draft', 'published') DEFAULT 'draft',
  view_count INT DEFAULT 0,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_language (language),
  INDEX idx_published_at (published_at),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample articles
INSERT INTO articles (id, title, slug, excerpt, content, category, language, author_name, status, published_at, created_at) VALUES
(
  UUID(),
  'What is Light Pollution?',
  'what-is-light-pollution',
  'Light pollution is the excessive or misdirected artificial light that brightens the night sky and disrupts natural darkness. Learn about its causes, effects, and what we can do about it.',
  '# What is Light Pollution?

Light pollution is the excessive, misdirected, or obtrusive artificial light that brightens the night sky and disrupts the natural darkness.

## Types of Light Pollution

### 1. Sky Glow
The brightening of the night sky over inhabited areas, caused by artificial lights scattering in the atmosphere.

### 2. Glare
Excessive brightness that causes visual discomfort and can reduce visibility.

### 3. Light Trespass
When unwanted light enters properties, such as streetlights shining into bedroom windows.

### 4. Clutter
Excessive grouping of bright, confusing light sources, commonly found in urban areas.

## Why Does It Matter?

### Impact on Wildlife
- Birds migrate at wrong times due to artificial lights
- Sea turtles cannot find their way to the ocean
- Insects are attracted to lights, disrupting ecosystems
- Nocturnal animals have their hunting patterns disrupted

### Impact on Human Health
- Disruption of circadian rhythms
- Sleep disorders
- Increased risk of obesity, depression, and certain cancers
- Eye strain and fatigue

### Energy Waste
- 30% of outdoor lighting in the US is wasted
- Costs $3.3 billion annually
- Generates 21 million tons of CO2 per year

## What Can We Do?

1. **Use shielded lighting** that directs light downward
2. **Install motion sensors** to reduce unnecessary lighting
3. **Choose warm-colored LEDs** (2700K or lower)
4. **Turn off lights when not needed**
5. **Support dark sky initiatives** in your community
6. **Measure and report** light pollution using StarQI

## Conclusion

Light pollution is a growing environmental problem, but unlike many environmental issues, it can be reversed quickly with proper lighting practices and community awareness.

**Take action today**: Upload your first sky reading to StarQI and help us map light pollution in your area!',
  'basics',
  'en',
  'StarQI Team',
  'published',
  NOW(),
  NOW()
),
(
  UUID(),
  'How to Take Perfect Night Sky Photos',
  'how-to-take-night-sky-photos',
  'Want to measure light pollution with StarQI? Learn the best techniques for capturing clear night sky photos with your smartphone.',
  '# How to Take Perfect Night Sky Photos for StarQI

Getting accurate light pollution measurements requires good quality night sky photos. Here is a complete guide.

## Equipment You Need

### Minimum Requirements
- Any smartphone with a camera
- Stable surface or tripod (optional but recommended)
- Clear night sky

### Recommended
- Phone tripod or mount
- Remote shutter or timer
- Manual camera app (for better control)

## Best Practices

### 1. Choose the Right Time
- **Clear skies**: Check weather forecast
- **Moon phase**: New moon or crescent moon is best
- **Time**: 1-2 hours after sunset or before sunrise
- **Season**: Any season works, but winter often has clearer skies

### 2. Find the Right Location
- Away from direct light sources
- Open area with view of the sky
- Safe and accessible location
- Consider different locations for comparison

### 3. Camera Settings (if available)
- **ISO**: 800-3200 (higher for darker locations)
- **Exposure**: 10-30 seconds
- **Focus**: Manual focus on infinity
- **White Balance**: Auto or Daylight

### 4. Taking the Photo

**Step-by-step:**
1. Set up your phone on a stable surface
2. Point camera toward darkest part of sky (usually away from cities)
3. Avoid including moon if possible
4. Use timer or remote to avoid camera shake
5. Take multiple photos for comparison
6. Include horizon if possible (helps analysis)

## Common Mistakes to Avoid

❌ **Don''t**: Point camera at streetlights or buildings
❌ **Don''t**: Take photos when moon is full or very bright
❌ **Don''t**: Use flash
❌ **Don''t**: Shake the camera while taking photo
❌ **Don''t**: Take photos through windows

✅ **Do**: Keep camera steady
✅ **Do**: Point at open sky
✅ **Do**: Take multiple shots
✅ **Do**: Note location and time

## After Taking Photos

1. Select your best photo
2. Go to StarQI and upload
3. Add accurate location (GPS or manual)
4. Wait for analysis
5. View your results on the map!

## Tips for Better Results

- **Practice**: Take several photos and compare
- **Different angles**: Try north, south, east, west
- **Track changes**: Return to same location monthly
- **Share**: Contribute to global database
- **Learn**: Study your results and improve

## Smartphone-Specific Tips

### iPhone
- Use Night Mode if available
- Tap to focus on stars
- Adjust exposure slider down slightly
- Use Live Photos and select best frame

### Android
- Use Pro/Manual mode if available
- Adjust ISO and shutter speed
- Use built-in timer
- Try different camera apps (Open Camera, Camera FV-5)

## Sample Locations in India

### Good spots near Gurgaon:
- Damdama Lake
- Sohna Hills
- Manesar (outskirts)
- Aravalli Biodiversity Park

### Excellent dark sky sites in India:
- Spiti Valley, Himachal Pradesh
- Nubra Valley, Ladakh
- Rann of Kutch, Gujarat
- Pangong Lake, Ladakh

## Start Measuring Today!

Now that you know how to take great night sky photos, head to the [Upload page](/upload) and contribute your first reading to StarQI!

Together, we can map light pollution across India and advocate for darker skies!',
  'how-to',
  'en',
  'StarQI Team',
  'published',
  NOW(),
  NOW()
);

-- Comments table for future (optional)
CREATE TABLE IF NOT EXISTS article_comments (
  id VARCHAR(36) PRIMARY KEY,
  article_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_article (article_id),
  INDEX idx_status (status),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grant permissions (if needed)
-- GRANT SELECT, INSERT, UPDATE ON articles TO 'starqi_user'@'localhost';
