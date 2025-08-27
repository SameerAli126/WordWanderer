"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, Trophy, CheckCircle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function DailyChallenge() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(2)
  const { theme } = useTheme()

  const challenge = {
    title: "Speed Learner",
    description: "Complete 3 lessons in under 15 minutes",
    reward: 100,
    timeLimit: "15:00",
    currentProgress: progress,
    totalRequired: 3,
  }

  const handleStart = () => {
    // Simulate progress
    if (progress < 3) {
      setProgress((prev) => prev + 1)
      if (progress + 1 >= 3) {
        setIsCompleted(true)
      }
    }
  }

  const getCardClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
      case "wanderer":
        return "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-400/30"
      default:
        return "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30"
    }
  }

  return (
    <Card className={getCardClasses()}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-4 h-4 text-yellow-500" />
          Daily Challenge
          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">{challenge.title}</h3>
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>{challenge.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {challenge.currentProgress} / {challenge.totalRequired}
            </span>
          </div>
          <Progress value={(challenge.currentProgress / challenge.totalRequired) * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{challenge.timeLimit}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Trophy className="w-3 h-3" />
            <span>+{challenge.reward} XP</span>
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={isCompleted}
          className={`w-full ${
            isCompleted
              ? "bg-green-600 hover:bg-green-600"
              : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
          }`}
        >
          {isCompleted ? "Completed! 🎉" : "Start Challenge"}
        </Button>
      </CardContent>
    </Card>
  )
}
