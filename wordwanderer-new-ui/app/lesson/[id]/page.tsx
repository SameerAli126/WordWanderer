"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LessonInterface } from "@/components/lesson-interface"
import type { Lesson, LessonQuestion, LessonQuestionType } from "@/types/lesson"
import { apiRequest } from "@/lib/api"

interface BackendLessonQuestion {
  _id?: string
  type: string
  prompt: string
  content?: {
    text?: string
    audio?: string
    options?: string[]
    pairs?: Array<{ left: string; right: string }>
    items?: string[]
  }
  correctAnswer: string | string[] | boolean
  explanation?: string
}

interface BackendLesson {
  _id: string
  title: string
  description: string
  xpReward: number
  questions: BackendLessonQuestion[]
}

interface LessonResponse {
  success: boolean
  lesson: BackendLesson
}

const mapQuestionType = (type: string): LessonQuestionType => {
  switch (type) {
    case "multiple-choice":
    case "true-false":
      return "select"
    case "translation":
    case "fill-in-blank":
    case "speaking":
      return "translate"
    case "listening":
      return "audio"
    case "matching":
      return "match"
    case "ordering":
      return "ordering"
    default:
      return "select"
  }
}

const normalizeCorrectAnswer = (type: string, answer: BackendLessonQuestion["correctAnswer"]) => {
  if (type === "true-false") {
    if (typeof answer === "boolean") {
      return answer ? "True" : "False"
    }
  }
  return answer
}

const mapLessonQuestion = (question: BackendLessonQuestion, index: number): LessonQuestion => {
  const mappedType = mapQuestionType(question.type)
  const correctAnswer = normalizeCorrectAnswer(question.type, question.correctAnswer)

  const options =
    question.type === "true-false"
      ? ["True", "False"]
      : question.content?.options ?? []

  return {
    id: question._id ?? `${index}`,
    type: mappedType,
    prompt: question.prompt,
    context: question.content?.text,
    options: options.length ? options : undefined,
    correctAnswer: correctAnswer as string | string[],
    explanation: question.explanation,
    pairs: question.content?.pairs,
    items: question.content?.items,
    audio: question.content?.audio,
  }
}

const mapLesson = (lesson: BackendLesson): Lesson => {
  return {
    id: lesson._id,
    title: lesson.title,
    description: lesson.description,
    xpReward: lesson.xpReward ?? 0,
    questions: (lesson.questions || []).map(mapLessonQuestion),
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchLesson = async () => {
      try {
        const data = await apiRequest<LessonResponse>(`/api/lessons/${lessonId}`)

        if (!cancelled) {
          setLesson(mapLesson(data.lesson))
          setError(null)
        }
      } catch (err) {
        if (cancelled) {
          return
        }
        const status = (err as Error & { status?: number }).status
        if (status === 401) {
          router.push("/login")
          return
        }
        setError(err instanceof Error ? err.message : "Lesson not available.")
      }
    }

    fetchLesson()

    return () => {
      cancelled = true
    }
  }, [lessonId, router])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{error ?? "Loading lesson..."}</div>
      </div>
    )
  }

  return <LessonInterface lesson={lesson} />
}
