import Link from 'next/link';
import { IndividualProfile } from '@/types';

interface ProfileCardProps {
  profile: IndividualProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();

  const badgeStyles: Record<string, string> = {
    selfie: 'bg-primary-soft text-primary',
    government_id: 'bg-accent-light text-accent',
    background: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden animate-fade-in">
      {/* Photo area */}
      <div className="relative h-52 bg-gradient-to-br from-primary-soft to-primary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">🔒</div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-xs bg-primary/80 text-white px-3 py-1 rounded-full">
            Private photo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal">{profile.full_name}</h3>
            <p className="text-sm text-muted">{profile.location_city}, {profile.location_country}</p>
          </div>
          <span className="text-sm font-semibold text-primary">{age} yrs</span>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {profile.profession || profile.education || 'Professional'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.verification_badges.map((badge) => (
            <span key={badge} className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[badge] || 'bg-gray-100 text-gray-700'}`}>
              {badge.replace('_', ' ')}
            </span>
          ))}
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {profile.diet.replace('_', ' ')}
          </span>
        </div>

        <Link
          href={`/profiles/${profile.id}`}
          className="mt-5 block w-full text-center bg-primary text-white py-2.5 rounded-xl hover:bg-primary-dark transition-colors font-medium"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}