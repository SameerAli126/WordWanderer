"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Gem, Heart, Globe, Bell, User } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface HeaderProps {
  onProfileClick: () => void
  onStreakClick?: () => void
  onLanguageClick?: () => void
  onNotificationClick?: () => void
}

export function Header({ onProfileClick, onStreakClick, onLanguageClick, onNotificationClick }: HeaderProps) {
  const { theme } = useTheme()

  const getHeaderClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white border-b border-gray-200 shadow-sm"
      case "wanderer":
        return "bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-b border-green-400/30 shadow-xl backdrop-blur-sm"
      default:
        return "bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-600 shadow-xl"
    }
  }

  const getStatClasses = (color: string) => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"

    switch (theme) {
      case "light":
        return `${baseClasses} bg-gray-50 hover:bg-gray-100 text-gray-700`
      case "wanderer":
        return `${baseClasses} bg-slate-800/50 hover:bg-slate-700/50 text-white border border-green-400/20`
      default:
        return `${baseClasses} bg-slate-800/50 hover:bg-slate-700/50 text-white`
    }
  }

  return (
    <header className={`${getHeaderClasses()} p-4 sticky top-0 z-40`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-bold ${theme === "light" ? "text-gray-800" : "text-white"}`}>WordWanderer</div>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className={getStatClasses("orange")} onClick={onStreakClick}>
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">1,058</span>
          </div>

          <div className={getStatClasses("blue")}>
            <Gem className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">10,866</span>
          </div>

          <div className={getStatClasses("red")}>
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold">5</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageClick}
            className={`hidden sm:flex ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}
          >
            <Globe className="w-4 h-4" />
            <span className="ml-2">🇨🇳</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationClick}
            className={`relative ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}
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
            className={`${theme === "light" ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="sm:hidden flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-600">
        <div className="flex items-center gap-2" onClick={onStreakClick}>
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold">1,058</span>
        </div>

        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold">10,866</span>
        </div>

        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold">5</span>
        </div>
      </div>
    </header>
  )
}
