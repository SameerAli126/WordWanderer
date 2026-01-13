export interface LessonLevel {
  id: string
  order: number
  title: string
  description: string
  completed: boolean
  locked: boolean
  current?: boolean
}

export interface CourseUnit {
  id: string
  title: string
  description: string
  order: number
  levels: LessonLevel[]
}

export interface CourseSection {
  id: number
  title: string
  description: string
  units: CourseUnit[]
}
