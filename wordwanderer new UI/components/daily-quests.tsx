"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"

interface DailyQuestsProps {
  onViewAll?: () => void
}

export function DailyQuests({ onViewAll }: DailyQuestsProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Daily Quests</h3>
        </div>
        <Button
          variant="link"
          className="text-blue-400 p-0 h-auto hover:text-blue-300 transition-colors"
          onClick={onViewAll}
        >
          VIEW ALL
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-yellow-900" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Earn 10 XP</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={0} className="flex-1 h-2 bg-slate-600" />
              <span className="text-slate-400 text-sm">0 / 10</span>
            </div>
          </div>
          <div
            className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center shadow-md"
            style={{ animation: "bounce 6s ease-in-out infinite" }}
          >
            <div className="text-xs">👤</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-yellow-900" style={{ animation: "pulse 3.5s ease-in-out infinite" }} />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Earn 10 Combo Bonus XP</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
