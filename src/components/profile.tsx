"use client"

import { ProfileHeader } from "./profile-header"
import { ProfileStats } from "./profile-stats"
import { FriendSuggestions } from "./friend-suggestions"
import { Achievements } from "./achievements"
import { ProfileSidebar } from "./profile-sidebar"

interface ProfileProps {
  onViewAllFriends?: () => void
  onViewAllAchievements?: () => void
}

export function Profile({ onViewAllFriends, onViewAllAchievements }: ProfileProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-6">
        <ProfileHeader />
        <ProfileStats />
        <FriendSuggestions onViewAll={onViewAllFriends} />
        <Achievements onViewAll={onViewAllAchievements} />
      </div>
      <ProfileSidebar />
    </div>
  )
}
