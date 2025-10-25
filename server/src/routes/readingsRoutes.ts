import { Router } from 'express';
import {
  uploadPhoto,
  uploadPhotoValidation,
  getReadingById,
  getReadings,
  getReadingsValidation,
  getMapData,
  getStatistics,
} from '../controllers/readingsController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

// Upload photo (requires authentication or can be anonymous)
router.post(
  '/upload',
  optionalAuth,
  upload.single('photo'),
  uploadPhotoValidation,
  uploadPhoto
);

// Get single reading
router.get('/:id', getReadingById);

// Get readings with filters
router.get('/', getReadingsValidation, getReadings);

// Get map data
router.get('/map/data', getMapData);

// Get statistics
router.get('/stats/global', getStatistics);

export default router;
