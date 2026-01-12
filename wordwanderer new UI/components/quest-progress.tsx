import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

export function QuestProgress() {
  return (
    <Card className="rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-sm">
      <CardContent className="p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-14 h-14 bg-emerald-400/10 rounded-full -translate-y-6 translate-x-6 blur-sm animate-pulse"></div>

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm sm:text-base mb-2">Score 80% or higher in 4 lessons</div>
            <div className="flex items-center gap-2">
              <Progress value={0} className="flex-1 h-2 bg-slate-700/70" />
              <span className="text-slate-400 text-xs sm:text-sm whitespace-nowrap">0 / 4</span>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <div className="text-sm">🏆</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
