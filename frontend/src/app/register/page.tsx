'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  email: z.string().email().optional(),
  role: z.enum(['individual', 'parent']).default('individual'),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'individual',
      phone: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const response = await api.post('/accounts/auth/register/', data);
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      router.push('/profiles/create');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        // Extract first error message
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input {...register('phone')} placeholder="Phone" className="w-full p-2 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        <input {...register('email')} placeholder="Email (optional)" className="w-full p-2 border rounded" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <input {...register('confirm_password')} type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" />
        <select {...register('role')} className="w-full p-2 border rounded">
          <option value="individual">Individual</option>
          <option value="parent">Parent</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 text-white py-2 rounded">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}