"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Users,
  Trophy,
  Map,
  ShoppingBag,
  User,
  Settings,
  MoreHorizontal,
  Gamepad2,
  BarChart3,
  BookOpen,
  Mic,
  Zap,
  Calendar,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useRouter } from "next/navigation"

interface SidebarProps {
  currentView: "learn" | "leaderboards" | "profile" | "characters" | "quests" | "shop" | "settings"
  onViewChange: (view: "learn" | "leaderboards" | "profile" | "characters" | "quests" | "shop" | "settings") => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { theme } = useTheme()
  const router = useRouter()

  const navigationItems = [
    { icon: Home, label: "LEARN", key: "learn" as const },
    { icon: Users, label: "CHARACTERS", key: "characters" as const },
    { icon: Trophy, label: "LEADERBOARDS", key: "leaderboards" as const },
    { icon: Map, label: "QUESTS", key: "quests" as const },
    { icon: ShoppingBag, label: "SHOP", key: "shop" as const },
    { icon: User, label: "PROFILE", key: "profile" as const },
    { icon: Settings, label: "SETTINGS", key: "settings" as const },
  ]

  const quickActions = [
    { icon: Gamepad2, label: "Games", path: "/games", color: "purple" },
    { icon: BarChart3, label: "Stats", path: "/stats", color: "green" },
    { icon: BookOpen, label: "Words", path: "/vocabulary", color: "blue" },
    { icon: Mic, label: "Voice", path: "/voice", color: "red" },
  ]

  const handleNavClick = (key: string) => {
    if (
      key === "learn" ||
      key === "leaderboards" ||
      key === "profile" ||
      key === "characters" ||
      key === "quests" ||
      key === "shop" ||
      key === "settings"
    ) {
      onViewChange(key)
    }
  }

  const getSidebarClasses = () => {
    switch (theme) {
      case "light":
        return "hidden lg:block w-64 bg-white/95 border-r border-gray-200 shadow-sm"
      case "wanderer":
        return "hidden lg:block w-64 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border-r border-emerald-400/20 shadow-2xl backdrop-blur"
      default:
        return "hidden lg:block w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-slate-700/60 shadow-2xl"
    }
  }

  const getTabsListClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gray-100 border border-gray-200"
      case "wanderer":
        return "bg-slate-900/60 border border-emerald-400/20"
      default:
        return "bg-slate-900/60 border border-slate-700/60"
    }
  }

  const getTabsTriggerClasses = () => {
    switch (theme) {
      case "light":
        return "text-xs rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
      case "wanderer":
        return "text-xs rounded-full data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-100"
      default:
        return "text-xs rounded-full data-[state=active]:bg-slate-800 data-[state=active]:text-white"
    }
  }

  const getButtonClasses = (isActive: boolean) => {
    if (isActive) {
      switch (theme) {
        case "light":
          return "bg-gray-900 text-white shadow-sm"
        case "wanderer":
          return "bg-emerald-500/15 text-emerald-100 border-emerald-400/40 shadow-[0_10px_25px_-20px_rgba(16,185,129,0.9)]"
        default:
          return "bg-slate-800/80 text-white border-slate-600/60 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.9)]"
      }
    }

    switch (theme) {
      case "light":
        return "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      case "wanderer":
        return "text-slate-300 hover:text-white hover:bg-slate-800/60 hover:border-emerald-400/20"
      default:
        return "text-slate-300 hover:text-white hover:bg-slate-800/60 hover:border-slate-600/60"
    }
  }

  const getQuickActionColor = (color: string) => {
    const colors = {
      purple: "hover:border-purple-400 hover:text-purple-300",
      green: "hover:border-emerald-400 hover:text-emerald-300",
      blue: "hover:border-blue-400 hover:text-blue-300",
      red: "hover:border-rose-400 hover:text-rose-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getQuickActionClasses = (color: string) => {
    const base =
      theme === "light"
        ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        : "border-slate-700/60 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60"
    return `${base} ${getQuickActionColor(color)}`
  }

  const getMobileNavClasses = () => {
    switch (theme) {
      case "light":
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 p-2 z-50 shadow-lg"
      case "wanderer":
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 to-slate-950/95 border-t border-emerald-400/20 p-2 z-50 shadow-2xl backdrop-blur"
      default:
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-950 border-t border-slate-700/60 p-2 z-50 shadow-2xl"
    }
  }

  const mobileNavItems = navigationItems.slice(0, 4)
  const moreItems = navigationItems.slice(4)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={getSidebarClasses()}>
        <div className="p-4 h-full flex flex-col">
          <Tabs defaultValue="nav" className="flex-1">
            <TabsList className={`grid w-full grid-cols-2 mb-4 rounded-full p-1 ${getTabsListClasses()}`}>
              <TabsTrigger value="nav" className={getTabsTriggerClasses()}>
                Navigation
              </TabsTrigger>
              <TabsTrigger value="tools" className={getTabsTriggerClasses()}>
                Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nav" className="space-y-2 flex-1">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 border border-transparent ${
                      currentView === item.key ? "" : "hover:translate-x-0.5"
                    } ${getButtonClasses(currentView === item.key)}`}
                    onClick={() => handleNavClick(item.key)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4 flex-1">
              <div className="space-y-2">
                <h3 className={`text-xs uppercase tracking-[0.2em] ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
                  Quick Actions
                </h3>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(action.path)}
                    className={`w-full justify-start gap-2 rounded-lg border ${getQuickActionClasses(action.color)}`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-700/60">
                <h3 className={`text-xs uppercase tracking-[0.2em] ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
                  Today's Focus
                </h3>
                <div
                  className={`p-3 rounded-xl border ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-slate-900/40 border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Daily Goal</span>
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">750 / 1000 XP</p>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-slate-900/40 border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Streak</span>
                  </div>
                  <p className="text-lg font-bold text-orange-400">1,058 days</p>
                  <p className="text-xs text-slate-400">Keep it going! 🔥</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className={getMobileNavClasses()}>
        <div className="flex justify-around">
          {mobileNavItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={`flex flex-col gap-1 h-auto py-2 px-1 transition-all duration-200 hover:scale-105 ${
                currentView === item.key
                  ? theme === "wanderer"
                    ? "text-emerald-300"
                    : theme === "light"
                      ? "text-emerald-600"
                      : "text-blue-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-slate-400"
              }`}
              onClick={() => handleNavClick(item.key)}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label.slice(0, 4)}</span>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-auto py-2 px-1 transition-all duration-200 hover:scale-105 ${
                  moreItems.some((item) => currentView === item.key)
                    ? theme === "wanderer"
                      ? "text-emerald-300"
                      : theme === "light"
                        ? "text-emerald-600"
                        : "text-blue-300"
                    : theme === "light"
                      ? "text-gray-500"
                      : "text-slate-400"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span className="text-xs">MORE</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className={`mb-2 shadow-xl ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : theme === "wanderer"
                    ? "bg-slate-900/95 border-emerald-400/20 backdrop-blur-sm"
                    : "bg-slate-900 border-slate-700"
              }`}
            >
              {moreItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => handleNavClick(item.key)}
                  className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                    currentView === item.key
                      ? theme === "wanderer"
                        ? "bg-emerald-400/20 text-emerald-300"
                        : theme === "light"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-600 text-white"
                      : theme === "light"
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
