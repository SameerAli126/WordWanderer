"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const monthlyBadges = [
  {
    id: 1,
    title: "Bea's Big Hike",
    date: "May 2025",
    icon: "🥾",
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Duo's Frozen Winter",
    date: "January 2025",
    icon: "❄️",
    color: "bg-blue-400",
  },
  {
    id: 3,
    title: "Duo's Phantom Potion",
    date: "October 2024",
    icon: "👻",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Duocon 2024",
    date: "September 2024",
    icon: "🎪",
    color: "bg-blue-500",
  },
  {
    id: 5,
    title: "Lucy's Aquatic Adventure",
    date: "June 2024",
    icon: "🌊",
    color: "bg-cyan-500",
  },
]

interface MonthlyBadgesProps {
  onViewAll?: () => void
}

export function MonthlyBadges({ onViewAll }: MonthlyBadgesProps) {
  return (
    <aside className="w-full lg:w-80">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Monthly Badges</h3>
          <Button variant="link" className="text-blue-400 p-0 h-auto text-sm" onClick={onViewAll}>
            VIEW ALL
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {monthlyBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 ${badge.color} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-xl sm:text-2xl">{badge.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm sm:text-base">{badge.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm">{badge.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-3">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {["ABOUT", "BLOG", "STORE", "EFFICACY", "CAREERS"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {["INVESTORS", "TERMS", "PRIVACY"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
