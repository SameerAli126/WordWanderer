'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Question, LessonSession } from '@/types'
import QuestionCard from '@/components/lesson/QuestionCard'
import LessonProgress from '@/components/lesson/LessonProgress'
import LessonComplete from '@/components/lesson/LessonComplete'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Mock Chinese lesson data
const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt: 'How do you say "Hello" in Chinese?',
    content: {
      options: ['你好 (nǐ hǎo)', '再见 (zài jiàn)', '谢谢 (xiè xiè)', '不客气 (bù kè qì)']
    },
    correctAnswer: '你好 (nǐ hǎo)',
    explanation: '你好 (nǐ hǎo) is the most common way to say hello in Chinese. 你 means "you" and 好 means "good".',
    hints: ['This greeting literally means "you good" in Chinese.'],
    xpReward: 15,
  },
  {
    id: 'q2',
    type: 'translation',
    prompt: 'Translate to English:',
    content: {
      text: '谢谢 (xiè xiè)'
    },
    correctAnswer: 'Thank you',
    explanation: '谢谢 (xiè xiè) means "thank you" in Chinese. It\'s one of the most important polite expressions.',
    hints: ['This is a polite expression used to show gratitude.'],
    xpReward: 15,
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt: 'Which means "Goodbye" in Chinese?',
    content: {
      options: ['你好 (nǐ hǎo)', '再见 (zài jiàn)', '早上好 (zǎo shàng hǎo)', '晚安 (wǎn ān)']
    },
    correctAnswer: '再见 (zài jiàn)',
    explanation: '再见 (zài jiàn) means goodbye. 再 means "again" and 见 means "see", so it literally means "see again".',
    hints: ['This farewell literally means "see again".'],
    xpReward: 15,
  },
  {
    id: 'q4',
    type: 'fill-in-blank',
    prompt: 'Complete the polite response:',
    content: {
      text: 'A: 谢谢! (Thank you!) B: _____ (You\'re welcome!)'
    },
    correctAnswer: '不客气',
    explanation: '不客气 (bù kè qì) means "you\'re welcome" or "don\'t be polite". It\'s the standard response to "thank you".',
    hints: ['This response literally means "don\'t be polite".'],
    xpReward: 20,
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    prompt: 'How do you say "Good morning" in Chinese?',
    content: {
      options: ['早上好 (zǎo shàng hǎo)', '下午好 (xià wǔ hǎo)', '晚上好 (wǎn shàng hǎo)', '晚安 (wǎn ān)']
    },
    correctAnswer: '早上好 (zǎo shàng hǎo)',
    explanation: '早上好 (zǎo shàng hǎo) means good morning. 早上 means "morning" and 好 means "good".',
    hints: ['早上 means "morning" in Chinese.'],
    xpReward: 15,
  },
]

export default function DemoPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: string | string[]; isCorrect: boolean; timeSpent: number }>>([])
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [lives, setLives] = useState(3)
  const [session, setSession] = useState<LessonSession | null>(null)

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id)

  useEffect(() => {
    // Initialize session
    const newSession: LessonSession = {
      id: 'demo-session',
      lessonId: 'demo-lesson',
      userId: 'demo-user',
      startedAt: new Date(),
      questions: [],
      totalXP: 0,
      accuracy: 0,
      timeSpent: 0,
      isCompleted: false,
    }
    setSession(newSession)
  }, [])

  const handleAnswer = (answer: string | string[], timeSpent: number) => {
    if (!currentQuestion) return

    const isCorrect = Array.isArray(answer)
      ? Array.isArray(currentQuestion.correctAnswer)
        ? answer.every(a => currentQuestion.correctAnswer.includes(a)) &&
          answer.length === currentQuestion.correctAnswer.length
        : false
      : answer.toLowerCase().trim() === (currentQuestion.correctAnswer as string).toLowerCase().trim()

    const newAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      timeSpent,
    }

    setAnswers(prev => [...prev.filter(a => a.questionId !== currentQuestion.id), newAnswer])
    setShowResult(true)

    if (!isCorrect) {
      setLives(prev => Math.max(0, prev - 1))
    }

    // Update session
    if (session) {
      const updatedAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer]
      const totalXP = updatedAnswers.reduce((sum, a) => sum + (a.isCorrect ? currentQuestion.xpReward : 0), 0)
      const accuracy = updatedAnswers.length > 0 ? (updatedAnswers.filter(a => a.isCorrect).length / updatedAnswers.length) * 100 : 0
      const totalTimeSpent = session.timeSpent + timeSpent

      setSession({
        ...session,
        questions: updatedAnswers.map(a => ({
          questionId: a.questionId,
          userAnswer: a.answer,
          isCorrect: a.isCorrect,
          timeSpent: a.timeSpent,
          hintsUsed: 0,
          attempts: 1,
        })),
        totalXP,
        accuracy,
        timeSpent: totalTimeSpent,
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowResult(false)
    } else {
      // Complete lesson
      if (session) {
        setSession({
          ...session,
          completedAt: new Date(),
          isCompleted: true,
        })
      }
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setShowResult(false)
    }
  }

  const handleExit = () => {
    router.push('/')
  }

  const handleContinue = () => {
    router.push('/courses')
  }

  if (isComplete && session) {
    return (
      <LessonComplete
        session={session}
        onContinue={handleContinue}
        showConfetti={session.accuracy >= 80}
      />
    )
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  const totalXP = answers.reduce((sum, a) => sum + (a.isCorrect ? 10 : 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <LessonProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={mockQuestions.length}
        lives={lives}
        maxLives={3}
        xpEarned={totalXP}
        onExit={handleExit}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              showResult={showResult}
              isCorrect={currentAnswer?.isCorrect || false}
              disabled={showResult}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-center mt-8 max-w-2xl mx-auto"
          >
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {mockQuestions.length}
              </div>
            </div>

            <Button
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentQuestionIndex === mockQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </motion.div>
        )}

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-red-800 font-medium">
              🇨🇳 Chinese Language Demo - Learn Mandarin with WordWanderer!
            </p>
            <p className="text-red-700 text-sm mt-1">
              Experience our comprehensive Chinese course with characters, pinyin, and cultural context.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
