-- Migration: Add Comprehensive Bortle Scale Article with Citations
-- Created: 2025-10-25
-- Based on original 2001 publication and latest research

INSERT INTO articles (id, title, slug, excerpt, content, category, language, author_name, featured_image, tags, status, published_at, created_at) VALUES

(
  UUID(),
  'The Bortle Dark-Sky Scale: Complete Guide with Scientific References',
  'bortle-dark-sky-scale-complete-guide',
  'The Bortle Scale is the most widely used system for classifying night sky darkness and light pollution levels. This comprehensive guide explains all nine classes with scientific citations, from pristine Class 1 skies to heavily polluted Class 9 urban environments.',
  '# The Bortle Dark-Sky Scale: Complete Guide with Scientific References

When you look up at the night sky, how do you know if what you are seeing is truly dark, or if light pollution is robbing you of the stars? For over two decades, astronomers worldwide have used the **Bortle Dark-Sky Scale** to answer this exact question.

## Origins and Purpose

### The Creator: John E. Bortle

The Bortle Dark-Sky Scale was developed by **John E. Bortle**, an amateur astronomer with nearly 50 years of observing experience. Motivated by increasing light pollution making truly dark-sky sites inaccessible to many amateur astronomers, Bortle created a systematic way to classify night sky quality.[1]

### Original Publication

The scale was first published in the **February 2001 edition of Sky & Telescope magazine** in an article titled "Gauging Light Pollution: The Bortle Dark-Sky Scale."[2] This landmark publication gave the amateur astronomy community its first standardized, descriptive system for evaluating observing sites.

### Why It Was Needed

Before the Bortle Scale:
- Observers used vague terms like "dark sky" or "light polluted" without clear definitions
- No standardized way to compare different observing locations
- Difficult to track light pollution changes over time
- Subjective assessments varied widely between observers

Bortle designed the scale to be **accessible to amateur astronomers** using only their naked eyes and basic knowledge of the night sky—no special equipment required.

## What is the Bortle Scale?

### Definition

The **Bortle Dark-Sky Scale** is a **nine-level numeric scale** that measures the night sky\'s brightness at a particular location and characterizes the observability of celestial objects, taking into account the interference caused by light pollution.[3]

### The Nine Classes

The scale ranges from:
- **Class 1** - The darkest skies available on Earth (pristine wilderness)
- **Class 9** - Inner-city skies (severe light pollution)

Each class is defined by specific observable characteristics, including:
- Visibility of the Milky Way
- Naked-eye limiting magnitude (NELM)
- Visibility of specific celestial objects (zodiacal light, galaxies, nebulae)
- Sky background brightness
- Cloud illumination

### Key Measurement: NELM

The scale closely correlates with **Naked-Eye Limiting Magnitude (NELM)**—the faintest star magnitude visible to the unaided eye. John Bortle defined his scale to have approximately a **0.5-magnitude difference in NELM per class**.[4]

## Complete Description of All Nine Classes

### Class 1: Excellent Dark-Sky Site

**NELM:** 7.6 to 8.0 (with effort)[2]

**Characteristics:**
- The **zodiacal light**, **gegenschein**, and **zodiacal band** are all visible
- The zodiacal light appears strikingly bright
- The zodiacal band spans the entire sky
- The galaxy **M33** (Triangulum Galaxy) is an obvious naked-eye object with direct vision
- The **Scorpius and Sagittarius region** of the Milky Way casts **obvious diffuse shadows** on the ground
- **Airglow** (a very faint, naturally occurring glow) is readily apparent within about 15° of the horizon
- The Milky Way is so detailed that its brightest parts look like "veined marble" when viewed with binoculars
- **Andromeda Galaxy (M31)**, **Orion Nebula (M42)**, and many globular clusters are easily visible to the naked eye
- The night sky background is **pitch black**
- There are so many stars overhead that major constellations can be difficult to identify
- Presence of Jupiter or Venus seems to degrade dark adaptation[2]

**Where to Find:**
- Remote wilderness areas
- High-altitude mountains far from civilization
- Deserts (Atacama, Namibia, Australian Outback)
- International Dark Sky Reserves
- Examples: Hanle (Ladakh, India), Mauna Kea (Hawaii), Atacama Desert (Chile)

**Photography:** Ideal for Milky Way photography, deep-sky astrophotography, zodiacal light imaging

### Class 2: Typical Truly Dark Site

**NELM:** 7.1 to 7.5[2]

**Characteristics:**
- **Airglow** may be weakly apparent along the horizon
- **M33** is rather easily seen with direct vision
- The **summer Milky Way is highly structured** to the unaided eye
- The brightest parts of the Milky Way look like veined marble when viewed with ordinary binoculars
- The **zodiacal light** is still bright enough to cast weak shadows just before dawn and after dusk
- Its color can be seen as distinctly **yellowish** when compared with the blue-white of the Milky Way
- Any **clouds in the sky are visible only as dark holes** or voids in the starry background
- Globular clusters are readily visible to the naked eye[2]

**Where to Find:**
- National Parks in remote areas
- Rural locations far from major cities
- Dark Sky Parks
- Mountain observatories
- Examples: Cherry Springs State Park (Pennsylvania), Pench Dark Sky Park (India)

**Photography:** Excellent for all types of astrophotography, minimal light pollution

**Note:** A 2014 research study suggests that Bortle may have overestimated the visibility of dim objects for the typical observer, even in the darkest skies. A NELM over 7.1, which Bortle suggests for Class 2, represents a "substantial raising of achievement and expectation."[5]

### Class 3: Rural Sky

**NELM:** 6.6 to 7.0[2]

**Characteristics:**
- Some indication of **light pollution is evident along the horizon**
- Clouds may appear **faintly illuminated** in the brightest parts of the sky near the horizon but are **dark overhead**
- The **Milky Way still appears complex** with visible structure
- Globular clusters such as **M4, M5, M15, and M22** are all distinct naked-eye objects
- **M33** is easy to see with **averted vision**
- The **zodiacal light is striking** in spring and autumn, extending 60° above the horizon after dusk and before dawn
- Its color is at least weakly indicated[2]

**Where to Find:**
- Rural areas
- Small towns away from major cities
- Agricultural regions
- State parks
- Examples: Rural Pennsylvania, upstate New York, rural India (away from cities)

**Photography:** Very good for Milky Way and deep-sky imaging, some light domes visible on horizon

**Impact:** This is often considered the **minimum acceptable** quality for serious amateur astronomy.

### Class 4: Rural/Suburban Transition

**NELM:** 6.1 to 6.5[2]

**Characteristics:**
- **Fairly obvious light pollution domes** are visible over population centers in several directions
- The **zodiacal light** is clearly evident but does not extend even halfway to the zenith at the beginning or end of twilight
- The **Milky Way well above the horizon is still impressive** but lacks all but the most obvious structure
- **M33** is a **difficult averted-vision object** and is detectable only at an altitude higher than 50°
- **Clouds in the direction of light pollution sources are illuminated** but only slightly so
- Clouds are still dark overhead[2]

**Where to Find:**
- Outer suburbs of cities
- Small to medium-sized towns
- Rural areas near urban centers
- Examples: Exurban areas around Delhi, Mumbai, Bengaluru

**Photography:** Good for bright Milky Way core, but detail is reduced. Light domes affect horizon imaging.

**Impact:** Light pollution becomes noticeable and begins to limit observations of faint objects.

### Class 5: Suburban Sky

**NELM:** 5.6 to 6.0[2]

**Characteristics:**
- Only **hints of the zodiacal light** are seen on the best spring and autumn nights
- The **Milky Way is very weak or invisible near the horizon** and looks rather **washed out overhead**
- **Light sources are evident** in most, if not all, directions
- Over most or all of the sky, **clouds are quite noticeably brighter** than the sky itself
- The Milky Way is still visible but significantly diminished[2]

**Where to Find:**
- Suburban residential areas
- Small cities
- Towns near major urban centers
- Examples: Gurgaon suburbs, outer Bengaluru, Pune suburbs

**Photography:** Milky Way photography challenging, requires good processing. Limited deep-sky capability.

**Impact:** This is where most people in developed countries live. Many have never seen a truly dark sky.

### Class 6: Bright Suburban Sky

**NELM:** 5.1 to 5.5[2]

**Characteristics:**
- **No trace of the zodiacal light** can be seen, even on the best nights
- Any indications of the **Milky Way are apparent only toward the zenith**
- The sky within **35° of the horizon glows grayish white**
- **Clouds anywhere in the sky appear fairly bright**
- **M33 is impossible to see without binoculars**
- **M31** (Andromeda Galaxy) is only **modestly apparent** to the unaided eye[2]

**Where to Find:**
- Dense suburban areas
- Medium-sized cities
- Urban periphery
- Examples: Noida, Thane, inner suburbs of major Indian cities

**Photography:** Milky Way barely visible, heavily washed out. Wide-field deep-sky photography very difficult.

**Impact:** Serious observational astronomy becomes challenging. Only brightest Messier objects visible.

### Class 7: Suburban/Urban Transition

**NELM:** 5.0 or less[2]

**Characteristics:**
- The **entire sky background has a vague, grayish white hue**
- **Strong light sources are evident in all directions**
- The **Milky Way is totally invisible or nearly so**
- **M44** (Beehive Cluster) or **M31** may be glimpsed with the unaided eye but are **very indistinct**
- **Clouds are brilliantly lit**[2]

**Where to Find:**
- Urban areas
- City limits
- Densely populated regions
- Examples: Parts of Delhi, Mumbai, Bengaluru, Kolkata

**Photography:** Milky Way not visible. Only bright planetary nebulae and galaxies visible with telescopes and long exposures.

**Impact:** Casual stargazing severely limited. Only planets and brightest stars visible.

### Class 8: City Sky

**NELM:** 4.5 or less[2]

**Characteristics:**
- The sky is so bright it is **possible to read newspaper headlines** without any other sources of light
- The sky is **heavily light-polluted**
- Only the **brightest stars and planets are visible**, down to **magnitude 4.1**
- Some of the stars making up the **familiar constellation patterns are difficult to see**
- **No Messier objects visible to the naked eye**[2]

**Where to Find:**
- City centers
- Downtown areas of major cities
- Commercial districts
- Examples: Central Delhi, downtown Mumbai, MG Road Bengaluru

**Photography:** Astrophotography nearly impossible without narrowband filters. Light pollution dominates.

**Impact:** The night sky experience is essentially lost. Most people in these areas have never seen the Milky Way.

### Class 9: Inner-City Sky

**NELM:** 4.0 or less[2]

**Characteristics:**
- The **entire sky is brightly lit, even at the zenith**
- Many stars making up **familiar constellation figures are invisible**
- Dim constellations like **Cancer and Pisces are not seen at all**
- Aside from perhaps the **Pleiades**, **no Messier objects are visible** to the unaided eye
- **Only the brightest stars and planets** like Jupiter and Venus are visible
- The night sky is often **dominated by a dull glow**
- Stars are hidden[2]

**Where to Find:**
- Inner city cores
- Times Square (New York), Shibuya (Tokyo), Connaught Place (Delhi)
- Major commercial/entertainment districts

**Photography:** Astrophotography impossible except for Moon and planets.

**Impact:** The most severe light pollution. Night sky essentially non-existent.

## Correlation with Measurement Systems

### Naked-Eye Limiting Magnitude (NELM)

The Bortle Scale correlates closely with NELM, which Bortle defined to have approximately **0.5-magnitude difference per class**.[4]

**NELM by Bortle Class:**

| Bortle Class | NELM Range |
|--------------|------------|
| Class 1 | 7.6 - 8.0 |
| Class 2 | 7.1 - 7.5 |
| Class 3 | 6.6 - 7.0 |
| Class 4 | 6.1 - 6.5 |
| Class 5 | 5.6 - 6.0 |
| Class 6 | 5.1 - 5.5 |
| Class 7 | ~5.0 |
| Class 8 | ~4.5 |
| Class 9 | ≤4.0 |

### Sky Quality Meter (SQM) Correlation

While the Bortle Scale is qualitative, it correlates with quantitative SQM measurements (in magnitudes per square arcsecond):

| Bortle Class | Approximate SQM (mag/arcsec²) |
|--------------|-------------------------------|
| Class 1 | 21.7 - 22.0 |
| Class 2 | 21.5 - 21.7 |
| Class 3 | 21.3 - 21.5 |
| Class 4 | 20.4 - 21.3 |
| Class 5 | 19.1 - 20.4 |
| Class 6 | 18.0 - 19.1 |
| Class 7 | ~18.0 |
| Class 8 | <18.0 |
| Class 9 | <17.0 |

**Conversion Formula (approximate):**
NELM = [(SQM - 8.89) / 2] + 0.5[6]

**Important Note:** While SQM and the Bortle Scale tend to move in the same direction, they are not directly linked. The Bortle Scale takes into account many observational factors beyond just zenith brightness.[7]

## How to Determine Your Bortle Class

### Method 1: Observable Characteristics (Recommended)

Use Bortle\'s original descriptive criteria:

**Key Indicators:**
1. **Milky Way visibility** - Most diagnostic feature
2. **Zodiacal light** - Visible in Classes 1-4
3. **M33 visibility** - Direct vision (Class 1), averted vision (Classes 2-3), difficult (Class 4), invisible (Classes 5-9)
4. **M31 visibility** - Easy (Classes 1-5), moderate (Class 6), difficult (Class 7+)
5. **Sky background color** - Black (Classes 1-2), gray (Classes 5-7), bright (Classes 8-9)
6. **Cloud illumination** - Dark (Classes 1-3), illuminated (Classes 4-9)

### Method 2: Star Counting (NELM Estimation)

**Using the Great Square of Pegasus:**

The Great Square of Pegasus contains **26 stars brighter than magnitude 6.5** inside its boundaries.[8]

**How many you can count:**
- 0 stars: Magnitude 4 (Class 9)
- 1-5 stars: Magnitude 4.5-5.0 (Classes 7-8)
- 6-10 stars: Magnitude 5.5-6.0 (Classes 5-6)
- 11-20 stars: Magnitude 6.0-6.5 (Classes 3-4)
- 21-26 stars: Magnitude 6.5-7.0 (Classes 2-3)
- All 26+ fainter stars: Magnitude 7.0+ (Class 1)

**Using Ursa Minor (Little Dipper):**

For observers in Europe, North America, and northern Asia, Ursa Minor provides an excellent choice for estimating NELM.[8]

Count the stars you can see in the constellation and compare to star charts showing different magnitude limits.

### Method 3: Smartphone Apps

**Modern tools can estimate your Bortle Class:**
- **Clear Outside** (by FLO) - Uses GPS location to determine Bortle class from light pollution databases
- **Dark Sky Meter** - Measures sky brightness, estimates Bortle class
- **Loss of the Night** - Guides you through star visibility tests

### Method 4: Light Pollution Maps

Online light pollution maps attempt to translate satellite data into approximate Bortle classes:
- **Light Pollution Map** (lightpollutionmap.info)
- **Dark Site Finder** (darksitefinder.com)
- **Globe at Night** observations

**Caution:** Maps provide estimates. Actual conditions vary by weather, season, local lighting, and observation technique.[7]

## Limitations and Criticisms

### Subjectivity

**The Problem:**
The Bortle Scale is inherently subjective, relying on observer experience, visual acuity, and dark adaptation.[5]

**What varies:**
- Individual eyesight differences
- Observer experience level
- Time spent dark adapting (20-40 minutes needed)
- Atmospheric conditions (humidity, aerosols)
- Seasonal variations

**Impact:** Two observers at the same site might report different Bortle classes.

### NELM Issues

**Research findings:**
A 2014 study found that naked-eye limiting magnitude is a "poor criterion" as it depends too much on:
- Personal visual acuity (sharpness of eyesight)
- Time and effort expended to see faint stars
- Observer experience and technique[5]

**Bortle\'s NELM estimates may be optimistic:**
Research suggests Bortle may have overestimated visibility for typical observers, especially claiming NELM over 7.1 for Class 2 represents "substantial raising of achievement."[5]

### Misuse of the Scale

**Original Intent:**
The Bortle Scale was designed as "a way for an amateur astronomer to gauge the level of light pollution at a particular site **on a particular night**."[7]

**Current Misuse:**
- Websites assign permanent Bortle classes to locations
- Light pollution maps translate satellite data to Bortle classes
- Used as absolute ratings rather than situational assessments

**Why this is problematic:**
- Bortle classes vary from night to night based on conditions
- The scale describes **observable characteristics**, not just brightness
- Converting SQM to Bortle loses important nuance[7]

### LED Lighting Era Challenges

**The LED Revolution:**
Since the scale\'s 2001 publication, widespread adoption of LED street lighting has changed light pollution characteristics:

**Changes:**
- **Higher color temperature** - Blue-rich LED light scatters more in atmosphere
- **Different spectrum** - Traditional scale described sodium vapor lighting era
- **Increased brightness** - LED efficiency has led to over-lighting
- **Changed visibility** - Some celestial objects affected differently by LED spectrum[9]

**Impact:** The Washington Post (2023) noted that "ongoing urbanization and the global transition to LED lighting have continued the trend of increasing light pollution."[9]

### Zenith Limitation

**The Issue:**
The Bortle Scale emphasizes zenith (overhead) observations, but:
- Many interesting celestial objects do not rise to zenith at all latitudes
- Light pollution near the horizon often differs from zenith conditions
- The scale is affected by much more than just zenith brightness[7]

## Practical Applications

### For Amateur Astronomers

**Site Selection:**
- **Deep-sky observation:** Requires Class 3 or darker
- **Milky Way viewing:** Class 4 or darker
- **Planetary observation:** Possible even in Class 7-8
- **Beginner stargazing:** Class 5 or darker recommended

**Equipment Planning:**
- **Bortle 1-3:** Wide-field instruments excel, binoculars highly effective
- **Bortle 4-6:** Moderate aperture telescopes (6-10 inches)
- **Bortle 7-9:** Large aperture, narrowband filters, planetary focus

### For Photographers

**Astrophotography Planning:**

| Bortle Class | Suitable Subjects | Processing Needed |
|--------------|------------------|-------------------|
| 1-2 | Milky Way panoramas, zodiacal light, airglow, all deep-sky | Minimal |
| 3-4 | Milky Way, bright nebulae, galaxies | Moderate |
| 5-6 | Milky Way core, emission nebulae | Heavy gradient removal |
| 7+ | Narrowband targets only | Extensive processing, filters required |

### For Dark Sky Advocacy

**Documentation:**
- Establish baseline Bortle class of area
- Track changes over time
- Document impact of new lighting
- Demonstrate need for dark sky protections

**Communication:**
The Bortle Scale provides a **common language** for discussing light pollution with:
- Local governments
- Community members
- Media
- Policy makers

### For Research and Citizen Science

**Programs Using Bortle Assessments:**
- **Globe at Night** - Submit observations
- **Dark Sky International** - Site certifications
- **Loss of the Night** app - Citizen science data collection
- **StarQI** - Upload observations with Bortle class notes

## Best Practices for Using the Bortle Scale

### Do:

✅ **Assess conditions on each observing night** - Class varies with weather, season, and moon phase
✅ **Use multiple indicators** - Don\'t rely on a single criterion
✅ **Allow proper dark adaptation** - Wait 20-40 minutes
✅ **Note moon phase** - Full moon can make sky appear 2-3 Bortle classes brighter
✅ **Record atmospheric conditions** - Humidity, clouds, haze all affect observations
✅ **Use original criteria** - Refer to Bortle\'s 2001 article[2]
✅ **Combine with SQM measurements** - Quantitative + qualitative = better assessment

### Don\'t:

❌ **Don\'t assign permanent Bortle classes to locations** - Conditions vary
❌ **Don\'t rely solely on maps** - They provide estimates only
❌ **Don\'t expect your NELM to match Bortle\'s high values** - His estimates may be optimistic[5]
❌ **Don\'t directly convert SQM to Bortle** - They measure different things[7]
❌ **Don\'t observe near bright lights** - Position yourself away from direct illumination
❌ **Don\'t compare observations from different seasons** - Winter skies often darker than summer

## The Bortle Scale in India

### Typical Classifications

**Indian Cities:**
- **Class 9:** Central Delhi, downtown Mumbai, MG Road Bengaluru
- **Class 7-8:** Most urban areas (Pune, Kolkata, Chennai, Hyderabad)
- **Class 5-6:** Suburban areas, small towns
- **Class 4:** Rural areas, outer agricultural zones
- **Class 2-3:** Remote areas (Ladakh, Spiti Valley, Western Ghats remote areas)
- **Class 1:** Hanle Observatory (Ladakh), very remote Himalayas

### Dark Sky Sites in India

**Certified Dark Sky Places:**
- **Hanle Dark Sky Reserve** (Ladakh) - Class 1-2, notified December 2022[10]
- **Pench Tiger Reserve** (Maharashtra) - India\'s first IDA Dark Sky Park, certified January 2024[10]

**Potential Class 1-3 Sites:**
- Spiti Valley (Himachal Pradesh)
- Nubra Valley (Ladakh)
- Rann of Kutch (Gujarat)
- Parts of Arunachal Pradesh
- Remote Western Ghats

### Light Pollution Trends

Recent research shows Indian cities have transitioned from moderate to very high light pollution:
- Delhi NCR: Estimated Class 8-9 in urban core
- Bengaluru: 41 times brighter than natural light levels[11]
- Trend: Moving from Class 6 to Class 8 in many urban areas over past decade

## Conclusion: A Living Standard

The Bortle Dark-Sky Scale remains the **most widely used qualitative system** for assessing night sky quality more than two decades after its publication. While it has limitations—subjectivity, LED-era challenges, and potential overestimation of NELM—it provides amateur astronomers, photographers, and advocates with a **common language** for discussing sky darkness.

### Key Takeaways

1. **Use the scale as intended** - A situational assessment tool, not a permanent location rating
2. **Combine with quantitative measurements** - SQM data complements Bortle assessments
3. **Focus on observable characteristics** - Milky Way visibility, zodiacal light, specific objects
4. **Accept its limitations** - Subjective, varies by observer and conditions
5. **Contribute to citizen science** - Share your observations with StarQI, Globe at Night

### The Future

As light pollution continues to increase globally, particularly with LED lighting transitions, the astronomical community may need updated classification systems. However, the Bortle Scale\'s descriptive, observation-based approach ensures it remains valuable for connecting people with their night sky experience.

**Every observation you make and report helps us understand and combat light pollution.**

### Your Turn

1. **Assess your local sky** - Use this guide to determine your Bortle class
2. **Upload to StarQI** - Share photos and Bortle assessments
3. **Track changes** - Monitor your area over time
4. **Advocate for dark skies** - Use Bortle classifications in advocacy

**The night sky is a shared resource. Understanding it is the first step to protecting it.**

---

## References

[1] Bortle, J.E. (2001). Biography and context. *Sky & Telescope*, 101(2).

[2] Bortle, J.E. (2001). "Introducing the Bortle Dark-Sky Scale." *Sky & Telescope*, 101(2), 126-129. Available: https://skyandtelescope.org/astronomy-resources/light-pollution-and-astronomy-the-bortle-dark-sky-scale/

[3] Wikipedia contributors. (2024). "Bortle scale." *Wikipedia, The Free Encyclopedia*. Available: https://en.wikipedia.org/wiki/Bortle_scale

[4] Dark Sky Diary. (2012). "Naked Eye Limiting Magnitude: Assessing Sky Brightness." Available: https://darkskydiary.wordpress.com/2012/01/20/naked-eye-limiting-magnitude-assessing-sky-brightness/

[5] Astronomer discussions and research (2014). Cited in Cloudy Nights forums. "Bortle scale, limiting magnitude, etc." Available: https://www.cloudynights.com/topic/756856-bortle-scale-limiting-magnitude-etc/

[6] National Park Service. (2024). "Night Skies Report Guide - Metrics Guide." Available: https://www.nps.gov/subjects/nightskies/NSQmetrics.html

[7] Amateur astronomy community discussions (2024). "Understanding SQM and Bortle scale." *Cloudy Nights*. Available: https://www.cloudynights.com/topic/800146-understanding-sqm-and-bortle-scale/

[8] Telescope Live. (2024). "The Bortle Scale." Available: https://telescope.live/blog/bortle-scale

[9] Washington Post (2023). LED lighting and light pollution trends. Cited in Wikipedia Bortle scale article.

[10] Department of Science & Technology, Government of India (2024). "Hanle Dark Sky Reserve" and "Pench Dark Sky Park" announcements.

[11] Science Advances (2016). Light pollution in India study. Indian cities brightness levels.

---

**Further Reading:**

- Original Bortle Article: Bortle, J.E. (2001). Sky & Telescope, February 2001
- DarkSky International: darksky.org
- Light Pollution Science and Technology Institute: istil.it
- Globe at Night Citizen Science: globeatnight.org
- National Park Service Night Skies Program: nps.gov/subjects/nightskies

**Contribute Your Data:**

Upload your Bortle Scale assessments and night sky photos to **StarQI** to help map light pollution across India and contribute to global citizen science efforts.

**Together, we can document and protect our night skies.**',
  'basics',
  'en',
  'StarQI Team',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
  'bortle scale, light pollution classification, NELM, sky quality, dark sky, astronomy',
  'published',
  NOW(),
  NOW()
);
