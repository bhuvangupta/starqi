import sharp from 'sharp';
import { LightPollutionLevel } from '../models/SkyReading';

export interface SkyAnalysisResult {
  sqm_value: number;
  bortle_scale: number;
  sky_brightness: number;
  star_count: number;
  light_pollution_level: LightPollutionLevel;
  average_brightness: number;
  sky_region_brightness: number;
  horizon_glow_detected: boolean;
  color_temperature: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export class SkyQualityAnalyzer {
  /**
   * Main analysis function - analyzes a sky photo and returns quality metrics
   */
  async analyzePhoto(imagePath: string): Promise<SkyAnalysisResult> {
    try {
      // Load image and get metadata
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      if (!width || !height) {
        throw new Error('Invalid image dimensions');
      }

      // Get raw pixel data
      const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Perform various analyses
      const averageBrightness = this.calculateAverageBrightness(data, info);
      const skyRegionBrightness = this.calculateSkyRegionBrightness(
        data,
        info
      );
      const starCount = await this.estimateStarCount(imagePath);
      const horizonGlowDetected = this.detectHorizonGlow(data, info);
      const colorTemperature = this.estimateColorTemperature(data, info);

      // Calculate SQM value from brightness
      const sqmValue = this.brightnesseToSQM(skyRegionBrightness);

      // Determine Bortle scale
      const bortleScale = this.sqmToBortleScale(sqmValue);

      // Determine overall light pollution level
      const lightPollutionLevel = this.determineLightPollutionLevel(
        sqmValue,
        starCount,
        horizonGlowDetected
      );

      return {
        sqm_value: sqmValue,
        bortle_scale: bortleScale,
        sky_brightness: skyRegionBrightness,
        star_count: starCount,
        light_pollution_level: lightPollutionLevel,
        average_brightness: averageBrightness,
        sky_region_brightness: skyRegionBrightness,
        horizon_glow_detected: horizonGlowDetected,
        color_temperature: colorTemperature,
      };
    } catch (error) {
      console.error('Error analyzing photo:', error);
      throw new Error('Failed to analyze sky photo');
    }
  }

  /**
   * Calculate average brightness across entire image
   */
  private calculateAverageBrightness(
    data: Buffer,
    info: sharp.OutputInfo
  ): number {
    const { width, height, channels } = info;
    let totalBrightness = 0;
    const pixelCount = width * height;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate luminance (perceived brightness)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += brightness;
    }

    return totalBrightness / pixelCount;
  }

  /**
   * Calculate brightness of upper portion of image (sky region)
   * Excludes bottom 30% which may contain horizon/ground
   */
  private calculateSkyRegionBrightness(
    data: Buffer,
    info: sharp.OutputInfo
  ): number {
    const { width, height, channels } = info;
    const skyStartRow = 0;
    const skyEndRow = Math.floor(height * 0.7); // Top 70% of image
    let totalBrightness = 0;
    let pixelCount = 0;

    for (let y = skyStartRow; y < skyEndRow; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
        pixelCount++;
      }
    }

    return totalBrightness / pixelCount;
  }

  /**
   * Estimate number of visible stars using bright point detection
   */
  private async estimateStarCount(imagePath: string): Promise<number> {
    try {
      // Convert to grayscale and apply threshold to find bright points
      const { data, info } = await sharp(imagePath)
        .grayscale()
        .normalise() // Enhance contrast
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { width, height } = info;
      const threshold = 200; // Brightness threshold for star detection
      const minStarSize = 2; // Minimum pixels for a star
      const maxStarSize = 50; // Maximum pixels (to exclude clouds/artifacts)

      let starCount = 0;
      const visited = new Set<number>();

      // Flood fill to count connected bright regions (stars)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (visited.has(idx)) continue;

          const brightness = data[idx];
          if (brightness > threshold) {
            const regionSize = this.floodFill(
              data,
              width,
              height,
              x,
              y,
              threshold,
              visited
            );

            if (regionSize >= minStarSize && regionSize <= maxStarSize) {
              starCount++;
            }
          }
        }
      }

      return starCount;
    } catch (error) {
      console.error('Error estimating star count:', error);
      return 0;
    }
  }

  /**
   * Flood fill algorithm to detect connected bright regions
   */
  private floodFill(
    data: Buffer,
    width: number,
    height: number,
    startX: number,
    startY: number,
    threshold: number,
    visited: Set<number>
  ): number {
    const stack: Array<[number, number]> = [[startX, startY]];
    let size = 0;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = y * width + x;
      if (visited.has(idx)) continue;

      const brightness = data[idx];
      if (brightness <= threshold) continue;

      visited.add(idx);
      size++;

      // Add neighbors
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    return size;
  }

  /**
   * Detect horizon glow (light pollution signature at bottom of image)
   */
  private detectHorizonGlow(data: Buffer, info: sharp.OutputInfo): boolean {
    const { width, height, channels } = info;

    // Compare bottom 20% brightness to top 50% brightness
    const horizonStartRow = Math.floor(height * 0.8);
    const skyEndRow = Math.floor(height * 0.5);

    let horizonBrightness = 0;
    let skyBrightness = 0;
    let horizonPixels = 0;
    let skyPixels = 0;

    // Calculate horizon region brightness
    for (let y = horizonStartRow; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        horizonBrightness += brightness;
        horizonPixels++;
      }
    }

    // Calculate sky region brightness
    for (let y = 0; y < skyEndRow; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        skyBrightness += brightness;
        skyPixels++;
      }
    }

    const avgHorizonBrightness = horizonBrightness / horizonPixels;
    const avgSkyBrightness = skyBrightness / skyPixels;

    // If horizon is significantly brighter, glow is detected
    return avgHorizonBrightness > avgSkyBrightness * 1.3;
  }

  /**
   * Estimate color temperature (light pollution has orange/yellow signature)
   */
  private estimateColorTemperature(
    data: Buffer,
    info: sharp.OutputInfo
  ): number {
    const { width, height, channels } = info;
    let totalR = 0,
      totalG = 0,
      totalB = 0;
    const pixelCount = width * height;

    for (let i = 0; i < data.length; i += channels) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }

    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    // Simplified color temperature estimation
    // Warmer (more red/yellow) = lower temperature = more light pollution
    // Cooler (more blue) = higher temperature = less light pollution
    const colorRatio = avgB / (avgR + 0.01); // Prevent division by zero

    // Map to approximate Kelvin scale (rough estimation)
    // Higher ratio (more blue) = higher temperature
    const estimatedTemp = 3000 + colorRatio * 4000;

    return Math.round(Math.max(2000, Math.min(10000, estimatedTemp)));
  }

  /**
   * Convert average brightness to SQM value
   * SQM (Sky Quality Meter) measures in magnitudes per square arcsecond
   */
  private brightnesseToSQM(brightness: number): number {
    // Inverse relationship: darker sky = higher SQM value
    // Normalize brightness (0-255) to SQM range (typically 15-22)
    // This is a simplified model - real SQM uses log scale

    const normalizedBrightness = brightness / 255;

    // Calculate SQM using logarithmic scale
    // SQM = 22 - (log10(brightness_normalized + 0.01) * scale_factor)
    const sqm = 22 - Math.log10(normalizedBrightness + 0.01) * 3;

    // Clamp to realistic range
    return Math.max(10, Math.min(22, Math.round(sqm * 100) / 100));
  }

  /**
   * Convert SQM value to Bortle Dark-Sky Scale (1-9)
   */
  private sqmToBortleScale(sqm: number): number {
    if (sqm >= 21.7) return 1; // Excellent dark-sky site
    if (sqm >= 21.5) return 2; // Typical truly dark site
    if (sqm >= 21.3) return 3; // Rural sky
    if (sqm >= 20.4) return 4; // Rural/suburban transition
    if (sqm >= 19.1) return 5; // Suburban sky
    if (sqm >= 18.0) return 6; // Bright suburban sky
    if (sqm >= 18.0) return 7; // Suburban/urban transition
    if (sqm < 18.0) return 8; // City sky
    return 9; // Inner-city sky
  }

  /**
   * Determine overall light pollution level based on multiple factors
   */
  private determineLightPollutionLevel(
    sqm: number,
    starCount: number,
    horizonGlow: boolean
  ): LightPollutionLevel {
    // Excellent: SQM > 21.5, many stars, no glow
    if (sqm > 21.5 && starCount > 100 && !horizonGlow) {
      return LightPollutionLevel.EXCELLENT;
    }

    // Good: SQM > 20.5, decent stars
    if (sqm > 20.5 && starCount > 50) {
      return LightPollutionLevel.GOOD;
    }

    // Moderate: SQM > 19, some stars visible
    if (sqm > 19 && starCount > 20) {
      return LightPollutionLevel.MODERATE;
    }

    // Poor: SQM > 17, few stars
    if (sqm > 17) {
      return LightPollutionLevel.POOR;
    }

    // Very Poor: SQM <= 17, very few or no stars
    return LightPollutionLevel.VERY_POOR;
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(imagePath: string): Promise<ImageMetadata> {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: metadata.size || 0,
    };
  }
}
