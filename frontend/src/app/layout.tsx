import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Illaram Matrimony",
  description: "Modern Tamil Matrimony",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0F4C4C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <BottomNav />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}