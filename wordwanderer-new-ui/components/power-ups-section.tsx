"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Snowflake, Target, Zap } from "lucide-react"
import { apiRequest, BALANCE_EVENT_NAME, BalanceUpdate, emitBalanceUpdate } from "@/lib/api"

const STREAK_FREEZE_COST = 200
const XP_BOOST_COST = 25
const STREAK_SHIELD_COST = 10
const DOUBLE_OR_NOTHING_COST = 50

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

export function PowerUpsSection() {
  const [gems, setGems] = useState(0)
  const [streakFreezes, setStreakFreezes] = useState(0)
  const [xpBoosts, setXpBoosts] = useState(0)
  const [streakShieldUntil, setStreakShieldUntil] = useState<string | null>(null)
  const [doubleOrNothing, setDoubleOrNothing] = useState<BalanceUpdate["doubleOrNothing"] | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        const response = await apiRequest<{
          user: {
            gems?: number
            streakFreezes?: number
            xpBoosts?: number
            streakShieldUntil?: string | null
            doubleOrNothing?: BalanceUpdate["doubleOrNothing"]
            currentStreak?: number
          }
        }>("/api/auth/me")
        if (!cancelled) {
          setGems(response.user.gems ?? 0)
          setStreakFreezes(response.user.streakFreezes ?? 0)
          setXpBoosts(response.user.xpBoosts ?? 0)
          setStreakShieldUntil(response.user.streakShieldUntil ?? null)
          setDoubleOrNothing(response.user.doubleOrNothing ?? null)
          setCurrentStreak(response.user.currentStreak ?? 0)
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
      if (typeof detail.currentStreak === "number") {
        setCurrentStreak(detail.currentStreak)
      }
      if (typeof detail.xpBoosts === "number") {
        setXpBoosts(detail.xpBoosts)
      }
      if (typeof detail.streakShieldUntil !== "undefined") {
        setStreakShieldUntil(detail.streakShieldUntil ?? null)
      }
      if (typeof detail.doubleOrNothing !== "undefined") {
        setDoubleOrNothing(detail.doubleOrNothing ?? null)
      }
    }

    window.addEventListener(BALANCE_EVENT_NAME, handler)
    return () => window.removeEventListener(BALANCE_EVENT_NAME, handler)
  }, [])

  const streakShieldActive = useMemo(() => {
    if (!streakShieldUntil) {
      return false
    }
    return new Date(streakShieldUntil).getTime() > Date.now()
  }, [streakShieldUntil])

  const streakFreezeStatus = useMemo(() => {
    const canAfford = gems >= STREAK_FREEZE_COST
    return {
      canAfford,
      buttonText: isPurchasing === "streak-freeze" ? "ADDING..." : `BUY ${STREAK_FREEZE_COST} GEMS`,
    }
  }, [gems, isPurchasing])

  const handlePurchase = async (type: string) => {
    if (isPurchasing) {
      return
    }

    setIsPurchasing(type)
    try {
      const response = await apiRequest<{
        gems?: number
        streakFreezes?: number
        xpBoosts?: number
        streakShieldUntil?: string | null
        doubleOrNothing?: BalanceUpdate["doubleOrNothing"]
      }>(
        type === "streak-freeze" ? "/api/users/streak-freeze/purchase" : "/api/users/power-ups/purchase",
        {
          method: "POST",
          ...(type === "streak-freeze"
            ? {}
            : { body: JSON.stringify({ type }) }),
        }
      )
      if (typeof response.streakFreezes === "number") {
        setStreakFreezes(response.streakFreezes)
      }
      if (typeof response.xpBoosts === "number") {
        setXpBoosts(response.xpBoosts)
      }
      if (typeof response.streakShieldUntil !== "undefined") {
        setStreakShieldUntil(response.streakShieldUntil ?? null)
      }
      if (typeof response.doubleOrNothing !== "undefined") {
        setDoubleOrNothing(response.doubleOrNothing ?? null)
      }
      if (typeof response.gems === "number") {
        setGems(response.gems)
      }
      emitBalanceUpdate({
        gems: typeof response.gems === "number" ? response.gems : gems,
        streakFreezes: typeof response.streakFreezes === "number" ? response.streakFreezes : streakFreezes,
        xpBoosts: typeof response.xpBoosts === "number" ? response.xpBoosts : xpBoosts,
        streakShieldUntil:
          typeof response.streakShieldUntil !== "undefined"
            ? response.streakShieldUntil
            : streakShieldUntil,
        doubleOrNothing:
          typeof response.doubleOrNothing !== "undefined"
            ? response.doubleOrNothing
            : doubleOrNothing ?? undefined,
      })
    } catch (error) {
      console.error("Failed to purchase power-up:", error)
    } finally {
      setIsPurchasing(null)
    }
  }

  const doubleOrNothingStatus = useMemo(() => {
    if (!doubleOrNothing?.active) {
      return null
    }
    const target = doubleOrNothing.targetStreak ?? 0
    return `STREAK ${Math.min(currentStreak, target)}/${target || 0}`
  }, [doubleOrNothing, currentStreak])

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
      disabled: !streakFreezeStatus.canAfford || Boolean(isPurchasing),
      onClick: () => handlePurchase("streak-freeze"),
    },
    {
      id: "double-or-nothing",
      title: "Double or Nothing",
      description: doubleOrNothing?.active
        ? "Keep the streak alive for 7 days to double your gems."
        : "Double your gems by maintaining a 7-day streak or lose them all!",
      icon: Zap,
      iconColor: "bg-yellow-500",
      buttonText: doubleOrNothing?.active
        ? "ACTIVE"
        : isPurchasing === "double-or-nothing"
          ? "STARTING..."
          : `START ${DOUBLE_OR_NOTHING_COST} GEMS`,
      buttonVariant: "default" as const,
      equipped: doubleOrNothing?.active
        ? doubleOrNothingStatus
        : doubleOrNothing?.lastResult
          ? `LAST: ${doubleOrNothing.lastResult.toUpperCase()}`
          : null,
      price: DOUBLE_OR_NOTHING_COST,
      disabled: Boolean(isPurchasing) || Boolean(doubleOrNothing?.active) || gems < DOUBLE_OR_NOTHING_COST,
      onClick: () => handlePurchase("double-or-nothing"),
    },
    {
      id: "streak-shield",
      title: "Streak Shield",
      description: "Protect your streak from being broken for 24 hours.",
      icon: Shield,
      iconColor: "bg-blue-500",
      buttonText: isPurchasing === "streak-shield" ? "ACTIVATING..." : `BUY ${STREAK_SHIELD_COST} GEMS`,
      buttonVariant: "default" as const,
      equipped: streakShieldActive ? "ACTIVE" : null,
      price: STREAK_SHIELD_COST,
      disabled: Boolean(isPurchasing) || gems < STREAK_SHIELD_COST,
      onClick: () => handlePurchase("streak-shield"),
    },
    {
      id: "xp-boost",
      title: "XP Boost",
      description: "Double your XP for the next lesson you complete.",
      icon: Target,
      iconColor: "bg-green-500",
      buttonText: isPurchasing === "xp-boost" ? "ADDING..." : `BUY ${XP_BOOST_COST} GEMS`,
      buttonVariant: "default" as const,
      equipped: xpBoosts > 0 ? `${xpBoosts} READY` : null,
      price: XP_BOOST_COST,
      disabled: Boolean(isPurchasing) || gems < XP_BOOST_COST,
      onClick: () => handlePurchase("xp-boost"),
    },
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
