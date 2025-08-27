"use client"

import { useState } from "react"
import { LessonBanner } from "./lesson-banner"
import { LevelButton } from "./level-button"
import { CharacterIllustration } from "./character-illustration"
import { PlanActivities } from "./plan-activities"
import { courseData, type Level } from "@/data/course-data"

export function LessonPath() {
  const [currentSection, setCurrentSection] = useState(1)

  const section = courseData.find((s) => s.id === currentSection)
  if (!section) return null

  // Flatten all levels from all units in current section
  const allLevels: (Level & { unitTitle: string })[] = []
  section.units.forEach((unit) => {
    unit.levels.forEach((level) => {
      allLevels.push({ ...level, unitTitle: unit.title })
    })
  })

  const getPositionClass = (index: number) => {
    // Dragon's tail pattern - snake down the center with slight offsets
    const pattern = index % 4
    switch (pattern) {
      case 0:
        return "self-center" // Center
      case 1:
        return "self-center translate-x-8" // Slightly right
      case 2:
        return "self-center" // Center
      case 3:
        return "self-center -translate-x-8" // Slightly left
      default:
        return "self-center"
    }
  }

  const getConnectorPath = (index: number) => {
    if (index >= allLevels.length - 1) return null

    const currentPattern = index % 4
    const nextPattern = (index + 1) % 4

    // Create smooth curves between positions
    return (
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-12">
        <svg className="w-full h-full" viewBox="0 0 100 50" fill="none">
          {currentPattern === 0 && nextPattern === 1 && (
            <path d="M50 5 Q65 15 75 45" stroke="#58E6D9" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {currentPattern === 1 && nextPattern === 2 && (
            <path d="M75 5 Q65 15 50 45" stroke="#58E6D9" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {currentPattern === 2 && nextPattern === 3 && (
            <path d="M50 5 Q35 15 25 45" stroke="#58E6D9" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {currentPattern === 3 && nextPattern === 0 && (
            <path d="M25 5 Q35 15 50 45" stroke="#58E6D9" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
          {/* Straight connections for same positions */}
          {currentPattern === nextPattern && (
            <path d="M50 5 L50 45" stroke="#58E6D9" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </div>
    )
  }

  const getUnitHeader = (index: number) => {
    // Find which unit this level belongs to
    let levelCount = 0
    for (const unit of section.units) {
      if (index === levelCount) {
        return (
          <div className="mb-8 text-center">
            <div className="inline-block bg-slate-700 rounded-full px-4 py-2 mb-2">
              <span className="text-slate-300 text-sm font-medium">UNIT {unit.id}</span>
            </div>
            <h3 className="text-white text-lg font-bold">{unit.title}</h3>
            <p className="text-slate-400 text-sm">{unit.description}</p>
          </div>
        )
      }
      levelCount += unit.levels.length
      if (index < levelCount) break
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-6">
      <LessonBanner
        section={section}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        availableSections={courseData}
      />

      <div className="relative mt-8 sm:mt-12">
        <div className="flex flex-col items-center space-y-8 sm:space-y-12">
          {allLevels.map((level, index) => (
            <div key={level.id} className="w-full flex flex-col items-center">
              {getUnitHeader(index)}

              <div className={`relative ${getPositionClass(index)}`}>
                <LevelButton
                  level={level.id}
                  completed={level.completed}
                  locked={level.locked}
                  current={level.current}
                  onClick={() => {
                    if (!level.locked) {
                      window.location.href = `/lesson/${level.id}`
                    }
                  }}
                />

                {/* Character illustrations at specific points */}
                {index === 4 && (
                  <div className="absolute left-16 sm:left-20 top-0">
                    <CharacterIllustration type="castle" />
                  </div>
                )}

                {index === 8 && (
                  <div className="absolute right-16 sm:right-20 top-0">
                    <CharacterIllustration type="bear" />
                  </div>
                )}

                {/* Curved connecting paths */}
                {getConnectorPath(index)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PlanActivities />
    </div>
  )
}
