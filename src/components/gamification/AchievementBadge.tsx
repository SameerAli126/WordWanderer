'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Target, Users, Clock } from 'lucide-react'
import { Achievement } from '@/types'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  animated?: boolean
  onClick?: () => void
}

export default function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = true,
  animated = true,
  onClick,
}: AchievementBadgeProps) {
  const isUnlocked = !!achievement.unlockedAt
  const progress = achievement.progress || 0
  const maxProgress = achievement.maxProgress || 100

  const sizes = {
    sm: {
      container: 'w-16 h-16',
      icon: 'w-6 h-6',
      text: 'text-xs',
      title: 'text-sm',
    },
    md: {
      container: 'w-20 h-20',
      icon: 'w-8 h-8',
      text: 'text-sm',
      title: 'text-base',
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'w-10 h-10',
      text: 'text-base',
      title: 'text-lg',
    },
  }

  const rarityColors = {
    common: {
      bg: 'from-gray-400 to-gray-600',
      border: 'border-gray-300',
      glow: 'shadow-gray-400/30',
    },
    rare: {
      bg: 'from-blue-400 to-blue-600',
      border: 'border-blue-300',
      glow: 'shadow-blue-400/30',
    },
    epic: {
      bg: 'from-purple-400 to-purple-600',
      border: 'border-purple-300',
      glow: 'shadow-purple-400/30',
    },
    legendary: {
      bg: 'from-yellow-400 to-yellow-600',
      border: 'border-yellow-300',
      glow: 'shadow-yellow-400/30',
    },
  }

  const categoryIcons = {
    streak: Zap,
    xp: Star,
    lessons: Target,
    accuracy: Trophy,
    speed: Clock,
    social: Users,
    special: Trophy,
  }

  const IconComponent = categoryIcons[achievement.category] || Trophy
  const colors = rarityColors[achievement.rarity]

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer group',
        onClick && 'hover:scale-105'
      )}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div
        className={cn(
          'relative rounded-full border-4 flex items-center justify-center transition-all duration-300',
          sizes[size].container,
          isUnlocked ? colors.border : 'border-gray-300',
          isUnlocked ? `bg-gradient-to-br ${colors.bg}` : 'bg-gray-200',
          isUnlocked && animated ? `shadow-lg ${colors.glow}` : 'shadow-md'
        )}
      >
        {/* Icon */}
        <IconComponent
          className={cn(
            sizes[size].icon,
            isUnlocked ? 'text-white' : 'text-gray-400'
          )}
        />

        {/* Unlock Animation */}
        {isUnlocked && animated && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 rounded-full border-4 border-white"
          />
        )}

        {/* Progress Ring */}
        {!isUnlocked && showProgress && maxProgress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-300"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={`text-primary-500`}
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / maxProgress),
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap max-w-xs">
          <div className={`font-semibold ${sizes[size].title}`}>
            {achievement.title}
          </div>
          <div className={`text-gray-300 ${sizes[size].text} mt-1`}>
            {achievement.description}
          </div>
          {!isUnlocked && showProgress && maxProgress > 0 && (
            <div className={`text-gray-400 ${sizes[size].text} mt-1`}>
              Progress: {progress}/{maxProgress}
            </div>
          )}
          {isUnlocked && achievement.unlockedAt && (
            <div className={`text-gray-400 ${sizes[size].text} mt-1`}>
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>

      {/* Rarity Indicator */}
      {isUnlocked && (
        <div className="absolute -top-1 -right-1">
          <div
            className={cn(
              'w-4 h-4 rounded-full border-2 border-white',
              `bg-gradient-to-br ${colors.bg}`
            )}
          />
        </div>
      )}
    </motion.div>
  )
}
