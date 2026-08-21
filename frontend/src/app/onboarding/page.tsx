'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import PhoneInput from '@/components/PhoneInput';

const steps = ['Phone', 'OTP', 'Account', 'Primary', 'Secondary', 'Preferences', 'Privacy', 'Finish'];

export default function OnboardingPage() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerifiedToken, setPhoneVerifiedToken] = useState('');

  const [form, setForm] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'individual',
    relation: '',
    familyMemberName: '',
    full_name: '',
    gender: 'male',
    date_of_birth: '',
    religion: '',
    mother_tongue: '',
    location_city: '',
    location_state: '',
    location_country: 'India',
    marital_status: 'never_married',
    education: '',
    profession: '',
    tamil_language_importance: 'somewhat',
    festivals: [] as string[],
    spiritual_orientation: 'cultural_only',
    family_involvement: 'moderate',
    diet: 'vegetarian',
    relocation_willingness: 'flexible',
    preferred_age_min: '25',
    preferred_age_max: '32',
    preferred_location: '',
    preferred_education: '',
    preferred_profession: '',
    photo_visibility: 'private',
    who_can_message: 'matches',
    review_status: 'pending_review',
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleFestival = (f: string) => setForm(prev => {
    const exists = prev.festivals.includes(f);
    return { ...prev, festivals: exists ? prev.festivals.filter(x => x !== f) : [...prev.festivals, f] };
  });

  const next = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep(prev => Math.max(prev - 1, 0));
  const progress = Math.round((step / (steps.length - 1)) * 100);

  // Step 0: Request OTP
  const requestOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/accounts/auth/request-otp/', { phone: form.phone });
      setOtpSent(true);
      setStep(1);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  // Step 1: Verify OTP
  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/accounts/auth/verify-otp/', { phone: form.phone, otp });
      setPhoneVerifiedToken(res.data.token);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  // Step 2: Account creation (password/role)
  const createAccount = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload: any = {
        phone: form.phone,
        token: phoneVerifiedToken,
        password: form.password,
        confirm_password: form.confirmPassword,
        role: form.role,
      };
      if (form.role === 'parent') {
        payload.relation = form.relation;
        payload.family_member_name = form.familyMemberName;
      }
      const res = await api.post('/accounts/auth/register/', payload);
      const { access, refresh } = res.data;
      setTokens(access, refresh);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  // Step 7: Final submission
  const submitProfile = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        preferred_age_min: form.preferred_age_min ? Number(form.preferred_age_min) : null,
        preferred_age_max: form.preferred_age_max ? Number(form.preferred_age_max) : null,
        festivals: Array.isArray(form.festivals) ? form.festivals : [],
        review_status: 'pending_review',
      };
      await api.post('/profiles/individual-profiles/', payload);
      router.push('/profiles');
    } catch (err: any) {
      console.error('Profile submission error', err.response?.data);
      setError(err.response?.data?.detail || 'Could not create profile');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ink">Create your Illaram profile</h1>
          <p className="text-muted mt-2">Tell us a little about yourself. We'll use this to help you discover meaningful matches.</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2"><div className="bg-peach h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
        <p className="text-xs text-muted mb-6">Step {step + 1} of {steps.length}</p>

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter your phone number</h2>
            <PhoneInput value={form.phone} onChange={(phone) => update('phone', phone)} />
            <button onClick={requestOtp} disabled={loading || !form.phone} className="w-full bg-peach text-white py-3 rounded-xl">Send OTP</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter OTP</h2>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" className="w-full p-3 border rounded-xl" />
            <button onClick={verifyOtp} disabled={loading || !otp} className="w-full bg-peach text-white py-3 rounded-xl">Verify OTP</button>
            <button onClick={() => { setOtpSent(false); setStep(0); }} className="w-full text-sm text-blue">Resend OTP</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Set up your account</h2>
            <div>
              <label className="block text-sm text-muted">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-muted">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-muted">Profile for</label>
              <select value={form.role} onChange={e => update('role', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="individual">Individual</option>
                <option value="parent">Parent / Guardian</option>
              </select>
            </div>
            {form.role === 'parent' && (
              <>
                <input value={form.relation} onChange={e => update('relation', e.target.value)} placeholder="Relationship (e.g., Father)" className="w-full p-3 border rounded-xl" />
                <input value={form.familyMemberName} onChange={e => update('familyMemberName', e.target.value)} placeholder="Family Member Full Name" className="w-full p-3 border rounded-xl" />
              </>
            )}
            <button onClick={createAccount} disabled={loading || !form.password || !form.confirmPassword} className="w-full bg-peach text-white py-3 rounded-xl">Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Primary Profile Details</h2>
            <input value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Full Name" className="w-full p-3 border rounded-xl" />
            <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
            <input type="date" value={form.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} className="w-full p-3 border rounded-xl" />
            <input value={form.religion} onChange={e => update('religion', e.target.value)} placeholder="Religion" className="w-full p-3 border rounded-xl" />
            <input value={form.mother_tongue} onChange={e => update('mother_tongue', e.target.value)} placeholder="Mother Tongue" className="w-full p-3 border rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <input value={form.location_city} onChange={e => update('location_city', e.target.value)} placeholder="City" className="p-3 border rounded-xl" />
              <input value={form.location_state} onChange={e => update('location_state', e.target.value)} placeholder="State" className="p-3 border rounded-xl" />
            </div>
            <input value={form.location_country} onChange={e => update('location_country', e.target.value)} placeholder="Country" className="w-full p-3 border rounded-xl" />
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Secondary Details</h2>
            <select value={form.marital_status} onChange={e => update('marital_status', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="never_married">Never Married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option>
            </select>
            <input value={form.education} onChange={e => update('education', e.target.value)} placeholder="Education" className="w-full p-3 border rounded-xl" />
            <input value={form.profession} onChange={e => update('profession', e.target.value)} placeholder="Profession" className="w-full p-3 border rounded-xl" />
            <label className="block text-sm text-muted">Tamil language importance</label>
            <select value={form.tamil_language_importance} onChange={e => update('tamil_language_importance', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="very">Very Important</option><option value="somewhat">Somewhat Important</option><option value="not">Not Important</option>
            </select>
            <label className="block text-sm text-muted">Spiritual orientation</label>
            <select value={form.spiritual_orientation} onChange={e => update('spiritual_orientation', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="temple_going">Temple-going</option><option value="spiritual_not_religious">Spiritual but not religious</option><option value="cultural_only">Cultural only</option><option value="atheist">Atheist</option>
            </select>
            <label className="block text-sm text-muted">Family involvement</label>
            <select value={form.family_involvement} onChange={e => update('family_involvement', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="high">High</option><option value="moderate">Moderate</option><option value="low">Low</option>
            </select>
            <label className="block text-sm text-muted">Diet</label>
            <select value={form.diet} onChange={e => update('diet', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="vegetarian">Vegetarian</option><option value="non_vegetarian">Non-Vegetarian</option><option value="eggetarian">Eggetarian</option><option value="vegan">Vegan</option>
            </select>
            <label className="block text-sm text-muted">Relocation willingness</label>
            <select value={form.relocation_willingness} onChange={e => update('relocation_willingness', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="within_tn">Within Tamil Nadu</option><option value="within_india">Within India</option><option value="abroad">Abroad</option><option value="flexible">Flexible</option>
            </select>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Partner Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={form.preferred_age_min} onChange={e => update('preferred_age_min', e.target.value)} placeholder="Min Age" className="p-3 border rounded-xl" />
              <input type="number" value={form.preferred_age_max} onChange={e => update('preferred_age_max', e.target.value)} placeholder="Max Age" className="p-3 border rounded-xl" />
            </div>
            <input value={form.preferred_location} onChange={e => update('preferred_location', e.target.value)} placeholder="Preferred Location" className="w-full p-3 border rounded-xl" />
            <input value={form.preferred_education} onChange={e => update('preferred_education', e.target.value)} placeholder="Preferred Education" className="w-full p-3 border rounded-xl" />
            <input value={form.preferred_profession} onChange={e => update('preferred_profession', e.target.value)} placeholder="Preferred Profession" className="w-full p-3 border rounded-xl" />
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy & Photo</h2>
            <label className="block text-sm text-muted">Photo visibility</label>
            <select value={form.photo_visibility} onChange={e => update('photo_visibility', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="private">Private until mutual interest</option><option value="public">Public</option>
            </select>
            <label className="block text-sm text-muted">Who can message you</label>
            <select value={form.who_can_message} onChange={e => update('who_can_message', e.target.value)} className="w-full p-3 border rounded-xl">
              <option value="all">All users</option><option value="matches">Only matches</option>
            </select>
            <p className="text-xs text-muted">You can upload a photo later in the app.</p>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink">Your profile is ready for review</h2>
            <ul className="text-sm text-muted space-y-1">
              <li>✓ Profile created</li>
              <li>✓ Preferences saved</li>
              <li>✓ Submitted for staff review</li>
            </ul>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={submitProfile} disabled={loading} className="w-full bg-peach text-white py-3 rounded-xl">Finish</button>
          </div>
        )}
      </div>
    </div>
  );
}