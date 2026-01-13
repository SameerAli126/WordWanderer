"use client"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CourseSection } from "@/types/course-path"

interface LessonBannerProps {
  section: CourseSection
  currentSection: number
  onSectionChange: (sectionId: number) => void
  availableSections: CourseSection[]
}

export function LessonBanner({ section, currentSection, onSectionChange, availableSections }: LessonBannerProps) {
  const currentUnit = section.units[0] // Show first unit of current section
  const unitOrder = currentUnit?.order ?? 1
  if (!currentUnit) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 text-yellow-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border-2 border-yellow-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div
        className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"
        style={{ animation: "pulse 5s ease-in-out infinite" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"
        style={{ animation: "bounce 6s ease-in-out infinite" }}
      ></div>

      <div className="flex-1 relative z-10">
        {/* Section Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-xs sm:text-sm font-medium opacity-80 mb-2 p-0 h-auto hover:opacity-100 transition-opacity"
            >
              SECTION {section.id}, UNIT {unitOrder}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border-yellow-200 shadow-xl">
            {availableSections.map((sec) => (
              <DropdownMenuItem
                key={sec.id}
                onClick={() => onSectionChange(sec.id)}
                className={`cursor-pointer ${currentSection === sec.id ? "bg-yellow-100 font-bold" : ""}`}
              >
                <div>
                  <div className="font-medium">
                    Section {sec.id}: {sec.title}
                  </div>
                  <div className="text-xs text-slate-600">{sec.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-lg sm:text-xl font-bold">{currentUnit.title}</div>
        <div className="text-sm opacity-75 mt-1">{currentUnit.description}</div>
      </div>

      <Button
        variant="outline"
        className="bg-white/90 border-yellow-500 text-yellow-900 hover:bg-white hover:shadow-lg transition-all hover:scale-105 w-full sm:w-auto text-sm sm:text-base relative z-10"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        GUIDEBOOK
      </Button>
    </div>
  )
}
