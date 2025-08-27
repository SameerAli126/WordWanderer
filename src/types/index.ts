export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  totalXP: number
  currentStreak: number
  longestStreak: number
  gems: number
  joinedAt: Date
  lastActiveAt: Date
  preferences: UserPreferences
  achievements: Achievement[]
  courses: UserCourse[]
}

export interface UserPreferences {
  dailyGoal: number // minutes per day
  reminderTime?: string
  soundEnabled: boolean
  notificationsEnabled: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string // UI language
}

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalLessons: number
  estimatedTime: string // e.g., "3 months"
}

export interface Course {
  id: string
  language: Language
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalUnits: number
  totalLessons: number
  estimatedDuration: string
  skills: Skill[]
  prerequisites?: string[]
}

export interface UserCourse {
  courseId: string
  course: Course
  enrolledAt: Date
  lastAccessedAt: Date
  progress: CourseProgress
  currentUnit: number
  currentLesson: number
  isCompleted: boolean
  completedAt?: Date
}

export interface CourseProgress {
  totalXP: number
  lessonsCompleted: number
  unitsCompleted: number
  averageAccuracy: number
  timeSpent: number // in seconds
  streakDays: number
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  color: string
  units: Unit[]
  prerequisites?: string[]
}

export interface Unit {
  id: string
  skillId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  isLocked: boolean
  requiredXP?: number
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  description: string
  type: LessonType
  order: number
  xpReward: number
  timeEstimate: number // in minutes
  questions: Question[]
  isCompleted: boolean
  isLocked: boolean
  accuracy?: number
  completedAt?: Date
}

export type LessonType = 
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'story'
  | 'review'

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  content: QuestionContent
  correctAnswer: string | string[]
  explanation?: string
  hints?: string[]
  timeLimit?: number // in seconds
  xpReward: number
}

export type QuestionType =
  | 'multiple-choice'
  | 'fill-in-blank'
  | 'translation'
  | 'listening'
  | 'speaking'
  | 'matching'
  | 'ordering'
  | 'true-false'

export interface QuestionContent {
  text?: string
  audio?: string
  image?: string
  options?: string[]
  blanks?: string[]
  pairs?: { left: string; right: string }[]
  items?: string[]
}

export interface LessonSession {
  id: string
  lessonId: string
  userId: string
  startedAt: Date
  completedAt?: Date
  questions: QuestionAttempt[]
  totalXP: number
  accuracy: number
  timeSpent: number
  isCompleted: boolean
}

export interface QuestionAttempt {
  questionId: string
  userAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
  attempts: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export type AchievementCategory =
  | 'streak'
  | 'xp'
  | 'lessons'
  | 'accuracy'
  | 'speed'
  | 'social'
  | 'special'

export interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }
  xp: number
  streak: number
  lessonsCompleted: number
}

export interface StudySession {
  date: Date
  timeSpent: number // in minutes
  xpEarned: number
  lessonsCompleted: number
  accuracy: number
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  readAt?: Date
  actionUrl?: string
}

export type NotificationType =
  | 'achievement'
  | 'streak'
  | 'reminder'
  | 'social'
  | 'system'
