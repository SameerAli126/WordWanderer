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
        return "hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm"
      case "wanderer":
        return "hidden lg:block w-64 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-r border-green-400/30 shadow-xl backdrop-blur-sm"
      default:
        return "hidden lg:block w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-600 shadow-xl"
    }
  }

  const getButtonClasses = (isActive: boolean) => {
    if (isActive) {
      switch (theme) {
        case "light":
          return "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white shadow-lg"
        case "wanderer":
          return "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white shadow-lg"
        default:
          return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg"
      }
    } else {
      switch (theme) {
        case "light":
          return "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        case "wanderer":
          return "text-slate-300 hover:text-white hover:bg-green-400/10"
        default:
          return "text-slate-300 hover:text-white hover:bg-slate-700/50"
      }
    }
  }

  const getQuickActionColor = (color: string) => {
    const colors = {
      purple: "hover:border-purple-400 hover:text-purple-400",
      green: "hover:border-green-400 hover:text-green-400",
      blue: "hover:border-blue-400 hover:text-blue-400",
      red: "hover:border-red-400 hover:text-red-400",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getMobileNavClasses = () => {
    switch (theme) {
      case "light":
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 shadow-lg"
      case "wanderer":
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-t border-green-400/30 p-2 z-50 shadow-2xl backdrop-blur-sm"
      default:
        return "lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-600 p-2 z-50 shadow-2xl"
    }
  }

  // Items for mobile bottom nav (first 4 + more dropdown)
  const mobileNavItems = navigationItems.slice(0, 4)
  const moreItems = navigationItems.slice(4) // SHOP, PROFILE, SETTINGS

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={getSidebarClasses()}>
        <div className="p-4 h-full flex flex-col">
          <Tabs defaultValue="nav" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="nav" className="text-xs">
                Navigation
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nav" className="space-y-2 flex-1">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={currentView === item.key ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 transition-all duration-300 hover:scale-105 ${getButtonClasses(
                      currentView === item.key,
                    )}`}
                    onClick={() => handleNavClick(item.key)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </TabsContent>

            <TabsContent value="tools" className="space-y-3 flex-1">
              <div className="space-y-2">
                <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-slate-300"}`}>
                  Quick Actions
                </h3>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(action.path)}
                    className={`w-full justify-start gap-2 border-slate-600 bg-transparent ${getQuickActionColor(action.color)}`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-600">
                <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-slate-300"}`}>
                  Today's Focus
                </h3>
                <div className={`p-3 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-slate-800/50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Daily Goal</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">750 / 1000 XP</p>
                </div>

                <div className={`p-3 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-slate-800/50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Streak</span>
                  </div>
                  <p className="text-lg font-bold text-orange-500">1,058 days</p>
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
              className={`flex flex-col gap-1 h-auto py-2 px-1 transition-all duration-300 hover:scale-110 ${
                currentView === item.key
                  ? theme === "wanderer"
                    ? "text-green-400"
                    : theme === "light"
                      ? "text-green-600"
                      : "text-blue-400"
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

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-auto py-2 px-1 transition-all duration-300 hover:scale-110 ${
                  moreItems.some((item) => currentView === item.key)
                    ? theme === "wanderer"
                      ? "text-green-400"
                      : theme === "light"
                        ? "text-green-600"
                        : "text-blue-400"
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
                    ? "bg-slate-800/95 border-green-400/30 backdrop-blur-sm"
                    : "bg-slate-800 border-slate-700"
              }`}
            >
              {moreItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => handleNavClick(item.key)}
                  className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                    currentView === item.key
                      ? theme === "wanderer"
                        ? "bg-green-400/20 text-green-400"
                        : theme === "light"
                          ? "bg-green-50 text-green-700"
                          : "bg-blue-600 text-white"
                      : theme === "light"
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
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
