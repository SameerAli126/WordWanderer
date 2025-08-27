"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star } from "lucide-react"

const allAchievements = [
  {
    icon: "🔥",
    title: "Wildfire",
    description: "You reached a 365-day streak",
    color: "bg-orange-500",
    completed: true,
    category: "Streaks",
  },
  {
    icon: "🧙",
    title: "Sage",
    description: "You earned 30000 XP",
    color: "bg-orange-500",
    completed: true,
    category: "XP",
  },
  {
    icon: "🎓",
    title: "Scholar",
    description: "Learn 1500 new words in a single course",
    color: "bg-red-500",
    completed: false,
    progress: 1003,
    total: 1500,
    category: "Learning",
  },
  {
    icon: "⚡",
    title: "Lightning Round",
    description: "Complete 10 lessons in one day",
    color: "bg-yellow-500",
    completed: false,
    progress: 3,
    total: 10,
    category: "Daily",
  },
  {
    icon: "🏆",
    title: "Champion",
    description: "Finish #1 in a league",
    color: "bg-yellow-600",
    completed: false,
    progress: 0,
    total: 1,
    category: "Leagues",
  },
  {
    icon: "🎯",
    title: "Perfectionist",
    description: "Get 100% accuracy in 5 lessons",
    color: "bg-green-500",
    completed: true,
    category: "Accuracy",
  },
  {
    icon: "🌟",
    title: "Rising Star",
    description: "Earn 1000 XP in a week",
    color: "bg-blue-500",
    completed: false,
    progress: 650,
    total: 1000,
    category: "XP",
  },
  {
    icon: "🔮",
    title: "Fortune Teller",
    description: "Use prediction feature 50 times",
    color: "bg-purple-500",
    completed: false,
    progress: 23,
    total: 50,
    category: "Features",
  },
]

const categories = ["All", "Streaks", "XP", "Learning", "Daily", "Leagues", "Accuracy", "Features"]

export default function AllAchievementsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">All Achievements</h1>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="whitespace-nowrap border-slate-600 hover:border-slate-500 bg-transparent"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAchievements.map((achievement, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 ${achievement.color} rounded-lg flex items-center justify-center text-3xl flex-shrink-0 ${
                      !achievement.completed ? "opacity-50" : ""
                    }`}
                  >
                    {achievement.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
                      {achievement.completed && <Star className="w-5 h-5 text-yellow-400" />}
                    </div>

                    <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                        {achievement.category}
                      </span>
                      {achievement.completed && (
                        <span className="text-xs bg-green-600 px-2 py-1 rounded-full text-white">Completed</span>
                      )}
                    </div>

                    {!achievement.completed && achievement.progress !== undefined && achievement.total && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-medium">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
