import { Request, Response } from 'express';
import { VIIRSService } from '../services/VIIRSService';

const viirsService = new VIIRSService();

/**
 * Get light pollution estimate for coordinates
 * GET /api/viirs/estimate?lat=28.478349&lng=77.321777
 */
export const getLightPollutionEstimate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({
        error: 'Missing required parameters: lat and lng',
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Invalid coordinates: lat and lng must be numbers',
      });
      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({
        error: 'Invalid latitude: must be between -90 and 90',
      });
      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({
        error: 'Invalid longitude: must be between -180 and 180',
      });
      return;
    }

    const estimate = await viirsService.getLightPollutionEstimate(
      latitude,
      longitude
    );

    res.json({
      success: true,
      data: estimate,
    });
  } catch (error: any) {
    console.error('Error getting light pollution estimate:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

/**
 * Get light pollution statistics for a region
 * GET /api/viirs/region?minLat=28&maxLat=29&minLon=77&maxLon=78
 */
export const getRegionStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { minLat, maxLat, minLon, maxLon } = req.query;

    if (!minLat || !maxLat || !minLon || !maxLon) {
      res.status(400).json({
        error: 'Missing required parameters: minLat, maxLat, minLon, maxLon',
      });
      return;
    }

    const bounds = {
      minLat: parseFloat(minLat as string),
      maxLat: parseFloat(maxLat as string),
      minLon: parseFloat(minLon as string),
      maxLon: parseFloat(maxLon as string),
    };

    if (
      isNaN(bounds.minLat) ||
      isNaN(bounds.maxLat) ||
      isNaN(bounds.minLon) ||
      isNaN(bounds.maxLon)
    ) {
      res.status(400).json({
        error: 'Invalid bounds: all parameters must be numbers',
      });
      return;
    }

    const statistics = await viirsService.getRegionStatistics(bounds);

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error: any) {
    console.error('Error getting region statistics:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
