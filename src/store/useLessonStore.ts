import { create } from 'zustand'
import { Lesson, Question, QuestionAttempt, LessonSession } from '@/types'

interface LessonState {
  currentLesson: Lesson | null
  currentQuestion: Question | null
  currentQuestionIndex: number
  session: LessonSession | null
  answers: QuestionAttempt[]
  isLoading: boolean
  showResults: boolean
  
  // Actions
  startLesson: (lesson: Lesson) => void
  setCurrentQuestion: (index: number) => void
  submitAnswer: (answer: string | string[], timeSpent: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  completeLesson: () => void
  resetLesson: () => void
  setLoading: (loading: boolean) => void
  showLessonResults: () => void
}

export const useLessonStore = create<LessonState>((set, get) => ({
  currentLesson: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  session: null,
  answers: [],
  isLoading: false,
  showResults: false,

  startLesson: (lesson) => {
    const session: LessonSession = {
      id: `session_${Date.now()}`,
      lessonId: lesson.id,
      userId: 'current_user', // This would come from auth
      startedAt: new Date(),
      questions: [],
      totalXP: 0,
      accuracy: 0,
      timeSpent: 0,
      isCompleted: false,
    }

    set({
      currentLesson: lesson,
      currentQuestion: lesson.questions[0] || null,
      currentQuestionIndex: 0,
      session,
      answers: [],
      showResults: false,
    })
  },

  setCurrentQuestion: (index) => {
    const { currentLesson } = get()
    if (currentLesson && index >= 0 && index < currentLesson.questions.length) {
      set({
        currentQuestion: currentLesson.questions[index],
        currentQuestionIndex: index,
      })
    }
  },

  submitAnswer: (answer, timeSpent) => {
    const { currentQuestion, answers, session } = get()
    if (!currentQuestion || !session) return

    const isCorrect = Array.isArray(answer)
      ? Array.isArray(currentQuestion.correctAnswer)
        ? answer.every(a => currentQuestion.correctAnswer.includes(a)) &&
          answer.length === currentQuestion.correctAnswer.length
        : false
      : answer === currentQuestion.correctAnswer

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      hintsUsed: 0,
      attempts: 1,
    }

    const newAnswers = [...answers, attempt]
    const totalTimeSpent = session.timeSpent + timeSpent
    const totalXP = newAnswers.reduce((sum, a) => 
      sum + (a.isCorrect ? currentQuestion.xpReward : 0), 0
    )
    const accuracy = newAnswers.length > 0 
      ? (newAnswers.filter(a => a.isCorrect).length / newAnswers.length) * 100 
      : 0

    set({
      answers: newAnswers,
      session: {
        ...session,
        questions: newAnswers,
        totalXP,
        accuracy,
        timeSpent: totalTimeSpent,
      },
    })
  },

  nextQuestion: () => {
    const { currentQuestionIndex, currentLesson } = get()
    if (currentLesson && currentQuestionIndex < currentLesson.questions.length - 1) {
      get().setCurrentQuestion(currentQuestionIndex + 1)
    } else {
      get().completeLesson()
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get()
    if (currentQuestionIndex > 0) {
      get().setCurrentQuestion(currentQuestionIndex - 1)
    }
  },

  completeLesson: () => {
    const { session } = get()
    if (session) {
      set({
        session: {
          ...session,
          completedAt: new Date(),
          isCompleted: true,
        },
        showResults: true,
      })
    }
  },

  resetLesson: () => {
    set({
      currentLesson: null,
      currentQuestion: null,
      currentQuestionIndex: 0,
      session: null,
      answers: [],
      showResults: false,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  showLessonResults: () => set({ showResults: true }),
}))
