"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Snowflake, Target, Zap } from "lucide-react"
import { apiRequest, BALANCE_EVENT_NAME, BalanceUpdate, emitBalanceUpdate } from "@/lib/api"

const STREAK_FREEZE_COST = 200

type PowerUpItem = {
  id: string
  title: string
  description: string
  icon: typeof Snowflake
  iconColor: string
  buttonText: string
  buttonVariant: "default" | "secondary"
  equipped: string | null
  price: number
  disabled: boolean
  onClick?: () => void
}

const staticPowerUps = [
  {
    id: "double-or-nothing",
    title: "Double or Nothing",
    description: "Double your gems by maintaining a 7-day streak or lose them all!",
    icon: Zap,
    iconColor: "bg-yellow-500",
    price: 50,
  },
  {
    id: "streak-shield",
    title: "Streak Shield",
    description: "Protect your streak from being broken for 24 hours.",
    icon: Shield,
    iconColor: "bg-blue-500",
    price: 10,
  },
  {
    id: "xp-boost",
    title: "XP Boost",
    description: "Double your XP for the next lesson you complete.",
    icon: Target,
    iconColor: "bg-green-500",
    price: 25,
  },
]

export function PowerUpsSection() {
  const [gems, setGems] = useState(0)
  const [streakFreezes, setStreakFreezes] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        const response = await apiRequest<{ user: { gems?: number; streakFreezes?: number } }>("/api/auth/me")
        if (!cancelled) {
          setGems(response.user.gems ?? 0)
          setStreakFreezes(response.user.streakFreezes ?? 0)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load power-ups info:", error)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<BalanceUpdate>).detail
      if (!detail) {
        return
      }
      if (typeof detail.gems === "number") {
        setGems(detail.gems)
      }
      if (typeof detail.streakFreezes === "number") {
        setStreakFreezes(detail.streakFreezes)
      }
    }

    window.addEventListener(BALANCE_EVENT_NAME, handler)
    return () => window.removeEventListener(BALANCE_EVENT_NAME, handler)
  }, [])

  const streakFreezeStatus = useMemo(() => {
    const canAfford = gems >= STREAK_FREEZE_COST
    return {
      canAfford,
      buttonText: isPurchasing ? "ADDING..." : `BUY ${STREAK_FREEZE_COST} GEMS`,
    }
  }, [gems, isPurchasing])

  const handlePurchaseStreakFreeze = async () => {
    if (isPurchasing || !streakFreezeStatus.canAfford) {
      return
    }

    setIsPurchasing(true)
    try {
      const response = await apiRequest<{ streakFreezes: number; gems: number }>("/api/users/streak-freeze/purchase", {
        method: "POST",
      })
      setStreakFreezes(response.streakFreezes)
      setGems(response.gems)
      emitBalanceUpdate({ gems: response.gems })
    } catch (error) {
      console.error("Failed to purchase streak freeze:", error)
    } finally {
      setIsPurchasing(false)
    }
  }

  const powerUpItems = [
    {
      id: "streak-freeze",
      title: "Streak Freeze",
      description: "Keep your streak safe for a full day of inactivity.",
      icon: Snowflake,
      iconColor: "bg-cyan-500",
      buttonText: streakFreezeStatus.buttonText,
      buttonVariant: "default" as const,
      equipped: streakFreezes > 0 ? `${streakFreezes} AVAILABLE` : null,
      price: STREAK_FREEZE_COST,
      disabled: !streakFreezeStatus.canAfford || isPurchasing,
      onClick: handlePurchaseStreakFreeze,
    },
    ...staticPowerUps.map((item) => ({
      ...item,
      buttonText: `${item.price} GEMS`,
      buttonVariant: "default" as const,
      equipped: null,
      disabled: true,
      onClick: undefined,
    })),
  ] satisfies PowerUpItem[]

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Power-Ups</h2>

      <div className="space-y-4">
        {powerUpItems.map((item) => (
          <Card key={item.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${item.iconColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg sm:text-xl">{item.title}</h3>
                    {item.equipped && (
                      <span className="text-cyan-400 text-xs sm:text-sm font-medium bg-cyan-500/20 px-2 py-1 rounded-full">
                        {item.equipped}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>

                <Button
                  variant={item.buttonVariant}
                  disabled={item.disabled}
                  className={`px-4 sm:px-6 py-2 font-bold text-sm sm:text-base flex-shrink-0 ${
                    item.disabled
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : item.buttonVariant === "default"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-600 hover:bg-slate-500 text-white"
                  }`}
                  onClick={item.onClick}
                >
                  {item.buttonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
