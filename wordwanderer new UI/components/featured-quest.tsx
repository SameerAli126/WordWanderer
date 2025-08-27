import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

export function FeaturedQuest() {
  return (
    <Card className="bg-gradient-to-br from-pink-400 to-pink-500 border-0 text-white">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm font-bold mb-4">JUNE</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Zari's Movie Binge</h1>
          <div className="flex items-center gap-2 text-pink-100">
            <Clock className="w-4 h-4" />
            <span className="font-medium">1 DAY</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-3">Complete 25 quests</h3>
              <div className="flex items-center gap-3">
                <Progress value={48} className="flex-1 h-3" />
                <span className="text-pink-400 font-bold text-sm">12 / 25</span>
              </div>
            </div>
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ml-4">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="bg-pink-500 text-white text-xl">Z</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
