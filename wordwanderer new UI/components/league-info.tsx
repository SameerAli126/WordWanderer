"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Crown } from "lucide-react"

interface LeagueInfoProps {
  onViewLeague?: () => void
}

export function LeagueInfo({ onViewLeague }: LeagueInfoProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row justify-between pb-3 items-start">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-red-400" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          <h3 className="font-bold text-white text-base">Ruby League</h3>
        </div>
        <Button
          variant="link"
          className="text-blue-400 p-0 h-auto hover:text-blue-300 transition-colors text-xs"
          onClick={onViewLeague}
        >
          VIEW LEAGUE
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-white text-xl" style={{ animation: "bounce 4s ease-in-out infinite" }}>
              💎
            </div>
          </div>
          <div>
            <div className="text-white font-medium">
              {"You're ranked "}
              <span className="text-orange-400 font-bold" style={{ animation: "pulse 2s ease-in-out infinite" }}>
                #17
              </span>
            </div>
            <div className="text-slate-400 text-sm">You moved down to the demotion zone!</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
