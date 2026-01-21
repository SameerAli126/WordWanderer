"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface AchievementItem {
  id: string
  title: string
  description: string
  icon?: string
  category?: string
  rarity?: string
  xpReward?: number
  gemReward?: number
  unlockedAt?: string | null
  progress?: number
  maxProgress?: number
}

interface ProfileResponse {
  success: boolean
  user: {
    achievements?: AchievementItem[]
  }
}

const iconMap: Record<string, string> = {
  Trophy: "🏆",
  trophy: "🏆",
  Star: "⭐",
  star: "⭐",
  Flame: "🔥",
  flame: "🔥",
  Sparkles: "✨",
  sparkles: "✨",
}

const resolveIcon = (icon?: string) => {
  if (!icon) {
    return "🏅"
  }
  return iconMap[icon] ?? icon
}

export default function AllAchievementsPage() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAchievements = async () => {
      try {
        const data = await apiRequest<ProfileResponse>("/api/auth/me")
        if (!cancelled) {
          setAchievements(data.user.achievements ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load achievements.")
        }
      }
    }

    fetchAchievements()

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const unique = new Set<string>()
    achievements.forEach((item) => {
      if (item.category) {
        unique.add(item.category)
      }
    })
    return ["All", ...Array.from(unique)]
  }, [achievements])

  const filteredAchievements =
    selectedCategory === "All"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">All Achievements</h1>
      </div>

      {categories.length > 1 && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap border-slate-600 hover:border-slate-500 bg-transparent"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 mb-4">
            {error}
          </div>
        )}

        {filteredAchievements.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-slate-300 text-sm">
              No achievements unlocked yet. Complete lessons to start earning them.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => {
              const completed = Boolean(achievement.unlockedAt)
              const progress = achievement.progress ?? 0
              const maxProgress = achievement.maxProgress ?? 0

              return (
                <Card key={achievement.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${
                          !completed ? "opacity-60" : ""
                        }`}
                      >
                        {resolveIcon(achievement.icon)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
                          {completed && <Star className="w-5 h-5 text-yellow-400" />}
                        </div>

                        <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>
                        {(achievement.xpReward || achievement.gemReward) && (
                          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                            {achievement.xpReward ? <span>+{achievement.xpReward} XP</span> : null}
                            {achievement.gemReward ? <span>+{achievement.gemReward} Gems</span> : null}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {achievement.category && (
                            <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                              {achievement.category}
                            </span>
                          )}
                          {completed && (
                            <span className="text-xs bg-green-600 px-2 py-1 rounded-full text-white">Completed</span>
                          )}
                        </div>

                        {!completed && maxProgress > 1 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white font-medium">
                                {progress}/{maxProgress}
                              </span>
                            </div>
                            <Progress value={(progress / maxProgress) * 100} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
