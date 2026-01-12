import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function AdBlockerNotice() {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-700 border-0">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Using an ad blocker?</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Support education with Super Duolingo and we'll remove ads for you
            </p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <div className="text-xl sm:text-2xl">🦉</div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Button className="w-full bg-white text-slate-900 hover:bg-gray-100 font-bold py-2 sm:py-3 text-sm sm:text-base">
            TRY SUPER FOR FREE
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10 text-sm sm:text-base bg-transparent"
          >
            DISABLE AD BLOCKER
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
