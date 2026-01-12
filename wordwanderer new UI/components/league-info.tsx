"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Crown } from "lucide-react"

interface LeagueInfoProps {
  onViewLeague?: () => void
}

export function LeagueInfo({ onViewLeague }: LeagueInfoProps) {
  return (
    <Card className="rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-sm">
      <CardHeader className="flex flex-row justify-between pb-3 items-start">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-white text-base">Ruby League</h3>
        </div>
        <Button
          variant="link"
          className="text-emerald-300 p-0 h-auto hover:text-emerald-200 transition-colors text-xs"
          onClick={onViewLeague}
        >
          VIEW LEAGUE
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
            <div className="text-white text-xl">👑</div>
          </div>
          <div>
            <div className="text-white font-medium">
              {"You're ranked "}
              <span className="text-orange-300 font-bold">#17</span>
            </div>
            <div className="text-slate-400 text-sm">You moved down to the demotion zone.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
