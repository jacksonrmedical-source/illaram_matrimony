'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import ProfileCard from '@/components/ProfileCard';

export default function ProfilesPage() {
  const [filters, setFilters] = useState({
    search: '',
    location_city: '',
    min_age: '',
    max_age: '',
    gender: '',
    diet: '',
    marital_status: '',
    spiritual_orientation: '',
    ordering: '-last_active',
  });

  const { data, isLoading, error } = useQuery<{ results: IndividualProfile[] }>({
    queryKey: ['profiles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location_city) params.append('location_city', filters.location_city);
      if (filters.min_age) params.append('min_age', filters.min_age);
      if (filters.max_age) params.append('max_age', filters.max_age);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.diet) params.append('diet', filters.diet);
      if (filters.marital_status) params.append('marital_status', filters.marital_status);
      if (filters.spiritual_orientation) params.append('spiritual_orientation', filters.spiritual_orientation);
      params.append('ordering', filters.ordering);
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
      search: '',
      location_city: '',
      min_age: '',
      max_age: '',
      gender: '',
      diet: '',
      marital_status: '',
      spiritual_orientation: '',
      ordering: '-last_active',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Discover</h1>
        <span className="text-sm text-muted">{data?.results?.length || 0} profiles</span>
      </div>

      {/* Search + Sort */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name, education, profession..."
            value={filters.search}
            onChange={handleFilterChange}
            className="flex-1 p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary"
          />
          <select
            name="ordering"
            value={filters.ordering}
            onChange={handleFilterChange}
            className="p-3 border border-gray-100 rounded-xl"
          >
            <option value="-last_active">Most Active</option>
            <option value="-created_at">Newest</option>
            <option value="date_of_birth">Youngest First</option>
          </select>
        </div>
      </div>

      {/* Filter chips/panel */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="text" name="location_city" placeholder="City" value={filters.location_city} onChange={handleFilterChange} className="p-3 border rounded-xl" />
          <input type="number" name="min_age" placeholder="Min Age" value={filters.min_age} onChange={handleFilterChange} className="p-3 border rounded-xl" />
          <input type="number" name="max_age" placeholder="Max Age" value={filters.max_age} onChange={handleFilterChange} className="p-3 border rounded-xl" />
          <select name="gender" value={filters.gender} onChange={handleFilterChange} className="p-3 border rounded-xl">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select name="diet" value={filters.diet} onChange={handleFilterChange} className="p-3 border rounded-xl">
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-Vegetarian</option>
            <option value="eggetarian">Eggetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <select name="marital_status" value={filters.marital_status} onChange={handleFilterChange} className="p-3 border rounded-xl">
            <option value="">All Marital Status</option>
            <option value="never_married">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          <select name="spiritual_orientation" value={filters.spiritual_orientation} onChange={handleFilterChange} className="p-3 border rounded-xl">
            <option value="">All Spiritual</option>
            <option value="temple_going">Temple-going</option>
            <option value="spiritual_not_religious">Spiritual but not religious</option>
            <option value="cultural_only">Cultural only</option>
            <option value="atheist">Atheist</option>
          </select>
        </div>
        <div className="mt-4 text-right">
          <button onClick={clearFilters} className="text-sm text-primary hover:text-primary-dark">Clear Filters</button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-primary-soft/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      )}

      {error && <div className="text-red-500">Failed to load profiles.</div>}

      {/* Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results?.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
          {data?.results?.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="text-lg">No profiles match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-primary">Clear filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}