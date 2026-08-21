'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import ProfileCard from '@/components/ProfileCard';

interface Interest {
  id: string;
  sender: string;
  receiver: string;
  status: string;
  photo_request: boolean;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

interface ShortlistItem {
  id: string;
  saved_profile: string;
  saved_profile_details: IndividualProfile;
  created_at: string;
}

function computeCompatibility(myProfile: IndividualProfile, other: IndividualProfile): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  let total = 0;

  const fieldsToCompare = [
    { key: 'diet', label: 'Diet' },
    { key: 'spiritual_orientation', label: 'Spiritual orientation' },
    { key: 'family_involvement', label: 'Family involvement' },
    { key: 'relocation_willingness', label: 'Relocation' },
    { key: 'tamil_language_importance', label: 'Tamil language' },
  ];

  fieldsToCompare.forEach((field) => {
    total++;
    const myVal = (myProfile as any)[field.key];
    const otherVal = (other as any)[field.key];
    if (myVal && otherVal && myVal === otherVal) {
      score++;
      reasons.push(field.label);
    }
  });

  total++;
  if (myProfile.location_city === other.location_city) {
    score++;
    reasons.push('Same city');
  }

  if (myProfile.caste && other.caste && myProfile.caste === other.caste) {
    score++;
    reasons.push('Same caste');
    total++;
  }

  const percent = Math.round((score / total) * 100);
  return { score: percent, reasons };
}

export default function ProfilesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
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
    education: '',
    profession: '',
    caste: '',
    subcaste: '',
    gothram: '',
    natchathiram: '',
    rasi: '',
  });

  const { data: myProfile } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  const { data: allProfilesData, isLoading: profilesLoading } = useQuery<{ results: IndividualProfile[] }>({
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
      if (filters.education) params.append('education', filters.education);
      if (filters.profession) params.append('profession', filters.profession);
      if (filters.caste) params.append('caste', filters.caste);
      if (filters.subcaste) params.append('subcaste', filters.subcaste);
      if (filters.gothram) params.append('gothram', filters.gothram);
      if (filters.natchathiram) params.append('natchathiram', filters.natchathiram);
      if (filters.rasi) params.append('rasi', filters.rasi);
      params.append('ordering', filters.ordering);
      const response = await api.get(`/profiles/individual-profiles/?${params.toString()}`);
      return response.data;
    },
  });

  const { data: interestsData } = useQuery<{ results: Interest[] }>({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await api.get('/interests/interests/');
      return response.data;
    },
  });

  const { data: shortlistData } = useQuery<{ results: ShortlistItem[] }>({
    queryKey: ['shortlist'],
    queryFn: async () => {
      const response = await api.get('/matches/shortlist/');
      return response.data;
    },
  });

  const allProfiles = allProfilesData?.results || [];
  const interests = interestsData?.results || [];
  const shortlist = shortlistData?.results || [];

  const compatibleCount = allProfiles.filter(p => p.id !== myProfile?.id).length;
  const newCount = allProfiles.filter(p => {
    const created = new Date(p.created_at || Date.now());
    const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;
  const interestedInYou = interests.filter(i => i.receiver === myProfile?.id && i.status === 'sent');
  const shortlistCount = shortlist.length;

  const recommended = myProfile
    ? allProfiles
        .filter(p => p.id !== myProfile.id)
        .map(p => ({ profile: p, compatibility: computeCompatibility(myProfile, p) }))
        .sort((a, b) => b.compatibility.score - a.compatibility.score)
        .slice(0, 10)
    : [];

  const newMatches = allProfiles
    .filter(p => {
      const created = new Date(p.created_at || Date.now());
      const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && p.id !== myProfile?.id;
    })
    .slice(0, 10);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
      education: '',
      profession: '',
      caste: '',
      subcaste: '',
      gothram: '',
      natchathiram: '',
      rasi: '',
    });
  };

  const acceptMutation = useMutation({
    mutationFn: async (interestId: string) => {
      await api.post(`/interests/interests/${interestId}/accept/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interests'] }),
  });

  const declineMutation = useMutation({
    mutationFn: async (interestId: string) => {
      await api.post(`/interests/interests/${interestId}/decline/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interests'] }),
  });

  const startConversationMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const response = await api.post('/chat/conversations/', { participant_id: participantId });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = `/chat?conversation_id=${data.id}`;
    },
  });

  // Quick summary chips
  const chips = [
    { label: 'Compatible', count: compatibleCount, tab: 'all' },
    { label: 'New', count: newCount, tab: 'new' },
    { label: 'Interested', count: interestedInYou.length, tab: 'interested' },
    { label: 'Shortlisted', count: shortlistCount, tab: 'shortlist' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Discover</h1>
        <p className="text-muted mt-1">
          People who may be right for you, based on what matters to you.
        </p>
      </div>

      {/* Quick summary chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {chips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => setActiveTab(chip.tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeTab === chip.tab
                ? 'bg-peach text-white'
                : 'bg-white text-ink/70 border border-gray-100 hover:bg-peach-light/30'
            }`}
          >
            {chip.label} ({chip.count})
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'recommended', label: 'Recommended' },
          { id: 'all', label: 'All Matches' },
          { id: 'new', label: 'New Matches' },
          { id: 'interested', label: 'Interested In You' },
          { id: 'shortlist', label: 'Shortlisted' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-peach text-white' : 'bg-white text-ink/70 hover:bg-peach-light/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommended */}
      {activeTab === 'recommended' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
          <p className="text-muted mb-6">Based on your preferences, values and lifestyle.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map(({ profile, compatibility }) => (
              <div key={profile.id} className="relative">
                <ProfileCard profile={profile} />
                {compatibility.score > 0 && (
                  <div className="absolute top-2 left-2 bg-white/80 rounded-full px-2 py-1 text-xs font-medium text-ink">
                    {compatibility.score}% compatible
                  </div>
                )}
                {compatibility.reasons.length > 0 && (
                  <div className="absolute bottom-16 left-2 right-2 bg-white/80 rounded-lg p-2 text-xs text-ink/80">
                    {compatibility.reasons.slice(0,2).join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Matches with filters */}
      {activeTab === 'all' && (
        <div>
          {/* Filter toggle for mobile */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-ink"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filter panel */}
          <div className={`${showFilters || 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input type="text" name="search" placeholder="Search..." value={filters.search} onChange={handleFilterChange} className="p-3 border rounded-xl" />
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

              <div className="mt-4 flex justify-between items-center">
                <button onClick={() => setFilters({ ...filters, education: '', profession: '', caste: '', subcaste: '', gothram: '', natchathiram: '', rasi: '' })} className="text-sm text-peach">
                  Advanced Filters
                </button>
                <button onClick={clearFilters} className="text-sm text-blue">Clear All</button>
              </div>

              {/* Advanced fields (optional; we'll keep collapsed for now) */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProfiles.map(profile => <ProfileCard key={profile.id} profile={profile} />)}
          </div>
        </div>
      )}

      {/* New Matches */}
      {activeTab === 'new' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">New matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newMatches.map(profile => <ProfileCard key={profile.id} profile={profile} />)}
          </div>
        </div>
      )}

      {/* Interested In You */}
      {activeTab === 'interested' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Interested in you</h2>
          <div className="space-y-4">
            {interestedInYou.map(interest => (
              <div key={interest.id} className="bg-white rounded-2xl shadow-card p-5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-ink">{interest.sender_name || interest.sender}</p>
                  <p className="text-sm text-muted">{new Date(interest.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => acceptMutation.mutate(interest.id)} className="bg-peach text-white px-4 py-2 rounded-xl text-sm">Accept</button>
                  <button onClick={() => declineMutation.mutate(interest.id)} className="bg-blue text-white px-4 py-2 rounded-xl text-sm">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shortlisted */}
      {activeTab === 'shortlist' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Shortlisted</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.map(item => <ProfileCard key={item.id} profile={item.saved_profile_details} />)}
          </div>
        </div>
      )}
    </div>
  );
}