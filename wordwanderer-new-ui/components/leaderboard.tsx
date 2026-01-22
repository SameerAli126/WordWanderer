"use client"

import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, Flame } from "lucide-react"
import { apiRequest } from "@/lib/api"

const leagueShields = [
  { color: "bg-slate-300", active: false },
  { color: "bg-yellow-400", active: false },
  { color: "bg-blue-400", active: false },
  { color: "bg-red-500", active: true },
  { color: "bg-slate-600", active: false },
  { color: "bg-slate-600", active: false },
  { color: "bg-slate-600", active: false },
]

const fallbackLeaderboard = [
  {
    rank: 13,
    name: "Carolina Kostina",
    xp: 142,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: null,
  },
  {
    rank: 14,
    name: "Ahmet Furkan Şen",
    xp: 129,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: null,
  },
  {
    rank: 15,
    name: "Capnop",
    xp: 129,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: "1+ year",
  },
  {
    rank: 16,
    name: "Игорь Коломойский",
    xp: 120,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: null,
    isDemotion: true,
  },
  {
    rank: 17,
    name: "Sameer",
    xp: 119,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: "2+ years",
    isCurrentUser: true,
    isDemotion: true,
  },
  {
    rank: 18,
    name: "Miguel",
    xp: 69,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: "2+ years",
    isDemotion: true,
  },
  {
    rank: 19,
    name: "Ксения",
    xp: 68,
    avatar: "/placeholder.svg?height=40&width=40",
    streak: null,
    isDemotion: true,
  },
]

export function Leaderboard() {
  const [entries, setEntries] = useState<Array<{
    userId?: string
    rank: number
    name: string
    xp: number
    streak?: number
    avatar?: string | null
    isCurrentUser?: boolean
  }>>([])
  const [currentUser, setCurrentUser] = useState<{
    userId?: string
    rank: number
    name: string
    xp: number
    streak?: number
    avatar?: string | null
    isCurrentUser?: boolean
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchLeaderboard = async () => {
      try {
        const data = await apiRequest<{
          success: boolean
          entries: Array<{
            userId: string
            rank: number
            name: string
            xp: number
            streak: number
            avatar?: string | null
            isCurrentUser?: boolean
          }>
          currentUser?: {
            userId: string
            rank: number
            name: string
            xp: number
            streak: number
            avatar?: string | null
            isCurrentUser?: boolean
          } | null
        }>("/api/leaderboard")

        if (!cancelled) {
          setEntries(data.entries ?? [])
          setCurrentUser(data.currentUser ?? null)
        }
      } catch (error) {
        if (!cancelled) {
          setEntries([])
          setCurrentUser(null)
        }
      }
    }

    fetchLeaderboard()

    return () => {
      cancelled = true
    }
  }, [])

  const leaderboardData = useMemo(() => {
    if (entries.length === 0) {
      return fallbackLeaderboard
    }

    const formatted = entries.map((entry) => ({
      rank: entry.rank,
      name: entry.name,
      xp: entry.xp,
      avatar: entry.avatar,
      streak: entry.streak ? `${entry.streak} days` : null,
      isCurrentUser: entry.isCurrentUser,
    }))

    if (currentUser && !entries.some((entry) => entry.userId === currentUser.userId)) {
      formatted.push({
        rank: currentUser.rank,
        name: currentUser.name,
        xp: currentUser.xp,
        avatar: currentUser.avatar,
        streak: currentUser.streak ? `${currentUser.streak} days` : null,
        isCurrentUser: true,
      })
    }

    const demotionStart = Math.max(formatted.length - 3, 0)
    return formatted.map((entry, index) => ({
      ...entry,
      isDemotion: index >= demotionStart,
    }))
  }, [currentUser, entries])

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* League Shields */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        {leagueShields.map((shield, index) => (
          <div
            key={index}
            className={`w-12 h-14 sm:w-16 sm:h-18 ${shield.color} rounded-t-full rounded-b-lg border-4 ${
              shield.active ? "border-yellow-400 shadow-lg" : "border-slate-600"
            } relative`}
          >
            {shield.active && (
              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-yellow-300 rounded-t-full rounded-b-lg animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* League Info */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Ruby League</h1>
        <p className="text-slate-300 text-sm sm:text-base mb-1">Top 5 advance to the next league</p>
        <p className="text-orange-400 font-bold text-lg sm:text-xl">18 hours</p>
      </div>

      {/* Leaderboard */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {leaderboardData.map((user, index) => (
            <div key={user.rank}>
              {/* Demotion Zone Header */}
              {user.isDemotion && index === 3 && (
                <div className="flex items-center justify-center gap-2 py-3 bg-red-900/30 border-y border-red-500/50">
                  <ChevronDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-bold text-sm">DEMOTION ZONE</span>
                  <ChevronDown className="w-4 h-4 text-red-400" />
                </div>
              )}

              <div
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-slate-700 last:border-b-0 ${
                  user.isCurrentUser ? "bg-slate-700/50" : ""
                } hover:bg-slate-700/30 transition-colors`}
              >
                {/* Rank */}
                <div
                  className={`text-lg sm:text-xl font-bold w-8 text-center ${
                    user.isDemotion ? "text-red-400" : "text-white"
                  }`}
                >
                  {user.rank}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.streak && (
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                      <Flame className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Name and Streak */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm sm:text-base truncate">{user.name}</div>
                  {user.streak && (
                    <div className="flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-orange-400 text-xs font-medium">{user.streak}</span>
                    </div>
                  )}
                </div>

                {/* XP */}
                <div className={`font-bold text-sm sm:text-base ${user.isDemotion ? "text-red-400" : "text-white"}`}>
                  {user.xp} XP
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
