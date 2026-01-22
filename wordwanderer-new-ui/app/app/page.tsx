"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { LessonPath } from "@/components/lesson-path"
import { RightPanel } from "@/components/right-panel"
import { Leaderboard } from "@/components/leaderboard"
import { StatusSelector } from "@/components/status-selector"
import { Profile } from "@/components/profile"
import { Characters } from "@/components/characters"
import { Quests } from "@/components/quests"
import { Shop } from "@/components/shop"
import { Settings } from "@/components/settings"
import { StreakFreezeModal } from "@/components/streak-freeze-modal"
import { AchievementToast } from "@/components/achievement-toast"
import { LanguageSwitcher } from "@/components/language-switcher"
import { StudyReminder } from "@/components/study-reminder"
import { useTheme } from "@/contexts/theme-context"
import { apiRequest, clearStoredToken, BALANCE_EVENT_NAME, BalanceUpdate } from "@/lib/api"

type ViewType = "learn" | "leaderboards" | "profile" | "characters" | "quests" | "shop" | "settings"

const LANGUAGE_OPTIONS = [
  { code: "zh", label: "Chinese", flagCode: "cn", progress: 75, isUnlocked: true },
  { code: "es", label: "Spanish", flagCode: "es", progress: 45, isUnlocked: true },
  { code: "fr", label: "French", flagCode: "fr", progress: 20, isUnlocked: true },
  { code: "de", label: "German", flagCode: "de", progress: 0, isUnlocked: false },
  { code: "ja", label: "Japanese", flagCode: "jp", progress: 0, isUnlocked: false },
  { code: "ko", label: "Korean", flagCode: "kr", progress: 0, isUnlocked: false },
]

export default function DuolingoApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<ViewType>("learn")
  const [showStreakFreeze, setShowStreakFreeze] = useState(false)
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false)
  const [showStudyReminder, setShowStudyReminder] = useState(false)
  const [achievement, setAchievement] = useState<any>(null)
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    gems: 0,
    hearts: 0,
    maxHearts: 5,
  })
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGE_OPTIONS[0])
  const { theme } = useTheme()

  useEffect(() => {
    const view = searchParams.get("view") as ViewType
    if (view && ["learn", "leaderboards", "profile", "characters", "quests", "shop", "settings"].includes(view)) {
      setCurrentView(view)
    }
  }, [searchParams])

  const loadUserStats = async () => {
    try {
      const response = await apiRequest<{
        user: {
          currentStreak: number
          gems: number
          hearts: number
          maxHearts?: number
          preferences?: { language?: string }
        }
      }>("/api/auth/me")
      setUserStats({
        currentStreak: response.user.currentStreak ?? 0,
        gems: response.user.gems ?? 0,
        hearts: response.user.hearts ?? 0,
        maxHearts: response.user.maxHearts ?? 5,
      })
      const preferredLanguage = response.user.preferences?.language
      if (preferredLanguage) {
        const matched = LANGUAGE_OPTIONS.find((item) => item.code === preferredLanguage)
        if (matched) {
          setActiveLanguage(matched)
        }
      }
    } catch (error) {
      const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined
      if (status === 401) {
        clearStoredToken()
        router.push("/login")
      } else {
        console.error("Failed to load user stats:", error)
      }
    }
  }

  useEffect(() => {
    void loadUserStats()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<BalanceUpdate>).detail
      if (detail && typeof detail === "object") {
        setUserStats((prev) => ({
          ...prev,
          ...detail,
        }))
        return
      }
      void loadUserStats()
    }

    window.addEventListener(BALANCE_EVENT_NAME, handler)
    return () => window.removeEventListener(BALANCE_EVENT_NAME, handler)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const stored = window.sessionStorage.getItem("ww-last-achievement")
    if (!stored) {
      return
    }
    try {
      const parsed = JSON.parse(stored)
      setAchievement(parsed)
    } catch (error) {
      console.error("Failed to parse achievement:", error)
    }
    window.sessionStorage.removeItem("ww-last-achievement")
  }, [])

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    router.push(`/app?view=${view}`)
  }

  const handleNavigate = (view: string) => {
    if (view === "leaderboards" || view === "quests") {
      handleViewChange(view as ViewType)
    }
  }

  const handleLanguageChange = async (language: string) => {
    const nextLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language)
    if (nextLanguage) {
      setActiveLanguage(nextLanguage)
    }
    try {
      await apiRequest("/api/users/preferences", {
        method: "PUT",
        body: JSON.stringify({ language }),
      })
    } catch (error) {
      console.error("Failed to update language preference:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      clearStoredToken()
      router.push("/login")
    }
  }

  const getMainClasses = () => {
    switch (theme) {
      case "light":
        return "min-h-screen bg-gray-50 text-gray-900"
      case "wanderer":
        return "min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-blue-900/20 text-white"
      default:
        return "min-h-screen bg-slate-900 text-white"
    }
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "learn":
        return <LessonPath />
      case "leaderboards":
        return <Leaderboard />
      case "profile":
        return (
          <Profile
            onViewAllFriends={() => router.push("/all-friends")}
            onViewAllAchievements={() => router.push("/all-achievements")}
            onLogout={handleLogout}
          />
        )
      case "characters":
        return <Characters />
      case "quests":
        return <Quests onViewAllBadges={() => router.push("/all-badges")} />
      case "shop":
        return <Shop />
      case "settings":
        return <Settings />
      default:
        return <LessonPath />
    }
  }

  const renderSidebar = () => {
    if (currentView === "learn" || currentView === "characters") {
      return <RightPanel onNavigate={handleNavigate} />
    }
    if (currentView === "leaderboards") {
      return (
        <aside className="w-full lg:w-80 p-3 sm:p-4">
          <StatusSelector />
        </aside>
      )
    }
    return null
  }

  return (
    <div className={getMainClasses()}>
      <Header
        onProfileClick={() => handleViewChange("profile")}
        onStreakClick={() => setShowStreakFreeze(true)}
        onLanguageClick={() => setShowLanguageSwitcher(true)}
        onNotificationClick={() => setShowStudyReminder(true)}
        onLogout={handleLogout}
        language={activeLanguage}
        stats={userStats}
      />
      <div className="flex flex-col lg:flex-row">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        <main className="flex-1 p-3 sm:p-6 min-h-0">{renderMainContent()}</main>
        {renderSidebar()}
      </div>

      {/* Modals */}
      <StreakFreezeModal
        isOpen={showStreakFreeze}
        onClose={() => setShowStreakFreeze(false)}
        currentStreak={userStats.currentStreak}
        gems={userStats.gems}
      />

      <LanguageSwitcher
        isOpen={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
        activeLanguageCode={activeLanguage.code}
        languages={LANGUAGE_OPTIONS}
      />

      <StudyReminder isOpen={showStudyReminder} onClose={() => setShowStudyReminder(false)} />

      {/* Achievement Toast */}
      <AchievementToast achievement={achievement} onClose={() => setAchievement(null)} />
    </div>
  )
}
