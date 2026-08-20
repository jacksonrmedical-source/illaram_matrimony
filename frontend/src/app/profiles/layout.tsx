import AuthGuard from '@/components/AuthGuard';

export default function ProfilesLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
