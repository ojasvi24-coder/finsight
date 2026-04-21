import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/components/ClientLayout"; // Import the new client component
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "FinSight - AI-Powered Financial Intelligence",
  description: "Take control of your wealth with real-time insights, personalized recommendations, and data-driven financial strategies. Unlike standard banking apps that only track where your money went, FinSight uses behavioral analytics to predict where your wealth could be, offering actionable AI-driven strategies to bridge the gap.",
  keywords: ["finance", "wealth", "investments", "AI", "financial intelligence"],
  authors: [{ name: "FinSight Team" }],
  openGraph: {
    title: "FinSight - Financial Intelligence Platform",
    description: "Your AI-powered guide to wealth building and financial freedom",
    url: "https://finsight.app",
    siteName: "FinSight",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FinSight Dashboard" }],
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
      <body className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
        {/* Pass children into the interactive Client layout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

