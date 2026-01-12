"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { LessonInterface } from "@/components/lesson-interface"
import { lessonData } from "@/data/lessons"

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number.parseInt(params.id as string)
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    const foundLesson = lessonData.find((l) => l.id === lessonId)
    if (foundLesson) {
      setLesson(foundLesson)
    } else {
      router.push("/?view=learn")
    }
  }, [lessonId, router])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading lesson...</div>
      </div>
    )
  }

  return <LessonInterface lesson={lesson} />
}
