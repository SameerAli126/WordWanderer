"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const achievements = [
  {
    icon: "🔥",
    title: "Wildfire",
    description: "You reached a 365-day streak",
    color: "bg-orange-500",
    completed: true,
  },
  {
    icon: "🧙",
    title: "Sage",
    description: "You earned 30000 XP",
    color: "bg-orange-500",
    completed: true,
  },
  {
    icon: "🎓",
    title: "Scholar",
    description: "Learn 1500 new words in a single course",
    color: "bg-red-500",
    completed: false,
    progress: 1003,
    total: 1500,
  },
]

interface AchievementsProps {
  onViewAll?: () => void
}

export function Achievements({ onViewAll }: AchievementsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Achievements</h2>
        <Button variant="link" className="text-blue-400 p-0 h-auto" onClick={onViewAll}>
          VIEW ALL
        </Button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`w-12 h-12 ${achievement.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}
              >
                {achievement.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{achievement.title}</h3>
                <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>

                {!achievement.completed && achievement.progress && achievement.total && (
                  <div className="flex items-center gap-2">
                    <Progress value={(achievement.progress / achievement.total) * 100} className="flex-1 h-2" />
                    <span className="text-slate-400 text-sm">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
