"use client"

import { useState } from "react"
import { LeagueInfo } from "./league-info"
import { DailyQuests } from "./daily-quests"
import { QuestProgress } from "./quest-progress"
import { FooterLinks } from "./footer-links"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronUp, ChevronDown, Trophy, Target, Users, Calendar } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface RightPanelProps {
  onNavigate?: (view: string) => void
}

export function RightPanel({ onNavigate }: RightPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme } = useTheme()

  const getPanelClasses = () => {
    switch (theme) {
      case "light":
        return "w-full lg:w-80 bg-white border-l border-gray-200 shadow-sm"
      case "wanderer":
        return "w-full lg:w-80 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-l border-green-400/30 shadow-xl backdrop-blur-sm"
      default:
        return "w-full lg:w-80 bg-gradient-to-b from-slate-800 to-slate-900 border-l border-slate-600 shadow-xl"
    }
  }

  return (
    <aside className={`${getPanelClasses()} order-first lg:order-last`}>
      <div className="p-4 h-full flex flex-col">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold ${theme === "light" ? "text-gray-800" : "text-white"}`}>Activity Hub</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        {/* Content */}
        <div className={`flex-1 ${isCollapsed ? "hidden lg:block" : ""}`}>
          <Tabs defaultValue="progress" className="h-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="progress" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                League
              </TabsTrigger>
              <TabsTrigger value="quests" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Quests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="transform hover:scale-105 transition-all duration-300">
                <QuestProgress />
              </div>

              {/* Today's Summary */}
              <div className={`p-4 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-slate-800/50"}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Today's Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>Lessons completed</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>XP earned</span>
                    <span className="font-medium text-green-500">+750</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>Time studied</span>
                    <span className="font-medium">25 min</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="transform hover:scale-105 transition-all duration-300">
                <LeagueInfo onViewLeague={() => onNavigate?.("leaderboards")} />
              </div>

              {/* Friend Activity */}
              <div className={`p-4 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-slate-800/50"}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Friend Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
              <div className="transform hover:scale-105 transition-all duration-300">
                <DailyQuests onViewAll={() => onNavigate?.("quests")} />
              </div>

              {/* Weekly Challenge */}
              <div
                className={`p-4 rounded-lg border-2 border-dashed ${theme === "light" ? "border-gray-300 bg-gray-50" : "border-slate-600 bg-slate-800/50"}`}
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Weekly Challenge
                </h3>
                <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                  Complete 20 lessons this week
                </p>
                <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
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

        {/* Footer Links - Always at bottom */}
        <div className="mt-4 pt-4 border-t border-slate-600">
          <FooterLinks />
        </div>
      </div>
    </aside>
  )
}
