"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Character {
  char: string
  learned: boolean
}

interface HanziUnitProps {
  unit: {
    id: number
    section: number
    unit: number
    title: string
    subtitle: string
    characters: Character[]
    newWords?: Character[]
    completed: boolean
  }
}

export function HanziUnit({ unit }: HanziUnitProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-0">
        {/* Unit Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <div className="text-slate-400 text-sm font-medium">
              SECTION {unit.section}, UNIT {unit.unit}
            </div>
            <h3 className="text-white font-bold text-lg">{unit.title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {/* Unit Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            <div>
              <h4 className="text-slate-300 font-medium mb-3">{unit.subtitle}</h4>

              {/* Character Grid */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {unit.characters.map((character, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`aspect-square text-2xl font-bold rounded-xl border-2 transition-all ${
                      character.learned
                        ? "border-yellow-400 bg-yellow-500/20 text-white hover:bg-yellow-500/30"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {character.char}
                    {character.learned && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full"></div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* New Words Section */}
            {unit.newWords && unit.newWords.length > 0 && (
              <div>
                <h4 className="text-slate-300 font-medium mb-3">Used in new words</h4>
                <div className="flex gap-3">
                  {unit.newWords.map((character, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`aspect-square w-16 h-16 text-2xl font-bold rounded-xl border-2 transition-all ${
                        character.learned
                          ? "border-yellow-400 bg-yellow-500/20 text-white hover:bg-yellow-500/30"
                          : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {character.char}
                      {character.learned && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full"></div>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Button */}
            {unit.completed && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
                onClick={() => (window.location.href = "/practice/hanzi")}
              >
                PRACTICE
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
