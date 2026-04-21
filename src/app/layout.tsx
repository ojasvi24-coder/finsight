import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Preserved your detailed SEO metadata
export const metadata: Metadata = {
  title: "FinSight - AI-Powered Financial Intelligence",
  description: "Take control of your wealth with real-time insights, personalized recommendations, and data-driven financial strategies.",
  keywords: ["finance", "wealth", "investments", "AI", "financial intelligence"],
  authors: [{ name: "FinSight Team" }],
  openGraph: {
    title: "FinSight - Financial Intelligence Platform",
    description: "Your AI-powered guide to wealth building and financial freedom",
    url: "https://finsight.app",
    siteName: "FinSight",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinSight Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinSight - Financial Intelligence Platform",
    description: "Take control of your wealth with AI-powered insights",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Updated body to use flex layout for the sidebar */}
      <body className="min-h-screen flex bg-slate-950 text-slate-50 overflow-x-hidden">
        
        {/* 1. The Navigation Sidebar */}
        <Sidebar />

        {/* 2. Main Content Area (offset by ml-64 to accommodate the sidebar width) */}
        <main className="flex-1 ml-64 min-h-screen relative">
          {children}
        </main>

      </body>
    </html>
  );
}
