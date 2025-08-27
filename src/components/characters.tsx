"use client"

import { useState } from "react"
import { CharacterTabs } from "./character-tabs"
import { PinyinSection } from "./pinyin-section"
import { TonesSection } from "./tones-section"
import { InitialsSection } from "./initials-section"
import { HanziSection } from "./hanzi-section"

export function Characters() {
  const [activeTab, setActiveTab] = useState<"pinyin" | "hanzi">("hanzi")

  return (
    <div className="max-w-4xl mx-auto">
      <CharacterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6 space-y-8">
        {activeTab === "pinyin" ? (
          <>
            <PinyinSection />
            <TonesSection />
            <InitialsSection />
          </>
        ) : (
          <HanziSection />
        )}
      </div>
    </div>
  )
}
