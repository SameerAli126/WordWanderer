"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const initials = [
  ["b", "p", "m", "f"],
  ["d", "t", "n", "l"],
  ["g", "k", "h", ""],
  ["j", "q", "x", ""],
  ["z", "c", "s", ""],
  ["zh", "ch", "sh", "r"],
]

export function InitialsSection() {
  const [selectedInitials, setSelectedInitials] = useState<string[]>(["m", "d", "t"])

  const toggleInitial = (initial: string) => {
    if (!initial) return

    setSelectedInitials((prev) => (prev.includes(initial) ? prev.filter((i) => i !== initial) : [...prev, initial]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Initials</h2>
        <p className="text-slate-300">Sounds that go at the beginning of a syllable</p>
      </div>

      <div className="space-y-3">
        {initials.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3">
            {row.map((initial, colIndex) => (
              <div key={colIndex} className="w-16 h-16">
                {initial && (
                  <Button
                    variant="ghost"
                    className={`w-full h-full rounded-xl border-2 text-lg font-bold transition-all ${
                      selectedInitials.includes(initial)
                        ? "border-yellow-400 bg-yellow-500/20 text-white"
                        : "border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    onClick={() => toggleInitial(initial)}
                  >
                    {initial}
                    {selectedInitials.includes(initial) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full"></div>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
