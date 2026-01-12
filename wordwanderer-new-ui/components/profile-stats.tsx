import { Card, CardContent } from "@/components/ui/card"
import { Flame, Zap, Shield, Trophy } from "lucide-react"

export function ProfileStats() {
  const stats = [
    {
      icon: Flame,
      value: "1058",
      label: "Day streak",
      color: "bg-orange-500",
      textColor: "text-orange-100",
    },
    {
      icon: Zap,
      value: "41212",
      label: "Total XP",
      color: "bg-slate-700",
      textColor: "text-slate-300",
    },
    {
      icon: Shield,
      value: "Ruby",
      label: "Current League",
      color: "bg-red-600",
      textColor: "text-red-100",
    },
    {
      icon: Trophy,
      value: "11",
      label: "Top 3 finishes",
      color: "bg-slate-700",
      textColor: "text-slate-300",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
