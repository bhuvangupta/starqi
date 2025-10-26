import crypto from 'crypto';
import { AppDataSource } from '../config/database';
import { OTPCode } from '../models/OTPCode';
import { Repository } from 'typeorm';

class OTPService {
  private otpRepository: Repository<OTPCode>;

  constructor() {
    this.otpRepository = AppDataSource.getRepository(OTPCode);
  }

  /**
   * Generate a random 6-digit OTP
   */
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Create and store a new OTP for the given email
   */
  async createOTP(email: string): Promise<string> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Invalidate any previous unverified OTPs for this email
    await this.otpRepository
      .createQueryBuilder()
      .update(OTPCode)
      .set({ verified: true })
      .where('email = :email', { email })
      .andWhere('verified = :verified', { verified: false })
      .execute();

    // Create new OTP
    const otpCode = this.otpRepository.create({
      email,
      code: otp,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    });

    await this.otpRepository.save(otpCode);

    console.log(`✅ OTP created for ${email}: ${otp} (expires at ${expiresAt.toISOString()})`);
    return otp;
  }

  /**
   * Verify the OTP for the given email
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    // Find the most recent unverified OTP for this email
    const otpCode = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.email = :email', { email })
      .andWhere('otp.code = :code', { code })
      .andWhere('otp.verified = :verified', { verified: false })
      .andWhere('otp.expires_at > :now', { now: new Date() })
      .orderBy('otp.created_at', 'DESC')
      .getOne();

    if (!otpCode) {
      // Increment attempts for any matching OTP (even if expired)
      await this.otpRepository
        .createQueryBuilder()
        .update(OTPCode)
        .set({ attempts: () => 'attempts + 1' })
        .where('email = :email', { email })
        .andWhere('code = :code', { code })
        .execute();

      console.log(`❌ Invalid or expired OTP for ${email}`);
      return false;
    }

    // Check if too many attempts
    if (otpCode.attempts >= 5) {
      console.log(`❌ Too many attempts for OTP ${otpCode.id}`);
      return false;
    }

    // Mark as verified
    otpCode.verified = true;
    await this.otpRepository.save(otpCode);

    console.log(`✅ OTP verified successfully for ${email}`);
    return true;
  }

  /**
   * Clean up expired OTPs (optional, for maintenance)
   */
  async cleanupExpiredOTPs(): Promise<void> {
    const result = await this.otpRepository
      .createQueryBuilder()
      .delete()
      .from(OTPCode)
      .where('expires_at < :now', { now: new Date() })
      .orWhere('verified = :verified', { verified: true })
      .execute();

    console.log(`🧹 Cleaned up ${result.affected} expired/verified OTPs`);
  }
}

export const otpService = new OTPService();
