"use client"

import { Button } from "@/components/ui/button"
import { Flame, Gem, Heart, Bell, User, LogOut } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface HeaderProps {
  onProfileClick: () => void
  onStreakClick?: () => void
  onLanguageClick?: () => void
  onNotificationClick?: () => void
  onLogout?: () => void
  language?: {
    code: string
    label: string
    flagCode: string
  }
  stats?: {
    currentStreak?: number
    gems?: number
    hearts?: number
    maxHearts?: number
  }
}

type StatVariant = "streak" | "gems" | "hearts"

export function Header({
  onProfileClick,
  onStreakClick,
  onLanguageClick,
  onNotificationClick,
  onLogout,
  language,
  stats,
}: HeaderProps) {
  const { theme } = useTheme()

  const formatStat = (value?: number) => {
    if (typeof value !== "number") {
      return "--"
    }
    return value.toLocaleString()
  }

  const streakValue = formatStat(stats?.currentStreak)
  const gemsValue = formatStat(stats?.gems)
  const heartsValue = formatStat(stats?.hearts)

  const getHeaderClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white/95 border-b border-gray-200 shadow-sm backdrop-blur"
      case "wanderer":
        return "bg-gradient-to-r from-slate-900/95 via-emerald-950/40 to-slate-900/95 border-b border-emerald-400/20 shadow-lg backdrop-blur"
      default:
        return "bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-b border-slate-700/60 shadow-lg backdrop-blur"
    }
  }

  const getStatClasses = () => {
    const baseClasses =
      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"

    switch (theme) {
      case "light":
        return `${baseClasses} bg-white/80 text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50`
      case "wanderer":
        return `${baseClasses} bg-slate-900/60 text-white border-emerald-400/20 hover:border-emerald-400/40 hover:bg-slate-800/70`
      default:
        return `${baseClasses} bg-slate-900/60 text-white border-slate-700/60 hover:bg-slate-800/70`
    }
  }

  const getStatIconClasses = (variant: StatVariant) => {
    if (theme === "light") {
      switch (variant) {
        case "streak":
          return "bg-orange-100 text-orange-600 border-orange-200"
        case "gems":
          return "bg-cyan-100 text-cyan-600 border-cyan-200"
        case "hearts":
          return "bg-rose-100 text-rose-600 border-rose-200"
        default:
          return "bg-gray-100 text-gray-600 border-gray-200"
      }
    }

    switch (variant) {
      case "streak":
        return "bg-orange-500/15 text-orange-300 border-orange-400/30"
      case "gems":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
      case "hearts":
        return "bg-rose-500/15 text-rose-300 border-rose-400/30"
      default:
        return "bg-slate-700/60 text-slate-200 border-slate-600/60"
    }
  }

  const getActionButtonClasses = () => {
    return theme === "light"
      ? "border-gray-200 text-gray-700 hover:bg-gray-100"
      : "border-slate-700/60 text-slate-200 hover:bg-slate-800/70"
  }

  const activeLanguage = language ?? { code: "zh", flagCode: "cn", label: "Chinese" }

  return (
    <header className={`${getHeaderClasses()} px-5 py-3 sticky top-0 z-40`}>
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/ww.svg" alt="WordWanderer logo" className="h-9 w-auto" />
          <div className={`text-xl sm:text-2xl font-bold ${theme === "light" ? "text-gray-800" : "text-white"}`}>
            WordWanderer
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className={getStatClasses()} onClick={onStreakClick}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${getStatIconClasses("streak")}`}
            >
              <Flame className="w-4 h-4" />
            </span>
            <span className="tabular-nums">{streakValue}</span>
          </div>

          <div className={getStatClasses()}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${getStatIconClasses("gems")}`}>
              <Gem className="w-4 h-4" />
            </span>
            <span className="tabular-nums">{gemsValue}</span>
          </div>

          <div className={getStatClasses()}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${getStatIconClasses("hearts")}`}
            >
              <Heart className="w-4 h-4" />
            </span>
            <span className="tabular-nums">{heartsValue}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageClick}
            className={`hidden sm:flex items-center gap-2 rounded-full border px-3 ${getActionButtonClasses()}`}
          >
            <img
              src={`https://flagcdn.com/w20/${activeLanguage.flagCode}.png`}
              alt={`${activeLanguage.label} flag`}
              className="h-4 w-6 rounded-sm border border-white/10"
            />
            <span className="text-sm font-medium">{activeLanguage.label}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationClick}
            className={`relative rounded-full border ${getActionButtonClasses()}`}
          >
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">2</span>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className={`rounded-full border ${getActionButtonClasses()}`}
          >
            <User className="w-4 h-4" />
          </Button>

          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={`rounded-full border px-3 gap-2 ${getActionButtonClasses()}`}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="sm:hidden flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-700/60">
        <div className="flex items-center gap-2" onClick={onStreakClick}>
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold">{streakValue}</span>
        </div>

        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold">{gemsValue}</span>
        </div>

        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold">{heartsValue}</span>
        </div>
      </div>
    </header>
  )
}
