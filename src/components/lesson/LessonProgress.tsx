'use client'

import { motion } from 'framer-motion'
import { X, Heart, Zap } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/button'

interface LessonProgressProps {
  currentQuestion: number
  totalQuestions: number
  lives?: number
  maxLives?: number
  xpEarned?: number
  onExit?: () => void
  showXP?: boolean
}

export default function LessonProgress({
  currentQuestion,
  totalQuestions,
  lives = 3,
  maxLives = 3,
  xpEarned = 0,
  onExit,
  showXP = true,
}: LessonProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Exit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Progress Bar */}
          <div className="flex-1 mx-6">
            <ProgressBar
              progress={progress}
              variant="primary"
              size="md"
              animated
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestion} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-primary-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Lives and XP */}
          <div className="flex items-center space-x-4">
            {/* Lives */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: maxLives }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  animate={index < lives ? { scale: 1 } : { scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      index < lives
                        ? 'text-error-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* XP Counter */}
            {showXP && (
              <motion.div
                initial={{ scale: 1 }}
                animate={xpEarned > 0 ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-1 bg-primary-50 px-3 py-1 rounded-full"
              >
                <Zap className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  {xpEarned} XP
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
