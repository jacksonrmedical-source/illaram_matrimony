'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();

  const requestOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/accounts/auth/request-otp/', { phone });
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please check phone number.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/accounts/auth/verify-otp/', { phone, otp });
      const { access, refresh, is_new_user } = response.data;
      setTokens(access, refresh);

      if (is_new_user) {
        // New user must complete registration
        router.push(`/register?phone=${encodeURIComponent(phone)}`);
      } else {
        // Existing user can go to profiles
        router.push('/profiles');
      }
    } catch (err) {
      setError('Invalid OTP or verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="bg-white p-8 rounded-2xl shadow-card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-ink">Login to Illaram</h1>
        {step === 'phone' ? (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
            <button
              onClick={requestOtp}
              disabled={loading || !phone}
              className="w-full bg-peach text-white py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Request OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || !otp}
              className="w-full bg-peach text-white py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}