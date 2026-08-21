import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';

interface ProfileCardProps {
  profile: IndividualProfile;
  compatibility?: { score: number; reasons: string[] };
}

export default function ProfileCard({ profile, compatibility }: ProfileCardProps) {
  const queryClient = useQueryClient();
  const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
  const photoUrl = profile.primary_photo;
  const about = profile.about_me ? profile.about_me.slice(0, 80) + '...' : '';

  const interestMutation = useMutation({
    mutationFn: async () => {
      await api.post('/interests/interests/', { receiver: profile.id });
    },
    onSuccess: () => {
      alert('Interest sent!');
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || 'Could not send interest');
    },
  });

  const shortlistMutation = useMutation({
    mutationFn: async () => {
      await api.post('/matches/shortlist/', { saved_profile: profile.id });
    },
    onSuccess: () => {
      alert('Shortlisted!');
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || 'Could not shortlist');
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition overflow-hidden">
      {/* Photo area */}
      <div className="relative h-48 bg-peach-light">
        {photoUrl ? (
          <img src={photoUrl} alt={`${profile.full_name}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/50">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        )}
        {photoUrl && (
          <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Private
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">{profile.full_name}</h3>
            <p className="text-sm text-muted">{profile.location_city}, {profile.location_country}</p>
          </div>
          <span className="text-sm font-medium text-blue">{age} yrs</span>
        </div>
        <p className="text-sm text-muted mt-1">{profile.profession || profile.education}</p>
        {about && <p className="text-sm text-ink/70 mt-2 line-clamp-2">{about}</p>}

        {/* Verification badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.verification_badges.map((badge) => (
            <span key={badge} className="bg-blue text-white px-2 py-0.5 rounded-full text-xs">{badge.replace('_',' ')}</span>
          ))}
          <span className="bg-peach text-white px-2 py-0.5 rounded-full text-xs">{profile.diet.replace('_',' ')}</span>
        </div>

        {/* Compatibility reasons */}
        {compatibility && compatibility.reasons.length > 0 && (
          <div className="mt-3 bg-peach-light/30 rounded-lg p-3 text-xs text-ink/80 space-y-1">
            <p className="font-medium text-ink">Why you may connect</p>
            {compatibility.reasons.slice(0,3).map((reason) => (
              <div key={reason} className="flex items-center gap-2">
                <svg className="w-3 h-3 text-peach" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {reason}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => interestMutation.mutate()}
            disabled={interestMutation.isPending}
            className="flex-1 bg-peach text-white py-2 rounded-xl text-sm font-medium hover:bg-peach/90 transition"
          >
            Interested
          </button>
          <button
            onClick={() => shortlistMutation.mutate()}
            disabled={shortlistMutation.isPending}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-peach text-peach hover:bg-peach-light/30 transition"
            title="Shortlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <Link
            href={`/profiles/${profile.id}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-muted hover:text-ink transition"
            title="More"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}