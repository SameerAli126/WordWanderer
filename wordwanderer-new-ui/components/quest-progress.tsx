"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gem, Target, Timer, Zap } from "lucide-react"
import { apiRequest } from "@/lib/api"

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

export function QuestProgress() {
  const [quest, setQuest] = useState<DailyQuest | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadQuest = async () => {
      try {
        const response = await apiRequest<{ quests: DailyQuest[] }>("/api/quests/daily")
        const quests = response.quests ?? []
        const selected =
          quests.find((item) => item.progress < item.target) ||
          quests.sort((a, b) => b.rewardGems - a.rewardGems)[0] ||
          null

        if (!cancelled) {
          setQuest(selected)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load quest progress:", error)
        }
      }
    }

    loadQuest()

    return () => {
      cancelled = true
    }
  }, [])

  const display = useMemo(() => {
    if (!quest) {
      return {
        title: "Loading quest progress...",
        progress: 0,
        target: 1,
        rawProgress: 0,
        Icon: Target,
      }
    }
    const progress = Math.min(quest.progress, quest.target)
    const displayProgress = quest.type === "time" ? Math.round(progress / 60) : progress
    const displayTarget = quest.type === "time" ? Math.round(quest.target / 60) : quest.target
    return {
      title: quest.title,
      progress: displayProgress,
      target: displayTarget,
      rawProgress: progress,
      Icon: iconMap[quest.type],
    }
  }, [quest])

  return (
    <Card className="rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-sm">
      <CardContent className="p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-14 h-14 bg-emerald-400/10 rounded-full -translate-y-6 translate-x-6 blur-sm animate-pulse"></div>

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <display.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm sm:text-base mb-2">{display.title}</div>
            <div className="flex items-center gap-2">
              <Progress
                value={quest ? (display.rawProgress / quest.target) * 100 : 0}
                className="flex-1 h-2 bg-slate-700/70"
              />
              <span className="text-slate-400 text-xs sm:text-sm whitespace-nowrap">
                {display.progress} / {display.target}
              </span>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Gem className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
