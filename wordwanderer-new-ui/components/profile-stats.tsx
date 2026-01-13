import { Card, CardContent } from "@/components/ui/card"
import { Flame, Zap, Target, Trophy } from "lucide-react"

interface ProfileStatsProps {
  stats?: {
    currentStreak: number
    totalXP: number
    totalLessonsCompleted: number
    averageAccuracy: number
  } | null
  isLoading?: boolean
}

const formatNumber = (value?: number) => {
  if (typeof value !== "number") {
    return "--"
  }
  return new Intl.NumberFormat().format(value)
}

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  const blocks = [
    {
      icon: Flame,
      value: isLoading ? "--" : formatNumber(stats?.currentStreak),
      label: "Day streak",
      color: "bg-orange-500",
      textColor: "text-orange-100",
    },
    {
      icon: Zap,
      value: isLoading ? "--" : formatNumber(stats?.totalXP),
      label: "Total XP",
      color: "bg-slate-700",
      textColor: "text-slate-300",
    },
    {
      icon: Trophy,
      value: isLoading ? "--" : formatNumber(stats?.totalLessonsCompleted),
      label: "Lessons cleared",
      color: "bg-emerald-600",
      textColor: "text-emerald-100",
    },
    {
      icon: Target,
      value: isLoading ? "--" : `${Math.round(stats?.averageAccuracy ?? 0)}%`,
      label: "Avg accuracy",
      color: "bg-slate-700",
      textColor: "text-slate-300",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {blocks.map((stat, index) => (
          <Card key={index} className={`${stat.color} border-0`}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-white" />
              <div>
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className={`text-sm ${stat.textColor}`}>{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
