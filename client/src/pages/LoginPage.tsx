import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { SEO } from '../components/SEO';
import { OTPVerification } from '../components/OTPVerification';
import { CompleteProfileForm } from '../components/CompleteProfileForm';

type LoginStep = 'email' | 'otp' | 'profile';

export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.sendOTP({ email });
      setIsNewUser(response.isNewUser);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await apiService.verifyOTP({ email, otp });

      if (response.isNewUser) {
        // New user - need to complete profile
        setTempToken(response.tempToken || '');
        setStep('profile');
      } else {
        // Existing user - log them in
        if (response.token && response.user) {
          setAuth(response.user, response.token);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
      throw err; // Re-throw to show error in OTP component
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (profileData: any) => {
    setError('');
    setLoading(true);

    try {
      // Set temp token for the profile completion request
      localStorage.setItem('auth_token', tempToken);

      const response = await apiService.completeProfile(profileData);

      // Clear temp token and set real auth
      localStorage.removeItem('auth_token');
      setAuth(response.user, response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Login to SkyQI to upload sky quality measurements and track light pollution"
        url="/login"
        locale={i18n.language}
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
        {/* Left Side - Information Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-75"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse delay-150"></div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <span className="text-5xl">🌌</span>
              <div>
                <h1 className="text-4xl font-black text-white">SkyQI</h1>
                <p className="text-purple-200 text-sm">Light Pollution Portal</p>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-12">
              <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                Join the Movement to Save Our Night Skies 🌟
              </h2>
              <p className="text-xl text-purple-100 leading-relaxed">
                Be part of a global community tracking light pollution and preserving dark skies for future generations.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl">📸</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Sky Photos</h3>
                  <p className="text-purple-200">Analyze light pollution with AI-powered tools</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl">🗺️</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Track Global Data</h3>
                  <p className="text-purple-200">See your readings on the interactive world map</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl">🌍</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Make Real Impact</h3>
                  <p className="text-purple-200">Contribute to citizen science and environmental research</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="relative z-10 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-white">7+</div>
              <div className="text-sm text-purple-200 font-medium">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">746+</div>
              <div className="text-sm text-purple-200 font-medium">Readings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">1.2K+</div>
              <div className="text-sm text-purple-200 font-medium">Sky Watchers</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-4xl">🌌</span>
                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SkyQI
                </h1>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white text-2xl mb-4 shadow-lg">
                  {step === 'email' && '✉️'}
                  {step === 'otp' && '🔐'}
                  {step === 'profile' && '👤'}
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {step === 'email' && 'Welcome Back! 👋'}
                  {step === 'otp' && 'Verify Your Email'}
                  {step === 'profile' && 'Complete Your Profile'}
                </h2>
                <p className="text-gray-600">
                  {step === 'email' && 'Enter your email to get started'}
                  {step === 'otp' && `We sent a code to ${email}`}
                  {step === 'profile' && 'Tell us a bit about yourself'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Email Input */}
              {step === 'email' && (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Magic Link...
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Continue with Email
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>🔒</span>
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⚡</span>
                        <span>Instant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🆓</span>
                        <span>Free Forever</span>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <OTPVerification
                  email={email}
                  onVerify={handleVerifyOTP}
                  onResend={() => handleSendOTP(new Event('submit') as any)}
                  loading={loading}
                />
              )}

              {/* Step 3: Complete Profile (for new users) */}
              {step === 'profile' && (
                <CompleteProfileForm
                  onSubmit={handleCompleteProfile}
                  loading={loading}
                />
              )}

              {/* Back button */}
              {step !== 'email' && (
                <button
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-bold mt-6 py-2 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  ← Back to email
                </button>
              )}
            </div>

            {/* Mobile Features (only on small screens) */}
            <div className="lg:hidden mt-8 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3">
                <div className="text-3xl">📸</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Upload Sky Photos</h4>
                  <p className="text-xs text-gray-600">AI-powered analysis</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3">
                <div className="text-3xl">🗺️</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Global Map</h4>
                  <p className="text-xs text-gray-600">See worldwide data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
