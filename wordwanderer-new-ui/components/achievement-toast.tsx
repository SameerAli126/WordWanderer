"use client"

import { useEffect, useState } from "react"
import { Gem, Sparkles, Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  gemReward?: number
}

interface AchievementToastProps {
  achievement: Achievement | null
  onClose: () => void
}

const iconMap: Record<string, string> = {
  Trophy: "🏆",
  trophy: "🏆",
  Star: "⭐",
  star: "⭐",
  Flame: "🔥",
  flame: "🔥",
  Sparkles: "✨",
  sparkles: "✨",
}

const resolveIcon = (icon?: string) => {
  if (!icon) {
    return "🏅"
  }
  return iconMap[icon] ?? icon
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg shadow-2xl border border-yellow-400/50 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-bounce">
              {resolveIcon(achievement.icon)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4" />
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
            </div>
            <h4 className="font-semibold mb-1">{achievement.title}</h4>
            <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>+{achievement.xpReward} XP</span>
              </div>
              {achievement.gemReward ? (
                <div className="flex items-center gap-1">
                  <Gem className="w-3 h-3" />
                  <span>+{achievement.gemReward} Gems</span>
                </div>
              ) : null}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
