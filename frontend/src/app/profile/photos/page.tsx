'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Photo {
  id: string;
  image: string;
  blurred_image: string | null;
  is_primary: boolean;
  created_at: string;
}

export default function PhotosPage() {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState('');

  const { data: photosData, isLoading } = useQuery<{ results: Photo[] }>({
    queryKey: ['photos'],
    queryFn: async () => {
      const response = await api.get('/profiles/photos/');
      return response.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/profiles/photos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      setUploadError('');
    },
    onError: (error: any) => {
      setUploadError(error.response?.data?.image?.[0] || 'Upload failed');
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await api.post(`/profiles/photos/${photoId}/set_primary/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await api.delete(`/profiles/photos/${photoId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  if (isLoading) return <div className="p-8">Loading photos...</div>;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Photos</h1>

        <div className="mb-6">
          <label className="block">
            <span className="sr-only">Choose photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </label>
          {uploadMutation.isPending && <p className="text-gray-500">Uploading...</p>}
          {uploadError && <p className="text-red-500">{uploadError}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photosData?.results?.map((photo) => (
            <div key={photo.id} className="bg-white p-2 rounded shadow">
              <img
                src={photo.image}
                alt="Profile"
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm">
                  {photo.is_primary ? (
                    <span className="text-teal-600 font-semibold">Primary</span>
                  ) : (
                    <span className="text-gray-500">Secondary</span>
                  )}
                </span>
                <div className="flex gap-2">
                  {!photo.is_primary && (
                    <button
                      onClick={() => setPrimaryMutation.mutate(photo.id)}
                      disabled={setPrimaryMutation.isPending}
                      className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded disabled:opacity-50"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this photo?')) {
                        deleteMutation.mutate(photo.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {photosData?.results?.length === 0 && (
            <p className="text-gray-500">No photos yet. Upload one above.</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}