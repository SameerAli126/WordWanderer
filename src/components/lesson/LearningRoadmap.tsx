'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Star, Play, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  description: string
  type: 'vocabulary' | 'grammar' | 'conversation' | 'review'
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  isCompleted: boolean
  isLocked: boolean
  isCurrent: boolean
  order: number
}

interface Unit {
  id: string
  title: string
  description: string
  color: string
  icon: string
  lessons: Lesson[]
  isUnlocked: boolean
  completedLessons: number
  totalLessons: number
}

interface LearningRoadmapProps {
  units: Unit[]
  onLessonClick: (lessonId: string) => void
  userProgress?: {
    totalXP: number
    currentStreak: number
    completedLessons: number
  }
}

const LessonNode = ({ 
  lesson, 
  unitColor, 
  onClick, 
  position 
}: { 
  lesson: Lesson
  unitColor: string
  onClick: () => void
  position: 'left' | 'center' | 'right'
}) => {
  const getNodeStyle = () => {
    if (lesson.isCompleted) {
      return `bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg`
    }
    if (lesson.isCurrent) {
      return `bg-gradient-to-br ${unitColor} text-white shadow-xl ring-4 ring-white ring-opacity-50`
    }
    if (lesson.isLocked) {
      return `bg-gray-300 text-gray-500`
    }
    return `bg-white border-4 border-gray-200 text-gray-700 hover:border-blue-300 shadow-md`
  }

  const getIcon = () => {
    if (lesson.isCompleted) return <CheckCircle className="w-6 h-6" />
    if (lesson.isLocked) return <Lock className="w-6 h-6" />
    if (lesson.isCurrent) return <Play className="w-6 h-6" />
    return <Circle className="w-6 h-6" />
  }

  const positionClass = {
    left: 'mr-auto ml-8',
    center: 'mx-auto',
    right: 'ml-auto mr-8'
  }[position]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!lesson.isLocked ? { scale: 1.1 } : {}}
      whileTap={!lesson.isLocked ? { scale: 0.95 } : {}}
      className={cn(
        'relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
        getNodeStyle(),
        positionClass,
        lesson.isLocked && 'cursor-not-allowed'
      )}
      onClick={!lesson.isLocked ? onClick : undefined}
    >
      {getIcon()}
      
      {/* Lesson Info Tooltip */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">{lesson.title}</div>
        <div className="text-xs text-gray-300">{lesson.xpReward} XP</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Stars for completed lessons */}
      {lesson.isCompleted && (
        <div className="absolute -top-2 -right-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        </div>
      )}
    </motion.div>
  )
}

const UnitHeader = ({ unit }: { unit: Unit }) => {
  const progressPercentage = (unit.completedLessons / unit.totalLessons) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center text-2xl',
          unit.color
        )}>
          {unit.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{unit.title}</h3>
          <p className="text-gray-600">{unit.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="text-2xl font-bold text-gray-900">
            {unit.completedLessons}/{unit.totalLessons}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={cn(
            'h-full rounded-full transition-all duration-500',
            unit.color.replace('from-', 'bg-').split(' ')[0]
          )}
        />
      </div>
    </motion.div>
  )
}

export default function LearningRoadmap({ 
  units, 
  onLessonClick, 
  userProgress 
}: LearningRoadmapProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  const handleLessonClick = (lessonId: string) => {
    setSelectedLesson(lessonId)
    onLessonClick(lessonId)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Progress Header */}
      {userProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{userProgress.totalXP}</div>
              <div className="text-gray-600">Total XP</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">{userProgress.currentStreak}</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{userProgress.completedLessons}</div>
              <div className="text-gray-600">Lessons Done</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Learning Path */}
      <div className="relative">
        {/* Connecting Path */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 opacity-30 h-full"></div>

        {units.map((unit, unitIndex) => (
          <div key={unit.id} className="relative mb-16">
            <UnitHeader unit={unit} />
            
            {/* Lessons in zigzag pattern */}
            <div className="space-y-8">
              {unit.lessons.map((lesson, lessonIndex) => {
                const position = lessonIndex % 3 === 0 ? 'center' : lessonIndex % 3 === 1 ? 'left' : 'right'
                
                return (
                  <div key={lesson.id} className="relative group">
                    <LessonNode
                      lesson={lesson}
                      unitColor={unit.color}
                      onClick={() => handleLessonClick(lesson.id)}
                      position={position}
                    />
                    
                    {/* Connecting line to next lesson */}
                    {lessonIndex < unit.lessons.length - 1 && (
                      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Unit completion celebration */}
            {unit.completedLessons === unit.totalLessons && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mt-8"
              >
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span>Unit Complete!</span>
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
