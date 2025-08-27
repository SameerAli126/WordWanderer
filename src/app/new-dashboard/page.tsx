"use client"

import { useState } from "react"
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
  const [currentView, setCurrentView] = useState<ViewType>("learn")
  const [showStreakFreeze, setShowStreakFreeze] = useState(false)
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false)
  const [showStudyReminder, setShowStudyReminder] = useState(false)
  const [achievement, setAchievement] = useState<any>(null)
  const { theme } = useTheme()

  // Mock user data for demo
  const mockUser = {
    displayName: "Demo User",
    currentStreak: 5,
    gems: 150,
    totalXP: 1250,
    level: 8
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  const handleNavigate = (view: string) => {
    if (view === "leaderboards" || view === "quests") {
      handleViewChange(view as ViewType)
    }
  }

  const handleLanguageChange = (language: string) => {
    console.log(`Switching to language: ${language}`)
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
            onViewAllFriends={() => console.log("View all friends")}
            onViewAllAchievements={() => console.log("View all achievements")}
          />
        )
      case "characters":
        return <Characters />
      case "quests":
        return <Quests onViewAllBadges={() => console.log("View all badges")} />
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
        currentStreak={mockUser.currentStreak}
        gems={mockUser.gems}
      />

      <LanguageSwitcher
        isOpen={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
      />

      <StudyReminder isOpen={showStudyReminder} onClose={() => setShowStudyReminder(false)} />

      {/* Achievement Toast */}
      <AchievementToast achievement={achievement} onClose={() => setAchievement(null)} />

      {/* Demo Notice */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
        🎯 New UI Demo - WordWanderer Dashboard
      </div>
    </div>
  )
}

export default function NewDashboardPage() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}
