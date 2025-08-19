'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp } from 'lucide-react'
import { formatNumber, getLevelFromXP, getProgressToNextLevel, getXPForNextLevel } from '@/lib/utils'
import ProgressBar from '@/components/ui/ProgressBar'

interface XPDisplayProps {
  currentXP: number
  recentXP?: number
  showLevel?: boolean
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function XPDisplay({
  currentXP,
  recentXP = 0,
  showLevel = true,
  showProgress = true,
  size = 'md',
  animated = true,
}: XPDisplayProps) {
  const currentLevel = getLevelFromXP(currentXP)
  const progressToNext = getProgressToNextLevel(currentXP)
  const xpForNextLevel = getXPForNextLevel(currentXP)

  const sizes = {
    sm: {
      container: 'p-3',
      text: 'text-sm',
      icon: 'w-4 h-4',
      level: 'text-lg',
    },
    md: {
      container: 'p-4',
      text: 'text-base',
      icon: 'w-5 h-5',
      level: 'text-xl',
    },
    lg: {
      container: 'p-6',
      text: 'text-lg',
      icon: 'w-6 h-6',
      level: 'text-2xl',
    },
  }

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 ${sizes[size].container}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Zap className={`${sizes[size].icon} text-white`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-primary-900 ${sizes[size].text}`}>
                {formatNumber(currentXP)} XP
              </span>
              {recentXP > 0 && animated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  className="flex items-center space-x-1 text-success-600 font-semibold"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-sm">+{recentXP}</span>
                </motion.div>
              )}
            </div>
            {showLevel && (
              <div className="text-primary-700 text-sm">
                Level {currentLevel}
              </div>
            )}
          </div>
        </div>
        
        {showLevel && (
          <div className="text-center">
            <div className={`font-bold text-primary-900 ${sizes[size].level}`}>
              {currentLevel}
            </div>
            <div className="text-xs text-primary-600">Level</div>
          </div>
        )}
      </div>

      {showProgress && (
        <div className="space-y-2">
          <ProgressBar
            progress={progressToNext}
            variant="primary"
            size="sm"
            animated={animated}
          />
          <div className="flex justify-between text-xs text-primary-600">
            <span>Level {currentLevel}</span>
            <span>{xpForNextLevel} XP to Level {currentLevel + 1}</span>
          </div>
        </div>
      )}
    </div>
  )
}
