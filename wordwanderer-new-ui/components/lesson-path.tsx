"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LessonBanner } from "./lesson-banner"
import { LevelButton } from "./level-button"
import { CharacterIllustration } from "./character-illustration"
import { PlanActivities } from "./plan-activities"
import type { CourseSection, LessonLevel } from "@/types/course-path"
import { API_BASE_URL } from "@/lib/api"

interface ProgressPathResponse {
  success: boolean
  sections: CourseSection[]
}

export function LessonPath() {
  const router = useRouter()
  const [sections, setSections] = useState<CourseSection[]>([])
  const [currentSection, setCurrentSection] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchPath = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/progress/path`, {
          credentials: "include",
        })

        if (response.status === 401) {
          router.push("/login")
          return
        }

        const data: ProgressPathResponse & { message?: string } = await response.json()
        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load your lesson path yet.")
        }

        if (cancelled) {
          return
        }

        const nextSections = data.sections ?? []
        setSections(nextSections)
        setCurrentSection(nextSections[0]?.id ?? 1)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load your lesson path yet.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchPath()

    return () => {
      cancelled = true
    }
  }, [router])

  const section = sections.find((s) => s.id === currentSection) ?? sections[0]

  const allLevels = useMemo(() => {
    if (!section) {
      return [] as (LessonLevel & { unitTitle: string; unitOrder: number })[]
    }

    const levels: (LessonLevel & { unitTitle: string; unitOrder: number })[] = []
    section.units.forEach((unit) => {
      unit.levels.forEach((level) => {
        levels.push({
          ...level,
          unitTitle: unit.title,
          unitOrder: unit.order,
        })
      })
    })
    return levels
  }, [section])

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
    if (!section) {
      return null
    }

    // Find which unit this level belongs to
    let levelCount = 0
    for (const unit of section.units) {
      if (index === levelCount) {
        return (
          <div className="mb-8 text-center">
            <div className="inline-block bg-slate-700 rounded-full px-4 py-2 mb-2">
              <span className="text-slate-300 text-sm font-medium">UNIT {unit.order}</span>
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
      {isLoading ? (
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-6 text-slate-200">
          Loading your learning path...
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-500/10 border border-red-500/50 p-6 text-red-200">{error}</div>
      ) : section ? (
        <LessonBanner
          section={section}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          availableSections={sections}
        />
      ) : null}

      <div className="relative mt-8 sm:mt-12">
        <div className="flex flex-col items-center space-y-8 sm:space-y-12">
          {allLevels.map((level, index) => (
            <div key={level.id} className="w-full flex flex-col items-center">
              {getUnitHeader(index)}

              <div className={`relative ${getPositionClass(index)}`}>
                <LevelButton
                  label={String(level.order)}
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
