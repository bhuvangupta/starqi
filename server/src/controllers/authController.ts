import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { generateToken, generateTempToken, verifyTempToken } from '../utils/jwt';
import { body, validationResult } from 'express-validator';
import { emailService } from '../services/emailService';
import { otpService } from '../services/otpService';

const userRepository = AppDataSource.getRepository(User);

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('username')
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be 3-100 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('full_name').optional().isString(),
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, username, password, full_name } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(409).json({ error: 'Email or username already exists' });
      return;
    }

    // Create new user
    const user = userRepository.create({
      email,
      username,
      full_name: full_name || null,
    });

    await user.hashPassword(password);
    await userRepository.save(user);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Find user with password hash
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await userRepository.findOne({
      where: { id: req.user.userId },
      relations: ['sky_readings', 'contributions'],
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        total_readings: user.sky_readings.length,
        total_contributions: user.contributions.reduce(
          (sum, c) => sum + c.points,
          0
        ),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// ============================================
// OTP-based Authentication
// ============================================

export const sendOTPValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { email } });
    const isNewUser = !existingUser;

    // Generate and send OTP
    const otp = await otpService.createOTP(email);
    await emailService.sendOTPEmail(email, otp);

    res.json({
      message: 'OTP sent to your email',
      isNewUser,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOTPValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be 6 digits'),
];

export const verifyOTPHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, otp } = req.body;

    // Verify OTP
    const isValid = await otpService.verifyOTP(email, otp);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // Check if user exists
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      // New user - send temp token for profile completion
      const tempToken = generateTempToken(email);
      res.json({
        message: 'OTP verified. Please complete your profile',
        isNewUser: true,
        tempToken,
      });
      return;
    }

    // Existing user - send auth token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: 'Login successful',
      isNewUser: false,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        state: user.state,
        country: user.country,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

export const completeProfileValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('state').optional().isString(),
  body('latitude').optional().isNumeric(),
  body('longitude').optional().isNumeric(),
];

export const completeProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Verify temp token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    let tempPayload;
    try {
      tempPayload = verifyTempToken(token);
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const email = tempPayload.email;
    const { full_name, state, country, latitude, longitude } = req.body;

    // Check if user already exists (shouldn't happen, but safety check)
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Create new user
    const user = userRepository.create({
      email,
      username: null, // OTP users don't have username
      password_hash: null, // OTP users don't have password
      full_name,
      state: state || null,
      country,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    await userRepository.save(user);

    // Generate auth token
    const authToken = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: 'Registration successful',
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        state: user.state,
        country: user.country,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ error: 'Failed to complete profile' });
  }
};
