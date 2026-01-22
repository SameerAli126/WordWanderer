"use client"

import { useEffect, useState } from "react"
import { LeagueInfo } from "./league-info"
import { DailyQuests } from "./daily-quests"
import { QuestProgress } from "./quest-progress"
import { FooterLinks } from "./footer-links"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronUp, ChevronDown, Trophy, Target, Users, Calendar } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { apiRequest } from "@/lib/api"

interface RightPanelProps {
  onNavigate?: (view: string) => void
}

export function RightPanel({ onNavigate }: RightPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dailyStats, setDailyStats] = useState({
    lessonsCompleted: 0,
    xpEarned: 0,
    timeStudiedSeconds: 0,
  })
  const { theme } = useTheme()

  const getPanelClasses = () => {
    switch (theme) {
      case "light":
        return "w-full lg:w-80 bg-white/95 border-l border-gray-200 shadow-sm"
      case "wanderer":
        return "w-full lg:w-80 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border-l border-emerald-400/20 shadow-2xl backdrop-blur"
      default:
        return "w-full lg:w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-l border-slate-700/60 shadow-2xl"
    }
  }

  const getTabsListClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gray-100 border border-gray-200"
      case "wanderer":
        return "bg-slate-900/60 border border-emerald-400/20"
      default:
        return "bg-slate-900/60 border border-slate-700/60"
    }
  }

  const getTabsTriggerClasses = () => {
    switch (theme) {
      case "light":
        return "text-xs rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
      case "wanderer":
        return "text-xs rounded-full data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-100"
      default:
        return "text-xs rounded-full data-[state=active]:bg-slate-800 data-[state=active]:text-white"
    }
  }

  const getCardClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white border border-gray-200 shadow-sm"
      case "wanderer":
        return "bg-slate-900/40 border border-emerald-400/15 shadow-[0_12px_30px_-25px_rgba(0,0,0,0.8)]"
      default:
        return "bg-slate-900/40 border border-slate-700/60 shadow-[0_12px_30px_-25px_rgba(0,0,0,0.8)]"
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadDailyStats = async () => {
      try {
        const response = await apiRequest<{
          daily: { lessonsCompleted: number; xpEarned: number; timeStudiedSeconds: number }
        }>("/api/progress/daily-stats")
        if (!cancelled) {
          setDailyStats(response.daily)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load daily stats:", error)
        }
      }
    }

    loadDailyStats()

    return () => {
      cancelled = true
    }
  }, [])

  const timeMinutes = Math.round(dailyStats.timeStudiedSeconds / 60)

  return (
    <aside className={`${getPanelClasses()} order-first lg:order-last`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-xs uppercase tracking-[0.25em] ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
              Activity Hub
            </p>
            <h2 className={`font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}>Your Progress</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        <div className={`flex-1 ${isCollapsed ? "hidden lg:block" : ""}`}>
          <Tabs defaultValue="progress" className="h-full">
            <TabsList className={`grid w-full grid-cols-3 mb-4 rounded-full p-1 ${getTabsListClasses()}`}>
              <TabsTrigger value="progress" className={getTabsTriggerClasses()}>
                <Target className="w-3 h-3 mr-1" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="social" className={getTabsTriggerClasses()}>
                <Trophy className="w-3 h-3 mr-1" />
                League
              </TabsTrigger>
              <TabsTrigger value="quests" className={getTabsTriggerClasses()}>
                <Calendar className="w-3 h-3 mr-1" />
                Quests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="transition-all duration-200 hover:translate-y-[-2px]">
                <QuestProgress />
              </div>

              <div className={`p-4 rounded-2xl ${getCardClasses()}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Today's Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>Lessons completed</span>
                    <span className="font-medium">{dailyStats.lessonsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>XP earned</span>
                    <span className="font-medium text-emerald-400">+{dailyStats.xpEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>Time studied</span>
                    <span className="font-medium">{timeMinutes} min</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="transition-all duration-200 hover:translate-y-[-2px]">
                <LeagueInfo onViewLeague={() => onNavigate?.("leaderboards")} />
              </div>

              <div className={`p-4 rounded-2xl ${getCardClasses()}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Friend Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Alex completed a lesson</p>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      M
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Maria reached a 50-day streak!</p>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quests" className="space-y-4">
              <div className="transition-all duration-200 hover:translate-y-[-2px]">
                <DailyQuests onViewAll={() => onNavigate?.("quests")} />
              </div>

              <div
                className={`p-4 rounded-2xl border-2 border-dashed ${
                  theme === "light"
                    ? "border-gray-200 bg-gray-50"
                    : theme === "wanderer"
                      ? "border-emerald-400/20 bg-slate-900/40"
                      : "border-slate-700/60 bg-slate-900/40"
                }`}
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Weekly Challenge
                </h3>
                <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                  Complete 20 lessons this week
                </p>
                <div className="w-full bg-slate-700/60 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400">12 / 20 lessons</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/60">
          <FooterLinks />
        </div>
      </div>
    </aside>
  )
}
