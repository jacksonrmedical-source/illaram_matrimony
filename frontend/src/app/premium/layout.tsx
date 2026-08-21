import AuthGuard from '@/components/AuthGuard';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}