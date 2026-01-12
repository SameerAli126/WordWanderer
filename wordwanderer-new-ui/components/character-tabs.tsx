"use client"
import { Button } from "@/components/ui/button"

interface CharacterTabsProps {
  activeTab: "pinyin" | "hanzi"
  onTabChange: (tab: "pinyin" | "hanzi") => void
}

export function CharacterTabs({ activeTab, onTabChange }: CharacterTabsProps) {
  return (
    <div className="flex justify-center">
      <div className="flex bg-slate-800 rounded-lg p-1">
        <Button
          variant={activeTab === "pinyin" ? "default" : "ghost"}
          className={`px-8 py-2 ${
            activeTab === "pinyin" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          onClick={() => onTabChange("pinyin")}
        >
          PINYIN
        </Button>
        <Button
          variant={activeTab === "hanzi" ? "default" : "ghost"}
          className={`px-8 py-2 ${
            activeTab === "hanzi" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
          onClick={() => onTabChange("hanzi")}
        >
          HANZI
        </Button>
      </div>
    </div>
  )
}
