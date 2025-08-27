"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Target, BookOpen, Zap, Calendar } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    label: "Weekly XP",
    value: "2,847",
    change: "+23%",
    color: "text-green-400",
    bgColor: "bg-green-500",
  },
  {
    icon: Clock,
    label: "Study Time",
    value: "12h 34m",
    change: "+15%",
    color: "text-blue-400",
    bgColor: "bg-blue-500",
  },
  {
    icon: Target,
    label: "Accuracy",
    value: "94%",
    change: "+5%",
    color: "text-purple-400",
    bgColor: "bg-purple-500",
  },
  {
    icon: BookOpen,
    label: "Lessons",
    value: "47",
    change: "+12%",
    color: "text-orange-400",
    bgColor: "bg-orange-500",
  },
]

const weeklyProgress = [
  { day: "Mon", xp: 420, lessons: 3 },
  { day: "Tue", xp: 380, lessons: 2 },
  { day: "Wed", xp: 510, lessons: 4 },
  { day: "Thu", xp: 290, lessons: 2 },
  { day: "Fri", xp: 450, lessons: 3 },
  { day: "Sat", xp: 380, lessons: 3 },
  { day: "Sun", xp: 417, lessons: 3 },
]

const learningGoals = [
  {
    title: "Daily XP Goal",
    current: 420,
    target: 500,
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    title: "Weekly Lessons",
    current: 18,
    target: 25,
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    title: "Monthly Streak",
    current: 23,
    target: 30,
    icon: Calendar,
    color: "text-orange-400",
  },
]

export function LearningStats() {
  const maxXP = Math.max(...weeklyProgress.map((day) => day.xp))

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                  <div className={`text-xs ${stat.color}`}>{stat.change} this week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-slate-400 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{day.xp} XP</span>
                    <span className="text-slate-400 text-xs">{day.lessons} lessons</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.xp / maxXP) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Learning Goals</h3>
          <div className="space-y-4">
            {learningGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <goal.icon className={`w-4 h-4 ${goal.color}`} />
                    <span className="text-white font-medium">{goal.title}</span>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
