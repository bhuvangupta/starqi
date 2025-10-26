import { Router } from 'express';
import {
  getLightPollutionEstimate,
  getRegionStatistics,
} from '../controllers/viirsController';

const router = Router();

/**
 * VIIRS (Satellite Light Pollution Data) Routes
 *
 * @route GET /api/viirs/estimate - Get light pollution estimate for coordinates
 * @route GET /api/viirs/region - Get statistics for a geographic region
 */

// Get light pollution estimate for specific coordinates
router.get('/estimate', getLightPollutionEstimate);

// Get region statistics
router.get('/region', getRegionStatistics);

export default router;
