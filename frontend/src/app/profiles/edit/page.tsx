'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { IndividualProfile } from '@/types';

const schema = z.object({
  full_name: z.string().min(3),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string(),
  location_city: z.string().min(2),
  location_state: z.string().optional(),
  location_country: z.string().min(2),
  education: z.string().optional(),
  profession: z.string().optional(),
  income_range: z.string().optional(),
  height_cm: z.number().optional(),
  about_me: z.string().optional(),
  tamil_language_importance: z.enum(['very', 'somewhat', 'not']).default('somewhat'),
  spiritual_orientation: z.enum(['temple_going', 'spiritual_not_religious', 'cultural_only', 'atheist']).default('cultural_only'),
  diet: z.enum(['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan']).default('vegetarian'),
  family_involvement: z.enum(['high', 'moderate', 'low']).default('moderate'),
  relocation_willingness: z.enum(['within_tn', 'within_india', 'abroad', 'flexible']).default('flexible'),
  caste: z.string().optional(),
  subcaste: z.string().optional(),
  gothram: z.string().optional(),
  natchathiram: z.string().optional(),
  rasi: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      gender: 'male',
      date_of_birth: '',
      location_city: '',
      location_state: '',
      location_country: 'India',
      education: '',
      profession: '',
      income_range: '',
      height_cm: undefined,
      about_me: '',
      tamil_language_importance: 'somewhat',
      spiritual_orientation: 'cultural_only',
      diet: 'vegetarian',
      family_involvement: 'moderate',
      relocation_willingness: 'flexible',
      caste: '',
      subcaste: '',
      gothram: '',
      natchathiram: '',
      rasi: '',
    },
  });

  const { data: myProfile, isLoading } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  useEffect(() => {
    if (myProfile) {
      reset({
        full_name: myProfile.full_name,
        gender: myProfile.gender as any,
        date_of_birth: myProfile.date_of_birth,
        location_city: myProfile.location_city,
        location_state: myProfile.location_state || '',
        location_country: myProfile.location_country,
        education: myProfile.education || '',
        profession: myProfile.profession || '',
        income_range: myProfile.income_range || '',
        height_cm: myProfile.height_cm || undefined,
        about_me: myProfile.about_me || '',
        tamil_language_importance: myProfile.tamil_language_importance as any,
        spiritual_orientation: myProfile.spiritual_orientation as any,
        diet: myProfile.diet as any,
        family_involvement: myProfile.family_involvement as any,
        relocation_willingness: myProfile.relocation_willingness as any,
        caste: myProfile.caste || '',
        subcaste: myProfile.subcaste || '',
        gothram: myProfile.gothram || '',
        natchathiram: myProfile.natchathiram || '',
        rasi: myProfile.rasi || '',
      });
    }
  }, [myProfile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(`/profiles/individual-profiles/${myProfile!.id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      router.push('/profiles');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to update profile');
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input {...register('full_name')} className="w-full p-2 border rounded" />
            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select {...register('gender')} className="w-full p-2 border rounded">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input type="date" {...register('date_of_birth')} className="w-full p-2 border rounded" />
              {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input {...register('location_city')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <input {...register('location_state')} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input {...register('location_country')} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Education</label>
              <input {...register('education')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Profession</label>
              <input {...register('profession')} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Income Range</label>
              <input {...register('income_range')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input type="number" {...register('height_cm', { valueAsNumber: true })} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">About Me</label>
            <textarea {...register('about_me')} rows={4} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tamil Language Importance</label>
              <select {...register('tamil_language_importance')} className="w-full p-2 border rounded">
                <option value="very">Very Important</option>
                <option value="somewhat">Somewhat Important</option>
                <option value="not">Not Important</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Spiritual Orientation</label>
              <select {...register('spiritual_orientation')} className="w-full p-2 border rounded">
                <option value="temple_going">Temple-going</option>
                <option value="spiritual_not_religious">Spiritual but not religious</option>
                <option value="cultural_only">Cultural only</option>
                <option value="atheist">Atheist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Diet</label>
              <select {...register('diet')} className="w-full p-2 border rounded">
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Family Involvement</label>
              <select {...register('family_involvement')} className="w-full p-2 border rounded">
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Relocation Willingness</label>
            <select {...register('relocation_willingness')} className="w-full p-2 border rounded">
              <option value="within_tn">Within Tamil Nadu</option>
              <option value="within_india">Within India</option>
              <option value="abroad">Abroad</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Caste</label>
              <input {...register('caste')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Subcaste</label>
              <input {...register('subcaste')} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Gothram</label>
              <input {...register('gothram')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Natchathiram</label>
              <input {...register('natchathiram')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Rasi</label>
              <input {...register('rasi')} className="w-full p-2 border rounded" />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}