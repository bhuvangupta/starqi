import { Router } from 'express';
import { getPhotoFeed, getPhotoDetails } from '../controllers/photoController';

const router = Router();

/**
 * @route GET /api/photos/feed
 * @desc Get photo gallery feed with pagination
 * @access Public
 */
router.get('/feed', getPhotoFeed);

/**
 * @route GET /api/photos/:photoId
 * @desc Get single photo details
 * @access Public
 */
router.get('/:photoId', getPhotoDetails);

export default router;
