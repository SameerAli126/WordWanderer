"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gem, Target, Timer, Zap } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface DailyQuestsProps {
  onViewAll?: () => void
}

interface DailyQuest {
  id: string
  title: string
  type: "xp" | "lessons" | "time"
  target: number
  rewardGems: number
  progress: number
}

const iconMap = {
  xp: Zap,
  lessons: Target,
  time: Timer,
}

export function DailyQuests({ onViewAll }: DailyQuestsProps) {
  const [quests, setQuests] = useState<DailyQuest[]>([])

  useEffect(() => {
    let cancelled = false

    const loadQuests = async () => {
      try {
        const response = await apiRequest<{ quests: DailyQuest[] }>("/api/quests/daily")
        if (!cancelled) {
          setQuests(response.quests ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load daily quests:", error)
        }
      }
    }

    loadQuests()

    return () => {
      cancelled = true
    }
  }, [])

  const displayQuests = quests.slice(0, 2)

  return (
    <Card className="rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Daily Quests</h3>
        </div>
        <Button
          variant="link"
          className="text-emerald-300 p-0 h-auto hover:text-emerald-200 transition-colors"
          onClick={onViewAll}
        >
          VIEW ALL
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayQuests.map((quest) => {
          const Icon = iconMap[quest.type]
          const progress = Math.min(quest.progress, quest.target)
          const displayProgress = quest.type === "time" ? Math.round(progress / 60) : progress
          const displayTarget = quest.type === "time" ? Math.round(quest.target / 60) : quest.target

          return (
            <div key={quest.id} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Icon className="w-4 h-4 text-yellow-950 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{quest.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={(progress / quest.target) * 100} className="flex-1 h-2 bg-slate-700/70" />
                  <span className="text-slate-400 text-sm">
                    {displayProgress} / {displayTarget}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                <Gem className="w-4 h-4 text-white" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
