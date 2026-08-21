import Link from 'next/link';
import { IndividualProfile } from '@/types';

interface ProfileCardProps {
  profile: IndividualProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
  const photoUrl = profile.primary_photo;

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition overflow-hidden">
      <div className="relative h-48 bg-peach-light">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${profile.full_name} blurred`}
            className="w-full h-full object-cover"
          />
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

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">{profile.full_name}</h3>
            <p className="text-sm text-muted">{profile.location_city}, {profile.location_country}</p>
          </div>
          <span className="text-sm font-medium text-blue">{age} yrs</span>
        </div>
        <p className="mt-2 text-sm text-ink/70">{profile.profession || profile.education}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.verification_badges.map((badge) => (
            <span key={badge} className="bg-blue text-white px-2 py-0.5 rounded-full text-xs">{badge.replace('_',' ')}</span>
          ))}
          <span className="bg-peach text-white px-2 py-0.5 rounded-full text-xs">{profile.diet.replace('_',' ')}</span>
        </div>
        <Link href={`/profiles/${profile.id}`} className="mt-4 block w-full text-center bg-peach text-white py-2 rounded-xl hover:bg-peach/90 font-medium">
          View Profile
        </Link>
      </div>
    </div>
  );
}