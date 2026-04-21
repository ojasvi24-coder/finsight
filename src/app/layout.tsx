"use client";

import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react"; // Make sure to install lucide-react
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: In Next.js 13+ App Router, metadata must be in a Server Component.
// Since we need 'use client' for the mobile menu state, 
// you should ideally move this metadata to a separate 'layout.server.tsx' 
// or keep it here if you handle state in a sub-component.
export const metadata = {
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
        
        {/* Mobile Header - Only visible on small screens */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <span className="font-bold text-blue-400">FinSight</span>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex">
          {/* 1. The Navigation Sidebar 
            We pass the 'isOpen' state to control visibility on mobile 
          */}
          <div className={`
            fixed inset-y-0 left-0 z-[60] transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:block
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>

          {/* Mobile Overlay - Closes sidebar when clicking outside */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* 2. Main Content Area */}
          <main className="flex-1 min-h-screen relative w-full lg:ml-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>

      </body>
    </html>
  );
}
