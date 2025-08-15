// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⬇️ make sure this path matches your project structure
// If your components are under src/components, keep "@/components/..."
// If they’re at /components (no /src), change to "../components/..."
import CookieConsentBanner from "@/components/cookie-consent";
// import AnalyticsLoader from "@/components/analytics-loader"; // optional if you added it

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeepMyCert",
  description: "Track, manage, and get reminders for your IT certifications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}
      >
        {children}
        <CookieConsentBanner />
        {/* <AnalyticsLoader /> */}
      </body>
    </html>
  );
}
