'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Trophy, Star, Zap, Clock, Target, ArrowRight } from 'lucide-react'
import { LessonSession } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatTime, getRandomEncouragement } from '@/lib/utils'

interface LessonCompleteProps {
  session: LessonSession
  onContinue: () => void
  onReview?: () => void
  showConfetti?: boolean
}

export default function LessonComplete({
  session,
  onContinue,
  onReview,
  showConfetti = true,
}: LessonCompleteProps) {
  const encouragement = getRandomEncouragement()
  const perfectScore = session.accuracy === 100

  useEffect(() => {
    // Play success sound effect here if available
  }, [])

  const stats = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'XP Earned',
      value: session.totalXP,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Accuracy',
      value: `${Math.round(session.accuracy)}%`,
      color: session.accuracy >= 80 ? 'text-success-600' : 'text-warning-600',
      bg: session.accuracy >= 80 ? 'bg-success-50' : 'bg-warning-50',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Time',
      value: formatTime(session.timeSpent),
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Questions',
      value: `${session.questions.filter(q => q.isCorrect).length}/${session.questions.length}`,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      {showConfetti && perfectScore && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full max-w-lg"
      >
        <Card className="text-center">
          <CardContent>
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="mb-6"
            >
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                perfectScore 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                  : 'bg-gradient-to-br from-success-400 to-success-600'
              }`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {perfectScore ? 'Perfect!' : 'Lesson Complete!'}
            </motion.h1>

            {/* Encouragement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              {encouragement}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-xl ${stat.bg} border border-gray-100`}
                >
                  <div className={`${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Accuracy Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <div className="text-left mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Lesson Accuracy
                </span>
              </div>
              <ProgressBar
                progress={session.accuracy}
                variant={session.accuracy >= 80 ? 'success' : 'warning'}
                size="lg"
                animated
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-3"
            >
              <Button
                onClick={onContinue}
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                Continue Learning
              </Button>

              {onReview && session.accuracy < 100 && (
                <Button
                  onClick={onReview}
                  variant="outline"
                  size="lg"
                  fullWidth
                >
                  Review Mistakes
                </Button>
              )}
            </motion.div>

            {/* Achievement Notification */}
            {perfectScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600 fill-current" />
                  <span className="font-medium text-yellow-800">
                    Perfect Score Achievement Unlocked!
                  </span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
