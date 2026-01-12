"use client"

import { FeaturedQuest } from "./featured-quest"
import { DailyQuestsSection } from "./daily-quests-section"
import { MonthlyBadges } from "./monthly-badges"

interface QuestsProps {
  onViewAllBadges?: () => void
}

export function Quests({ onViewAllBadges }: QuestsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-6">
        <FeaturedQuest />
        <DailyQuestsSection />
      </div>
      <MonthlyBadges onViewAll={onViewAllBadges} />
    </div>
  )
}
