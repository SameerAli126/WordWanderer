export type LessonQuestionType = "select" | "translate" | "audio" | "match" | "ordering"

export interface LessonMatchPair {
  left: string
  right: string
}

export interface LessonQuestion {
  id: string
  type: LessonQuestionType
  prompt: string
  context?: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  pairs?: LessonMatchPair[]
  items?: string[]
  audio?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  xpReward: number
  questions: LessonQuestion[]
}
