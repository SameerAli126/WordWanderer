"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Gem, Target, Timer, Zap } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface DailyQuest {
  id: string
  title: string
  type: "xp" | "lessons" | "time"
  target: number
  rewardGems: number
  progress: number
  completed: boolean
}

interface DailyQuestResponse {
  success: boolean
  resetInSeconds: number
  quests: DailyQuest[]
}

const iconMap = {
  xp: Zap,
  lessons: Target,
  time: Timer,
}

const iconColorMap = {
  xp: "bg-yellow-500",
  lessons: "bg-green-500",
  time: "bg-blue-500",
}

const formatCountdown = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`
}

export function DailyQuestsSection() {
  const [quests, setQuests] = useState<DailyQuest[]>([])
  const [resetInSeconds, setResetInSeconds] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchQuests = async () => {
      try {
        const data = await apiRequest<DailyQuestResponse>("/api/quests/daily")
        if (!cancelled) {
          setQuests(data.quests)
          setResetInSeconds(data.resetInSeconds)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load daily quests.")
        }
      }
    }

    fetchQuests()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (resetInSeconds === null) {
      return
    }

    const timer = setInterval(() => {
      setResetInSeconds((prev) => (prev === null ? prev : Math.max(prev - 60, 0)))
    }, 60000)

    return () => clearInterval(timer)
  }, [resetInSeconds])

  const resetLabel = useMemo(() => {
    if (resetInSeconds === null) {
      return "Loading..."
    }
    return formatCountdown(resetInSeconds)
  }, [resetInSeconds])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Daily Quests</h2>
        <div className="flex items-center gap-2 text-orange-400">
          <Clock className="w-5 h-5" />
          <span className="font-bold">{resetLabel}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {quests.map((quest) => {
          const Icon = iconMap[quest.type]
          const iconColor = iconColorMap[quest.type]
          const progress = Math.min(quest.progress, quest.target)
          const displayProgress = quest.type === "time" ? Math.round(progress / 60) : progress
          const displayTarget = quest.type === "time" ? Math.round(quest.target / 60) : quest.target

          return (
            <Card key={quest.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-white font-bold text-base sm:text-lg">{quest.title}</h3>
                      {quest.completed && (
                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full">
                          Complete
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={(progress / quest.target) * 100} className="flex-1 h-2 sm:h-3" />
                      <span className="text-slate-400 text-sm font-medium whitespace-nowrap">
                        {displayProgress} / {displayTarget}
                      </span>
                    </div>
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <Gem className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">+{quest.rewardGems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
