'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import Link from 'next/link';

export default function ProfilesPage() {
  const [filters, setFilters] = useState({
    location_city: '',
    min_age: '',
    max_age: '',
    gender: '',
    diet: '',
  });

  const { data, isLoading, error } = useQuery<{ results: IndividualProfile[] }>({
    queryKey: ['profiles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location_city) params.append('location_city', filters.location_city);
      if (filters.min_age) params.append('min_age', filters.min_age);
      if (filters.max_age) params.append('max_age', filters.max_age);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.diet) params.append('diet', filters.diet);
      const response = await api.get(`/profiles/individual-profiles/?${params.toString()}`);
      return response.data;
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location_city: '',
      min_age: '',
      max_age: '',
      gender: '',
      diet: '',
    });
  };

  if (isLoading) return <div className="p-8">Loading profiles...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load profiles.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Profiles</h1>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="location_city"
            placeholder="City"
            value={filters.location_city}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="min_age"
            placeholder="Min Age"
            value={filters.min_age}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="max_age"
            placeholder="Max Age"
            value={filters.max_age}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select
            name="diet"
            value={filters.diet}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-Vegetarian</option>
            <option value="eggetarian">Eggetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.results?.map((profile) => (
          <div key={profile.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-gray-600">{profile.location_city}, {profile.location_country}</p>
            <p className="text-sm">{profile.profession || profile.education}</p>
            <p className="text-sm text-gray-500">Age: {new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.verification_badges.map((badge) => (
                <span key={badge} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">{badge}</span>
              ))}
            </div>
            <Link href={`/profiles/${profile.id}`} className="mt-3 inline-block text-teal-600">View Profile</Link>
          </div>
        ))}
        {data?.results?.length === 0 && (
          <p className="text-gray-500">No profiles match your filters.</p>
        )}
      </div>
    </div>
  );
}