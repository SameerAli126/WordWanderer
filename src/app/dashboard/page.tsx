"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/useUserStore"
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
import { ThemeProvider } from "@/contexts/theme-context"
import { useTheme } from "@/contexts/theme-context"

type ViewType = "learn" | "leaderboards" | "profile" | "characters" | "quests" | "shop" | "settings"

function DashboardContent() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth } = useUserStore()
  const [currentView, setCurrentView] = useState<ViewType>("learn")
  const [showStreakFreeze, setShowStreakFreeze] = useState(false)
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false)
  const [showStudyReminder, setShowStudyReminder] = useState(false)
  const [achievement, setAchievement] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setIsLoading(false)
    }
    initAuth()
  }, [checkAuth])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Simulate achievement unlock
  useEffect(() => {
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        if (Math.random() > 0.8) {
          setAchievement({
            id: "daily_login",
            title: "Daily Dedication",
            description: "Logged in today!",
            icon: "🎯",
            xpReward: 25,
          })
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user])

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    router.push(`/dashboard?view=${view}`)
  }

  const handleNavigate = (view: string) => {
    if (view === "leaderboards" || view === "quests") {
      handleViewChange(view as ViewType)
    }
  }

  const handleLanguageChange = (language: string) => {
    console.log(`Switching to language: ${language}`)
    // Here you would implement language switching logic
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-blue-900/20 flex items-center justify-center">
        <div className="text-white text-xl">Loading WordWanderer...</div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className={getMainClasses()}>
      <Header
        onProfileClick={() => handleViewChange("profile")}
        onStreakClick={() => setShowStreakFreeze(true)}
        onLanguageClick={() => setShowLanguageSwitcher(true)}
        onNotificationClick={() => setShowStudyReminder(true)}
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
        currentStreak={user.currentStreak || 0}
        gems={user.gems || 0}
      />

      <LanguageSwitcher
        isOpen={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
      />

      <StudyReminder isOpen={showStudyReminder} onClose={() => setShowStudyReminder(false)} />

      {/* Achievement Toast */}
      <AchievementToast achievement={achievement} onClose={() => setAchievement(null)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}
