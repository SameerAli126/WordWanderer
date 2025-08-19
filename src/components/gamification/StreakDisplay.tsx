'use client'

import { motion } from 'framer-motion'
import { Flame, Calendar, Target } from 'lucide-react'
import { generateStreakMessage } from '@/lib/utils'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  showMessage?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function StreakDisplay({
  currentStreak,
  longestStreak,
  showMessage = true,
  size = 'md',
  animated = true,
}: StreakDisplayProps) {
  const streakMessage = generateStreakMessage(currentStreak)
  
  const sizes = {
    sm: {
      container: 'p-3',
      text: 'text-sm',
      icon: 'w-4 h-4',
      streak: 'text-lg',
    },
    md: {
      container: 'p-4',
      text: 'text-base',
      icon: 'w-5 h-5',
      streak: 'text-xl',
    },
    lg: {
      container: 'p-6',
      text: 'text-lg',
      icon: 'w-6 h-6',
      streak: 'text-2xl',
    },
  }

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'from-gray-50 to-gray-100 border-gray-200'
    if (streak < 7) return 'from-warning-50 to-warning-100 border-warning-200'
    if (streak < 30) return 'from-orange-50 to-orange-100 border-orange-200'
    return 'from-error-50 to-error-100 border-error-200'
  }

  const getFlameColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400'
    if (streak < 7) return 'text-warning-500'
    if (streak < 30) return 'text-orange-500'
    return 'text-error-500'
  }

  return (
    <div className={`bg-gradient-to-r ${getStreakColor(currentStreak)} rounded-xl border ${sizes[size].container}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={currentStreak > 0 && animated ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className={`p-2 rounded-lg ${currentStreak > 0 ? 'bg-white shadow-md' : 'bg-gray-200'}`}
          >
            <Flame className={`${sizes[size].icon} ${getFlameColor(currentStreak)}`} />
          </motion.div>
          
          <div>
            <div className={`font-bold ${sizes[size].streak}`}>
              {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
            </div>
            <div className={`text-gray-600 ${sizes[size].text}`}>
              Current Streak
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 text-gray-600">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">{longestStreak}</span>
          </div>
          <div className="text-xs text-gray-500">Best</div>
        </div>
      </div>

      {showMessage && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-gray-700 ${sizes[size].text} font-medium`}
        >
          {streakMessage}
        </motion.div>
      )}

      {/* Streak visualization */}
      <div className="mt-3 flex space-x-1">
        {Array.from({ length: Math.min(currentStreak, 7) }).map((_, index) => (
          <motion.div
            key={index}
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`w-2 h-2 rounded-full ${
              index < currentStreak ? getFlameColor(currentStreak).replace('text-', 'bg-') : 'bg-gray-300'
            }`}
          />
        ))}
        {currentStreak > 7 && (
          <div className="flex items-center ml-2">
            <span className="text-xs text-gray-500">+{currentStreak - 7}</span>
          </div>
        )}
      </div>
    </div>
  )
}
