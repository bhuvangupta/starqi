import { Router } from 'express';
import {
  getImpactMetrics,
  getQuickStats,
  updateManualMetric,
} from '../controllers/statsController';

const router = Router();

/**
 * @route   GET /api/stats/impact
 * @desc    Get comprehensive impact metrics for dashboard
 * @access  Public
 */
router.get('/impact', getImpactMetrics);

/**
 * @route   GET /api/stats/quick
 * @desc    Get quick stats (lighter version for About page)
 * @access  Public
 */
router.get('/quick', getQuickStats);

/**
 * @route   PUT /api/stats/manual/:metricName
 * @desc    Update a manual metric value
 * @access  Protected (TODO: Add auth middleware)
 */
router.put('/manual/:metricName', updateManualMetric);

export default router;
