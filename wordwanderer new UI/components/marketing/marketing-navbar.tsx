"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MarketingNavbar() {
  return (
    <header className="border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white">
          <img
            src="/ww.svg"
            alt="WordWanderer logo"
            className="h-9 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight">WordWanderer</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#features" className="hover:text-white">
            Features
          </Link>
          <Link href="/#why" className="hover:text-white">
            Why WordWanderer
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="text-slate-200 hover:text-white">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild className="border-slate-700 text-white hover:bg-slate-800">
            <Link href="/register">Sign up</Link>
          </Button>
          <Button asChild className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
            <Link href="/app">Open app</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
