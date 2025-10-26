import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  getProfile,
  sendOTP,
  sendOTPValidation,
  verifyOTPHandler,
  verifyOTPValidation,
  completeProfile,
  completeProfileValidation,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { otpLimiter, verifyLimiter, profileLimiter } from '../middleware/rateLimiter';

const router = Router();

// Traditional auth routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// OTP-based auth routes
router.post('/send-otp', otpLimiter, sendOTPValidation, sendOTP);
router.post('/verify-otp', verifyLimiter, verifyOTPValidation, verifyOTPHandler);
router.post('/complete-profile', profileLimiter, completeProfileValidation, completeProfile);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
