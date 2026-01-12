"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const tones = [
  { pinyin: "mā", tone: "1st", description: "high level", color: "bg-yellow-500" },
  { pinyin: "má", tone: "2nd", description: "rising", color: "bg-slate-600" },
  { pinyin: "mǎ", tone: "3rd", description: "falling-rising", color: "bg-slate-600" },
  { pinyin: "mà", tone: "4th", description: "falling", color: "bg-slate-600" },
  { pinyin: "ma", tone: "neutral", description: "neutral", color: "bg-slate-600" },
]

export function TonesSection() {
  const [selectedTone, setSelectedTone] = useState<number>(0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Tones</h2>
        <p className="text-slate-300">Each syllable has one of five tones</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {tones.map((tone, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex flex-col items-center p-4 h-auto rounded-xl border-2 transition-all ${
              selectedTone === index
                ? "border-yellow-400 bg-yellow-500/20"
                : "border-slate-600 bg-slate-800 hover:bg-slate-700"
            }`}
            onClick={() => setSelectedTone(index)}
          >
            <div className="text-2xl font-bold text-white mb-1">{tone.pinyin}</div>
            <div className="text-xs text-slate-400">{tone.tone}</div>
            <div className="text-xs text-slate-500">{tone.description}</div>
            {selectedTone === index && <div className="w-full h-1 bg-yellow-400 rounded-full mt-2"></div>}
          </Button>
        ))}
      </div>
    </div>
  )
}
