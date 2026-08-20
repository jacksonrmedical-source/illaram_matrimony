'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  price_inr: number;
  duration_days: number;
}

export default function PremiumPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data: plansData, isLoading } = useQuery<{ results: Plan[] }>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await api.get('/payments/plans/');
      return response.data;
    },
  });

  const plans = plansData?.results ?? [];

  const createOrderMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await api.post('/payments/payments/create_order/', { plan_id: planId });
      return response.data;
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      await api.post('/payments/payments/verify/', paymentData);
    },
  });

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: Plan) => {
    setError('');
    setSuccess(false);
    setProcessing(true);

    try {
      const orderData = await createOrderMutation.mutateAsync(plan.id);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Razorpay checkout failed to load. Please try again.');
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Illaram Matrimony',
        description: `${plan.name} Subscription`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccess(true);
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
          } catch (verifyError) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        theme: {
          color: '#0F4C4C',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading plans...</div>;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-gray-600 mb-8">
          Unlock unlimited interests, chat with matches, and get verified badges.
        </p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Payment successful! Premium activated.</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-3xl font-bold text-teal-600 my-2">₹{plan.price_inr}</p>
              <p className="text-sm text-gray-500">{plan.duration_days} days</p>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={processing}
                className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <Link href="/profiles" className="text-teal-600">← Back to Profiles</Link>
        </div>
      </div>
    </AuthGuard>
  );
}