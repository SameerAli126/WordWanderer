import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Zap, Target, Timer } from "lucide-react"

const dailyQuests = [
  {
    id: 1,
    title: "Earn 20 XP",
    progress: 0,
    target: 20,
    icon: Zap,
    iconColor: "bg-yellow-500",
    reward: "🏆",
  },
  {
    id: 2,
    title: "Get 5 in a row correct in 2 lessons",
    progress: 0,
    target: 2,
    icon: Target,
    iconColor: "bg-green-500",
    reward: "🏆",
  },
  {
    id: 3,
    title: "Spend 15 minutes learning",
    progress: 0,
    target: 15,
    icon: Timer,
    iconColor: "bg-blue-500",
    reward: "🏆",
  },
]

export function DailyQuestsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Daily Quests</h2>
        <div className="flex items-center gap-2 text-orange-400">
          <Clock className="w-5 h-5" />
          <span className="font-bold">4 HOURS</span>
        </div>
      </div>

      <div className="space-y-4">
        {dailyQuests.map((quest) => (
          <Card key={quest.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${quest.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <quest.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-3">{quest.title}</h3>
                  <div className="flex items-center gap-3">
                    <Progress value={(quest.progress / quest.target) * 100} className="flex-1 h-2 sm:h-3" />
                    <span className="text-slate-400 text-sm font-medium whitespace-nowrap">
                      {quest.progress} / {quest.target}
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">{quest.reward}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
