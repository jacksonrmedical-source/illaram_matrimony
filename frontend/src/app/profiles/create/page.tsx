'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  full_name: z.string().min(3),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string(),
  location_city: z.string().min(2),
  location_state: z.string().optional(),
  location_country: z.string().min(2),
  education: z.string().optional(),
  profession: z.string().optional(),
  about_me: z.string().optional(),
  tamil_language_importance: z.enum(['very', 'somewhat', 'not']).default('somewhat'),
  spiritual_orientation: z.enum(['temple_going', 'spiritual_not_religious', 'cultural_only', 'atheist']).default('cultural_only'),
  diet: z.enum(['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan']).default('vegetarian'),
  family_involvement: z.enum(['high', 'moderate', 'low']).default('moderate'),
  relocation_willingness: z.enum(['within_tn', 'within_india', 'abroad', 'flexible']).default('flexible'),
});

type FormData = z.infer<typeof schema>;

export default function CreateProfilePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await api.post('/profiles/individual-profiles/', data);
      router.push('/profiles');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Profile creation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Your Profile</h1>
        <input {...register('full_name')} placeholder="Full Name" className="w-full p-2 border rounded" />
        {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
        <select {...register('gender')} className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input {...register('date_of_birth')} type="date" className="w-full p-2 border rounded" />
        <input {...register('location_city')} placeholder="City" className="w-full p-2 border rounded" />
        <input {...register('location_state')} placeholder="State" className="w-full p-2 border rounded" />
        <input {...register('location_country')} placeholder="Country" className="w-full p-2 border rounded" />
        <input {...register('education')} placeholder="Education" className="w-full p-2 border rounded" />
        <input {...register('profession')} placeholder="Profession" className="w-full p-2 border rounded" />
        <textarea {...register('about_me')} placeholder="About Me" className="w-full p-2 border rounded" rows={4} />
        <select {...register('tamil_language_importance')} className="w-full p-2 border rounded">
          <option value="very">Very Important</option>
          <option value="somewhat">Somewhat Important</option>
          <option value="not">Not Important</option>
        </select>
        <select {...register('spiritual_orientation')} className="w-full p-2 border rounded">
          <option value="temple_going">Temple-going</option>
          <option value="spiritual_not_religious">Spiritual but not religious</option>
          <option value="cultural_only">Cultural only</option>
          <option value="atheist">Atheist</option>
        </select>
        <select {...register('diet')} className="w-full p-2 border rounded">
          <option value="vegetarian">Vegetarian</option>
          <option value="non_vegetarian">Non-Vegetarian</option>
          <option value="eggetarian">Eggetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <select {...register('family_involvement')} className="w-full p-2 border rounded">
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>
        <select {...register('relocation_willingness')} className="w-full p-2 border rounded">
          <option value="within_tn">Within Tamil Nadu</option>
          <option value="within_india">Within India</option>
          <option value="abroad">Abroad</option>
          <option value="flexible">Flexible</option>
        </select>
        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded">
          {isSubmitting ? 'Creating...' : 'Create Profile'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}