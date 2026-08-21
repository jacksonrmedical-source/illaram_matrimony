'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const steps = ['Welcome','Basic','Culture','Lifestyle','Preferences','Privacy & Photo','Finish'];

const cities = ['Chennai','Coimbatore','Madurai','Trichy','Salem','Tirunelveli','Vellore','Erode','Other'];
const countries = ['India','Singapore','Malaysia','UK','USA','Canada','UAE','Australia','Other'];
const educations = [
  'B.E. Computer Science',
  'B.Tech IT',
  'MBA',
  'M.Sc Mathematics',
  'B.Com',
  'B.A. English',
  'M.E. ECE',
  'MBBS',
  'CA',
  'PhD Physics',
  'Diploma in Mechanical',
  'B.Sc Nursing',
  'B.Ed',
  'M.Tech Software',
  'B.Arch',
  'LLB',
  'B.Pharm',
  'M.Com',
  'BBA',
  'M.Des',
  'Other',
];
const professions = [
  'Software Engineer',
  'Doctor',
  'Teacher',
  'Accountant',
  'Business Analyst',
  'Designer',
  'Architect',
  'Lawyer',
  'Pharmacist',
  'Data Scientist',
  'Product Manager',
  'Consultant',
  'Entrepreneur',
  'Civil Engineer',
  'Marketing Manager',
  'Professor',
  'HR Manager',
  'Financial Analyst',
  'Graphic Designer',
  'Researcher',
  'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    gender: 'male',
    date_of_birth: '',
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
    onboarding_completed: true,
  });

  const update = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleFestival = (festival: string) => {
    setForm(prev => {
      const exists = prev.festivals.includes(festival);
      return { ...prev, festivals: exists ? prev.festivals.filter(f => f !== festival) : [...prev.festivals, festival] };
    });
  };

  const next = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep(prev => Math.max(prev - 1, 0));

  const validateRequired = () => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.date_of_birth) return 'Date of birth is required.';
    if (!form.location_city.trim()) return 'City is required.';
    return null;
  };

  const submitProfile = async () => {
    const requiredError = validateRequired();
    if (requiredError) {
      setError(requiredError);
      setStep(1);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        preferred_age_min: form.preferred_age_min ? Number(form.preferred_age_min) : null,
        preferred_age_max: form.preferred_age_max ? Number(form.preferred_age_max) : null,
        festivals: Array.isArray(form.festivals) ? form.festivals : [],
      };

      let profileId = null;
      try {
        const res = await api.get('/profiles/individual-profiles/me/');
        profileId = res.data.id;
      } catch (err) {
        // no profile yet
      }

      if (profileId) {
        await api.patch(`/profiles/individual-profiles/${profileId}/`, payload);
      } else {
        await api.post('/profiles/individual-profiles/', payload);
      }

      router.push('/profiles');
    } catch (err: any) {
      console.error('Onboarding submit error', err.response?.data);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        const firstError = Object.values(err.response.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Could not save profile.');
      } else {
        setError('Could not save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((step / (steps.length - 1)) * 100);

  // Helper to render a select with Other option
  const selectWithOther = (value: string, options: string[], onChange: (val: string) => void, placeholder: string) => (
    <div className="space-y-2">
      <select
        value={options.includes(value) ? value : 'Other'}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'Other') {
            onChange('');
          } else {
            onChange(val);
          }
        }}
        className="w-full p-3 border rounded-xl"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {(!options.includes(value) || value === 'Other') && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom"
          className="w-full p-3 border rounded-xl"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ink">Create your Illaram profile</h1>
          <p className="text-muted mt-2">Tell us a little about yourself. We'll use this to help you discover meaningful matches.</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-peach h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-muted mb-6">Step {step + 1} of {steps.length}</p>

        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome</h2>
            <p className="text-sm text-muted mb-6">Before you enter Illaram, let's create the foundation for your matches.</p>
            <button onClick={next} className="w-full bg-peach text-white py-3 rounded-xl">Get Started</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information <span className="text-red-500">*</span></h2>
            <div>
              <label className="block text-sm text-muted">Full Name <span className="text-red-500">*</span></label>
              <input value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Full Name" className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-muted">Gender <span className="text-red-500">*</span></label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" value={form.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-muted">City <span className="text-red-500">*</span></label>
              {selectWithOther(form.location_city, cities, (val) => update('location_city', val), 'Select City')}
            </div>
            <div>
              <label className="block text-sm text-muted">State</label>
              <input value={form.location_state} onChange={e => update('location_state', e.target.value)} placeholder="State" className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-muted">Country <span className="text-red-500">*</span></label>
              {selectWithOther(form.location_country, countries, (val) => update('location_country', val), 'Select Country')}
            </div>
            <div>
              <label className="block text-sm text-muted">Marital Status</label>
              <select value={form.marital_status} onChange={e => update('marital_status', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Education</label>
              {selectWithOther(form.education, educations, (val) => update('education', val), 'Select Education')}
            </div>
            <div>
              <label className="block text-sm text-muted">Profession</label>
              {selectWithOther(form.profession, professions, (val) => update('profession', val), 'Select Profession')}
            </div>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tamil Culture</h2>
            <div>
              <label className="block text-sm text-muted">Tamil language importance</label>
              <select value={form.tamil_language_importance} onChange={e => update('tamil_language_importance', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="very">Very Important</option>
                <option value="somewhat">Somewhat Important</option>
                <option value="not">Not Important</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Spiritual orientation</label>
              <select value={form.spiritual_orientation} onChange={e => update('spiritual_orientation', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="temple_going">Temple-going</option>
                <option value="spiritual_not_religious">Spiritual but not religious</option>
                <option value="cultural_only">Cultural only</option>
                <option value="atheist">Atheist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Family involvement</label>
              <select value={form.family_involvement} onChange={e => update('family_involvement', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Festivals you celebrate</label>
              <div className="flex flex-wrap gap-2">
                {['Pongal','Deepavali','Tamil New Year'].map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFestival(f)}
                    className={`px-3 py-2 rounded-full text-sm ${form.festivals.includes(f) ? 'bg-peach text-white' : 'bg-gray-100 text-ink'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lifestyle</h2>
            <div>
              <label className="block text-sm text-muted">Diet</label>
              <select value={form.diet} onChange={e => update('diet', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Relocation willingness</label>
              <select value={form.relocation_willingness} onChange={e => update('relocation_willingness', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="within_tn">Within Tamil Nadu</option>
                <option value="within_india">Within India</option>
                <option value="abroad">Abroad</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Partner Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted">Min Age</label>
                <input type="number" value={form.preferred_age_min} onChange={e => update('preferred_age_min', e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm text-muted">Max Age</label>
                <input type="number" value={form.preferred_age_max} onChange={e => update('preferred_age_max', e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted">Preferred Location</label>
              {selectWithOther(form.preferred_location, cities, (val) => update('preferred_location', val), 'Select Location')}
            </div>
            <div>
              <label className="block text-sm text-muted">Preferred Education</label>
              {selectWithOther(form.preferred_education, educations, (val) => update('preferred_education', val), 'Select Education')}
            </div>
            <div>
              <label className="block text-sm text-muted">Preferred Profession</label>
              {selectWithOther(form.preferred_profession, professions, (val) => update('preferred_profession', val), 'Select Profession')}
            </div>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy & Photo</h2>
            <div>
              <label className="block text-sm text-muted">Photo visibility</label>
              <select value={form.photo_visibility} onChange={e => update('photo_visibility', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="private">Private until mutual interest</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted">Who can message you</label>
              <select value={form.who_can_message} onChange={e => update('who_can_message', e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="all">All users</option>
                <option value="matches">Only matches</option>
              </select>
            </div>
            <p className="text-xs text-muted">You can upload a photo later in the app. Privacy settings can be changed anytime.</p>
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 bg-gray-100 text-ink py-3 rounded-xl">Back</button>
              <button onClick={next} className="flex-1 bg-peach text-white py-3 rounded-xl">Continue</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-ink">Your Illaram profile is ready</h2>
            <ul className="text-sm text-muted space-y-1">
              <li>✓ Profile created</li>
              <li>✓ Preferences saved</li>
              <li>✓ Privacy settings saved</li>
            </ul>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={submitProfile} disabled={loading} className="w-full bg-peach text-white py-3 rounded-xl disabled:opacity-50">
              {loading ? 'Creating...' : 'Find My Matches'}
            </button>
            <button onClick={back} className="w-full bg-gray-100 text-ink py-3 rounded-xl">Back</button>
          </div>
        )}
      </div>
    </div>
  );
}