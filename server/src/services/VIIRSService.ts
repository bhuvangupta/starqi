import { AppDataSource } from '../config/database';
import { VIIRSData } from '../models/VIIRSData';
import { LightPollutionLevel } from '../models/SkyReading';

const viirsRepository = AppDataSource.getRepository(VIIRSData);

export interface LightPollutionEstimate {
  radiance: number; // nanoWatts/cm²/sr
  sqm: number; // Sky Quality Meter value (mag/arcsec²)
  bortleScale: number; // Bortle Dark Sky Scale (1-9)
  lightPollutionLevel: LightPollutionLevel;
  nelm: number; // Naked Eye Limiting Magnitude
  source: string;
  dataYear: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * VIIRS Data Service
 * Handles nighttime lights data from NOAA/NASA satellites
 */
export class VIIRSService {
  /**
   * Convert VIIRS radiance to SQM (Sky Quality Meter) value
   * Based on research correlating satellite radiance to ground-level sky brightness
   *
   * Formula derived from:
   * Falchi et al. (2016) "The new world atlas of artificial night sky brightness"
   *
   * @param radiance - VIIRS radiance in nanoWatts/cm²/sr
   * @returns SQM value in mag/arcsec²
   */
  private radianceToSQM(radiance: number): number {
    // Convert radiance to sky brightness using empirical formula
    // log10(radiance) correlation with SQM
    // Higher radiance = brighter sky = lower SQM value

    if (radiance <= 0.5) {
      // Very dark sky - minimal light pollution
      return 22.0; // Excellent dark sky
    } else if (radiance <= 2) {
      // Dark sky
      return 21.5 - (Math.log10(radiance) * 0.5);
    } else if (radiance <= 10) {
      // Moderate light pollution
      return 21.0 - (Math.log10(radiance) * 1.0);
    } else if (radiance <= 50) {
      // High light pollution
      return 20.0 - (Math.log10(radiance) * 1.5);
    } else {
      // Extreme light pollution (urban areas)
      return Math.max(15.0, 19.0 - (Math.log10(radiance) * 2.0));
    }
  }

  /**
   * Convert SQM to Bortle Scale
   * Based on standard Bortle scale classifications
   *
   * @param sqm - Sky Quality Meter value in mag/arcsec²
   * @returns Bortle scale value (1-9)
   */
  private sqmToBortle(sqm: number): number {
    if (sqm >= 21.99) return 1; // Excellent dark sky
    if (sqm >= 21.89) return 2; // Typical dark sky
    if (sqm >= 21.69) return 3; // Rural sky
    if (sqm >= 20.49) return 4; // Rural/suburban transition
    if (sqm >= 19.50) return 5; // Suburban sky
    if (sqm >= 18.94) return 6; // Bright suburban sky
    if (sqm >= 18.38) return 7; // Suburban/urban transition
    if (sqm >= 17.00) return 8; // City sky
    return 9; // Inner city sky
  }

  /**
   * Convert SQM to Naked Eye Limiting Magnitude (NELM)
   *
   * @param sqm - Sky Quality Meter value in mag/arcsec²
   * @returns NELM value
   */
  private sqmToNELM(sqm: number): number {
    // Empirical formula: NELM ≈ (SQM - 11) / 2
    return Math.max(3.0, Math.min(7.5, (sqm - 11) / 2));
  }

  /**
   * Convert SQM to Light Pollution Level
   *
   * @param sqm - Sky Quality Meter value in mag/arcsec²
   * @returns Light pollution level classification
   */
  private sqmToLightPollutionLevel(sqm: number): LightPollutionLevel {
    if (sqm >= 21.5) return LightPollutionLevel.EXCELLENT;
    if (sqm >= 20.5) return LightPollutionLevel.GOOD;
    if (sqm >= 19.5) return LightPollutionLevel.MODERATE;
    if (sqm >= 18.5) return LightPollutionLevel.POOR;
    return LightPollutionLevel.VERY_POOR;
  }

  /**
   * Get light pollution estimate for coordinates
   * Queries local VIIRS database or returns estimated values
   *
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Light pollution estimate
   */
  async getLightPollutionEstimate(
    latitude: number,
    longitude: number
  ): Promise<LightPollutionEstimate> {
    // Query nearest VIIRS data point (within 0.01 degrees ~ 1km)
    const nearestData = await viirsRepository
      .createQueryBuilder('viirs')
      .where(
        'ABS(viirs.latitude - :lat) < 0.01 AND ABS(viirs.longitude - :lon) < 0.01',
        { lat: latitude, lon: longitude }
      )
      .orderBy('viirs.data_year', 'DESC')
      .getOne();

    let radiance: number;
    let dataYear: number;
    let source: string;

    if (nearestData) {
      radiance = Number(nearestData.radiance);
      dataYear = nearestData.data_year;
      source = nearestData.source;
    } else {
      // Default estimate for unknown areas (assume moderate light pollution)
      radiance = 5.0;
      dataYear = new Date().getFullYear();
      source = 'Estimated';
    }

    const sqm = this.radianceToSQM(radiance);
    const bortleScale = this.sqmToBortle(sqm);
    const nelm = this.sqmToNELM(sqm);
    const lightPollutionLevel = this.sqmToLightPollutionLevel(sqm);

    return {
      radiance,
      sqm,
      bortleScale,
      lightPollutionLevel,
      nelm,
      source,
      dataYear,
      coordinates: { latitude, longitude },
    };
  }

  /**
   * Store VIIRS data point
   * Used when processing downloaded VIIRS tiles
   *
   * @param data - VIIRS data to store
   */
  async storeVIIRSData(data: {
    latitude: number;
    longitude: number;
    radiance: number;
    dataYear: number;
    tileId?: string;
    source?: string;
  }): Promise<VIIRSData> {
    const viirs = new VIIRSData();
    viirs.latitude = data.latitude;
    viirs.longitude = data.longitude;
    viirs.radiance = data.radiance;
    viirs.data_year = data.dataYear;
    viirs.tile_id = data.tileId || null;
    viirs.source = data.source || 'VIIRS-DNB-Annual';

    return await viirsRepository.save(viirs);
  }

  /**
   * Get VIIRS statistics for a region
   *
   * @param bounds - Geographic bounding box
   * @returns Statistics for the region
   */
  async getRegionStatistics(bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }): Promise<{
    avgRadiance: number;
    avgSQM: number;
    avgBortle: number;
    dataPoints: number;
  }> {
    const data = await viirsRepository
      .createQueryBuilder('viirs')
      .select('AVG(viirs.radiance)', 'avgRadiance')
      .addSelect('COUNT(*)', 'dataPoints')
      .where('viirs.latitude BETWEEN :minLat AND :maxLat', {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
      })
      .andWhere('viirs.longitude BETWEEN :minLon AND :maxLon', {
        minLon: bounds.minLon,
        maxLon: bounds.maxLon,
      })
      .getRawOne();

    const avgRadiance = parseFloat(data.avgRadiance) || 0;
    const avgSQM = this.radianceToSQM(avgRadiance);
    const avgBortle = this.sqmToBortle(avgSQM);
    const dataPoints = parseInt(data.dataPoints) || 0;

    return {
      avgRadiance,
      avgSQM,
      avgBortle,
      dataPoints,
    };
  }
}
