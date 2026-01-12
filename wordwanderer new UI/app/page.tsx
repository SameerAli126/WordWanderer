"use client"

import Link from "next/link"
import { MarketingNavbar } from "@/components/marketing/marketing-navbar"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const featureCards = [
  {
    title: "Structured learning path",
    description: "Follow guided units with clear progress and rewards that keep you consistent.",
  },
  {
    title: "Characters and vocab",
    description: "Practice Chinese characters, pinyin, and everyday vocabulary with focused drills.",
  },
  {
    title: "Daily streak focus",
    description: "Maintain momentum with streak goals, reminders, and quick sessions.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <MarketingNavbar />

      <main>
        <section className="mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-4 pt-16 pb-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">WordWanderer</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Learn Chinese with a modern, focused daily practice loop.
            </h1>
            <p className="text-lg text-slate-300">
              Short lessons, clear progress, and streak-based motivation designed for real consistency.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
                <Link href="/register">Get started</Link>
              </Button>
              <Button variant="outline" asChild className="border-slate-700 text-white hover:bg-slate-800">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="ghost" asChild className="text-slate-200 hover:text-white">
                <Link href="/app">Open the app</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-emerald-400/30 bg-slate-900/80 p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-200">
                  Daily goal: 10 minutes
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-4">
                  <div className="text-sm text-slate-400">Streak</div>
                  <div className="text-3xl font-semibold">5 days</div>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-4">
                  <div className="text-sm text-slate-400">Current unit</div>
                  <div className="text-lg font-semibold">Food and drinks</div>
                  <div className="text-sm text-slate-400">4 lessons left</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="border-slate-800/60 bg-slate-950/70 backdrop-blur">
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="why" className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="mb-10 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Why WordWanderer</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Designed for serious progress</h2>
            <p className="max-w-2xl text-slate-300">
              WordWanderer blends focused practice, daily accountability, and clear feedback to keep learners moving.
              Every lesson is short, intentional, and built to stack quickly into real fluency.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Focus loop",
                    description: "Short sessions with instant feedback and clear next steps.",
                  },
                  {
                    title: "Guided momentum",
                    description: "Streaks, daily goals, and reminders keep practice consistent.",
                  },
                  {
                    title: "Real recall",
                    description: "Character and vocab drills reinforce memory at the right time.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/40 text-sm font-semibold text-emerald-200">
                        0{index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
                  <Link href="/register">Create your account</Link>
                </Button>
                <Button variant="ghost" asChild className="text-slate-200 hover:text-white">
                  <Link href="/app">Explore the app</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-6">
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-200">What you get</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Progress snapshots after every lesson.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Character practice built into the flow.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Guided daily goals and streak recovery.
                  </li>
                </ul>
              </div>

              <div className="grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Daily goal</span>
                  <span className="font-semibold text-white">10 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active streaks</span>
                  <span className="font-semibold text-white">+5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next unit</span>
                  <span className="font-semibold text-white">Food and drinks</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
