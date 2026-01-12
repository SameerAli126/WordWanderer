"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Award } from "lucide-react"

const allBadges = [
  { id: 1, title: "Bea's Big Hike", date: "May 2025", icon: "🥾", color: "bg-green-500", earned: true },
  { id: 2, title: "Duo's Frozen Winter", date: "January 2025", icon: "❄️", color: "bg-blue-400", earned: true },
  { id: 3, title: "Duo's Phantom Potion", date: "October 2024", icon: "👻", color: "bg-purple-500", earned: true },
  { id: 4, title: "Duocon 2024", date: "September 2024", icon: "🎪", color: "bg-blue-500", earned: true },
  { id: 5, title: "Lucy's Aquatic Adventure", date: "June 2024", icon: "🌊", color: "bg-cyan-500", earned: true },
  { id: 6, title: "Spring Festival", date: "March 2024", icon: "🌸", color: "bg-pink-500", earned: true },
  { id: 7, title: "New Year Resolution", date: "January 2024", icon: "🎊", color: "bg-yellow-500", earned: true },
  { id: 8, title: "Halloween Spook", date: "October 2023", icon: "🎃", color: "bg-orange-500", earned: true },
  { id: 9, title: "Summer Vibes", date: "July 2023", icon: "☀️", color: "bg-yellow-400", earned: true },
  { id: 10, title: "Earth Day", date: "April 2023", icon: "🌍", color: "bg-green-600", earned: true },
  { id: 11, title: "Valentine's Love", date: "February 2023", icon: "💝", color: "bg-red-500", earned: true },
  { id: 12, title: "Winter Wonderland", date: "December 2022", icon: "⛄", color: "bg-blue-300", earned: true },
]

export default function AllBadgesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Award className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold">Monthly Badges</h1>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-slate-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{allBadges.filter((b) => b.earned).length}</div>
            <div className="text-sm text-slate-400">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{allBadges.length}</div>
            <div className="text-sm text-slate-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-sm text-slate-400">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">2</div>
            <div className="text-sm text-slate-400">Years Active</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBadges.map((badge) => (
            <Card key={badge.id} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors">
              <CardContent className="p-4 text-center">
                <div
                  className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 ${
                    !badge.earned ? "opacity-50 grayscale" : ""
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{badge.title}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {badge.date}
                </div>

                {badge.earned && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-600 px-2 py-1 rounded-full text-white">Earned</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
