"use client"

import { useEffect, useState } from "react"
import { ProfileHeader } from "./profile-header"
import { ProfileStats } from "./profile-stats"
import { FriendSuggestions } from "./friend-suggestions"
import { Achievements } from "./achievements"
import { ProfileSidebar } from "./profile-sidebar"
import { apiRequest } from "@/lib/api"

interface ProfileProps {
  onViewAllFriends?: () => void
  onViewAllAchievements?: () => void
  onLogout?: () => void
}

interface UserProfile {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string | null
  totalXP: number
  currentStreak: number
  longestStreak: number
  joinedAt?: string
}

interface ProfileResponse {
  success: boolean
  user: UserProfile
}

interface ProgressStats {
  totalXP: number
  currentStreak: number
  longestStreak: number
  totalLessonsCompleted: number
  averageAccuracy: number
}

interface ProgressResponse {
  success: boolean
  stats: ProgressStats
}

export function Profile({ onViewAllFriends, onViewAllAchievements, onLogout }: ProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [userResponse, statsResponse] = await Promise.all([
          apiRequest<ProfileResponse>("/api/auth/me"),
          apiRequest<ProgressResponse>("/api/progress/stats"),
        ])

        if (!cancelled) {
          setUser(userResponse.user)
          setStats(statsResponse.stats)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load profile.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-6">
        <ProfileHeader user={user} isLoading={isLoading} onLogout={onLogout} />
        <ProfileStats stats={stats} isLoading={isLoading} />
        {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}
        <FriendSuggestions onViewAll={onViewAllFriends} />
        <Achievements onViewAll={onViewAllAchievements} />
      </div>
      <ProfileSidebar />
    </div>
  )
}
