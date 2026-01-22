"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, Sparkles, Star, Trophy } from "lucide-react"

export interface AchievementItem {
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

interface AchievementsProps {
  achievements?: AchievementItem[]
  onViewAll?: () => void
}

const rarityStyles: Record<string, string> = {
  common: "bg-slate-600",
  rare: "bg-blue-600",
  epic: "bg-purple-600",
  legendary: "bg-yellow-500",
}

const iconMap: Record<string, typeof Trophy> = {
  Trophy,
  trophy: Trophy,
  Star,
  star: Star,
  Flame,
  flame: Flame,
  Sparkles,
  sparkles: Sparkles,
}

export function Achievements({ achievements = [], onViewAll }: AchievementsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Achievements</h2>
        <Button variant="link" className="text-blue-400 p-0 h-auto" onClick={onViewAll}>
          VIEW ALL
        </Button>
      </div>

      {achievements.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-slate-300 text-sm">
            Complete lessons to unlock your first achievement.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const completed = Boolean(achievement.unlockedAt)
            const progress = achievement.progress ?? 0
            const maxProgress = achievement.maxProgress ?? 0
            const showProgress = !completed && maxProgress > 1
            const colorClass = rarityStyles[achievement.rarity ?? "common"] ?? "bg-slate-600"
            const Icon = iconMap[achievement.icon ?? ""] ?? Trophy

            return (
              <Card key={achievement.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{achievement.title}</h3>
                    <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>
                    {(achievement.xpReward || achievement.gemReward) && (
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        {achievement.xpReward ? <span>+{achievement.xpReward} XP</span> : null}
                        {achievement.gemReward ? <span>+{achievement.gemReward} Gems</span> : null}
                      </div>
                    )}

                    {showProgress && (
                      <div className="flex items-center gap-2">
                        <Progress value={(progress / maxProgress) * 100} className="flex-1 h-2" />
                        <span className="text-slate-400 text-sm">
                          {progress}/{maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
