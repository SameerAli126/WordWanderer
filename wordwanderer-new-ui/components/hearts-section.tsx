import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Infinity, Gem } from "lucide-react"
import { apiRequest, BALANCE_EVENT_NAME, emitBalanceUpdate, BalanceUpdate } from "@/lib/api"

const HEART_REFILL_COST = 100

export function HeartsSection() {
  const [hearts, setHearts] = useState(0)
  const [maxHearts, setMaxHearts] = useState(5)
  const [gems, setGems] = useState(0)
  const [nextHeartIn, setNextHeartIn] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefilling, setIsRefilling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBalance = async () => {
    try {
      const response = await apiRequest<{
        user: { hearts?: number; maxHearts?: number; gems?: number; heartRegen?: { nextInSeconds: number } }
      }>("/api/auth/me")
      setHearts(response.user.hearts ?? 0)
      setMaxHearts(response.user.maxHearts ?? 5)
      setGems(response.user.gems ?? 0)
      setNextHeartIn(response.user.heartRegen?.nextInSeconds ?? null)
      setError(null)
    } catch (loadError) {
      console.error("Failed to load balance:", loadError)
      setError(loadError instanceof Error ? loadError.message : "Unable to load balance.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBalance()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<BalanceUpdate>).detail
      if (detail && typeof detail === "object") {
        if (typeof detail.hearts === "number") {
          setHearts(detail.hearts)
        }
        if (typeof detail.maxHearts === "number") {
          setMaxHearts(detail.maxHearts)
        }
        if (typeof detail.gems === "number") {
          setGems(detail.gems)
        }
        return
      }
      void loadBalance()
    }

    window.addEventListener(BALANCE_EVENT_NAME, handler)
    return () => window.removeEventListener(BALANCE_EVENT_NAME, handler)
  }, [])

  const handleRefill = async () => {
    setIsRefilling(true)
    setError(null)
    try {
      const response = await apiRequest<{
        hearts: number
        maxHearts: number
        gems: number
        cost: number
        heartRegen?: { nextInSeconds: number }
      }>(
        "/api/users/hearts/refill",
        {
          method: "POST",
        }
      )
      setHearts(response.hearts)
      setMaxHearts(response.maxHearts)
      setGems(response.gems)
      setNextHeartIn(response.heartRegen?.nextInSeconds ?? null)
      emitBalanceUpdate({ hearts: response.hearts, maxHearts: response.maxHearts, gems: response.gems })
    } catch (refillError) {
      setError(refillError instanceof Error ? refillError.message : "Unable to refill hearts.")
    } finally {
      setIsRefilling(false)
    }
  }

  const heartsFull = hearts >= maxHearts
  const refillDisabled = isLoading || isRefilling || heartsFull || gems < HEART_REFILL_COST

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hearts</h2>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>
            {hearts}/{maxHearts} hearts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-cyan-300" />
          <span>{gems.toLocaleString()} gems</span>
        </div>
        {nextHeartIn && hearts < maxHearts && (
          <span className="text-slate-400">
            Next heart in {Math.ceil(nextHeartIn / 60)} min
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Refill Hearts</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Get full hearts so you can worry less about making mistakes in a lesson.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-200">
                  <Gem className="w-4 h-4 text-cyan-300" />
                  <span>{HEART_REFILL_COST} gems</span>
                </div>
              </div>

              <Button
                variant="secondary"
                className={`px-6 py-2 font-bold text-sm sm:text-base flex-shrink-0 ${
                  refillDisabled ? "bg-slate-700 text-slate-400" : "bg-slate-600 hover:bg-slate-500 text-white"
                }`}
                onClick={handleRefill}
                disabled={refillDisabled}
              >
                {isRefilling ? "REFILLING..." : heartsFull ? "FULL" : "REFILL"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Infinity className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Unlimited Hearts</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Never run out of hearts with Super!
                </p>
              </div>

              <Button
                variant="default"
                className="px-6 py-2 font-bold text-sm sm:text-base flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                FREE TRIAL
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
