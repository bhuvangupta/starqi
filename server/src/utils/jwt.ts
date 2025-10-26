import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_change_this';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string | null;
}

export interface TempJwtPayload {
  email: string;
  temp: boolean;
}

export const generateToken = (payload: JwtPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
};

export const generateTempToken = (email: string): string => {
  return jwt.sign(
    { email, temp: true } as TempJwtPayload,
    JWT_SECRET,
    { expiresIn: '1h' } as SignOptions
  );
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyTempToken = (token: string): TempJwtPayload => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TempJwtPayload;
    if (!payload.temp) {
      throw new Error('Not a temporary token');
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired temporary token');
  }
};
