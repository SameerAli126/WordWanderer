"use client"

import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-white">WordWanderer</div>
          <p className="mt-2 text-sm text-slate-400">
            Learn languages with focused practice, clear streaks, and guided progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/register" className="hover:text-white">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  )
}
