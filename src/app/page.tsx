import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-slate-900">FinSight.</div>
        <Link href="/dashboard" className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors">
          View Demo
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-7xl">
            Understand your money <br />
            <span className="text-slate-400">like never before.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            FinSight brings Stripe-level analytics to your personal finances. Track net worth, analyze spending habits with AI, and grow your wealth through beautiful, intuitive dashboards.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
            >
              Explore Dashboard
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1 group">
              Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-24 mx-auto max-w-5xl">
          <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-900/5">
            <div className="rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden h-[400px] flex items-center justify-center">
              {/* Replace with actual image or iframe of the dashboard */}
              <p className="text-slate-400 font-medium">[ Dashboard Preview Interface ]</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}