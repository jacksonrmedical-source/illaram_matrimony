import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = "https://www.illaram.com"; // Replace with your actual domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Illaram | Modern Tamil Matrimony",
    template: "%s | Illaram",
  },
  description:
    "Illaram is a modern Tamil matrimony platform built around compatibility, trust, privacy, and meaningful connections for Tamils worldwide.",
  keywords: [
    "Tamil matrimony",
    "Tamil marriage",
    "Tamil brides",
    "Tamil grooms",
    "Tamil matrimony Chennai",
    "Tamil matrimony Singapore",
    "NRI Tamil matrimony",
    "Tamil matrimonial site",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Illaram Matrimony",
    title: "Illaram | Modern Tamil Matrimony",
    description:
      "A modern Tamil matrimony experience built around compatibility, trust, and meaningful connections.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`, // Add an actual og image later
        width: 1200,
        height: 630,
        alt: "Illaram Tamil Matrimony",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Illaram | Modern Tamil Matrimony",
    description:
      "A modern Tamil matrimony experience built around compatibility, trust, and meaningful connections.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5C5E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-surface">{children}</main>
          <BottomNav />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}