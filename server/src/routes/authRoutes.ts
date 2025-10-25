import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  getProfile,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
