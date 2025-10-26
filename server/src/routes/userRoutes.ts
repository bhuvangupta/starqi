import { Router } from 'express';
import { getUserStats, getUserReadings } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/users/me/stats
 * @desc Get current user's statistics
 * @access Private
 */
router.get('/me/stats', authenticate, getUserStats);

/**
 * @route GET /api/users/:userId/stats
 * @desc Get specific user's statistics
 * @access Public
 */
router.get('/:userId/stats', getUserStats);

/**
 * @route GET /api/users/me/readings
 * @desc Get current user's readings with pagination
 * @access Private
 */
router.get('/me/readings', authenticate, getUserReadings);

/**
 * @route GET /api/users/:userId/readings
 * @desc Get specific user's readings with pagination
 * @access Public
 */
router.get('/:userId/readings', getUserReadings);

export default router;
