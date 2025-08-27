'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Flame, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LearningRoadmap from '@/components/lesson/LearningRoadmap'
import { Button } from '@/components/ui/button'

// Mock Chinese course data with proper roadmap structure
const chineseCourseData = {
  id: 'chinese-course',
  title: 'Chinese for Beginners',
  description: 'Master Mandarin Chinese with characters, pinyin, and cultural context',
  language: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  units: [
    {
      id: 'unit-1',
      title: 'Basic Greetings',
      description: 'Learn essential Chinese greetings and polite expressions',
      color: 'from-red-400 to-red-600',
      icon: '👋',
      isUnlocked: true,
      completedLessons: 2,
      totalLessons: 3,
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Hello & Goodbye',
          description: 'Basic greetings in Chinese',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 15,
          isCompleted: true,
          isLocked: false,
          isCurrent: false,
          order: 1
        },
        {
          id: 'lesson-1-2',
          title: 'Thank You & Please',
          description: 'Polite expressions',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 15,
          isCompleted: true,
          isLocked: false,
          isCurrent: false,
          order: 2
        },
        {
          id: 'lesson-1-3',
          title: 'Time Greetings',
          description: 'Morning, afternoon, evening',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 20,
          isCompleted: false,
          isLocked: false,
          isCurrent: true,
          order: 3
        }
      ]
    },
    {
      id: 'unit-2',
      title: 'Numbers & Time',
      description: 'Master Chinese numbers and time expressions',
      color: 'from-blue-400 to-blue-600',
      icon: '🔢',
      isUnlocked: true,
      completedLessons: 0,
      totalLessons: 4,
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Numbers 1-10',
          description: 'Basic counting in Chinese',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 15,
          isCompleted: false,
          isLocked: false,
          isCurrent: false,
          order: 1
        },
        {
          id: 'lesson-2-2',
          title: 'Numbers 11-100',
          description: 'Extended counting',
          type: 'vocabulary' as const,
          difficulty: 'medium' as const,
          xpReward: 20,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 2
        },
        {
          id: 'lesson-2-3',
          title: 'Telling Time',
          description: 'Hours and minutes',
          type: 'grammar' as const,
          difficulty: 'medium' as const,
          xpReward: 25,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 3
        },
        {
          id: 'lesson-2-4',
          title: 'Days & Dates',
          description: 'Calendar expressions',
          type: 'vocabulary' as const,
          difficulty: 'medium' as const,
          xpReward: 25,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 4
        }
      ]
    },
    {
      id: 'unit-3',
      title: 'Family & People',
      description: 'Vocabulary about family members and relationships',
      color: 'from-green-400 to-green-600',
      icon: '👨‍👩‍👧‍👦',
      isUnlocked: false,
      completedLessons: 0,
      totalLessons: 3,
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Family Members',
          description: 'Parents, siblings, relatives',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 20,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 1
        },
        {
          id: 'lesson-3-2',
          title: 'Describing People',
          description: 'Age, appearance, personality',
          type: 'vocabulary' as const,
          difficulty: 'medium' as const,
          xpReward: 25,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 2
        },
        {
          id: 'lesson-3-3',
          title: 'Family Conversations',
          description: 'Talking about your family',
          type: 'conversation' as const,
          difficulty: 'medium' as const,
          xpReward: 30,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 3
        }
      ]
    },
    {
      id: 'unit-4',
      title: 'Food & Dining',
      description: 'Essential vocabulary for ordering food and dining',
      color: 'from-yellow-400 to-orange-600',
      icon: '🍜',
      isUnlocked: false,
      completedLessons: 0,
      totalLessons: 4,
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'Common Foods',
          description: 'Rice, noodles, vegetables',
          type: 'vocabulary' as const,
          difficulty: 'easy' as const,
          xpReward: 20,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 1
        },
        {
          id: 'lesson-4-2',
          title: 'At the Restaurant',
          description: 'Ordering and paying',
          type: 'conversation' as const,
          difficulty: 'medium' as const,
          xpReward: 25,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 2
        },
        {
          id: 'lesson-4-3',
          title: 'Cooking Verbs',
          description: 'Fry, boil, steam, stir-fry',
          type: 'vocabulary' as const,
          difficulty: 'medium' as const,
          xpReward: 25,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 3
        },
        {
          id: 'lesson-4-4',
          title: 'Food Preferences',
          description: 'Expressing likes and dislikes',
          type: 'grammar' as const,
          difficulty: 'hard' as const,
          xpReward: 30,
          isCompleted: false,
          isLocked: true,
          isCurrent: false,
          order: 4
        }
      ]
    }
  ]
}

export default function ChineseCoursePage() {
  const router = useRouter()
  const [userProgress] = useState({
    totalXP: 50,
    currentStreak: 3,
    completedLessons: 2
  })

  const handleLessonClick = (lessonId: string) => {
    // Find the lesson
    const lesson = chineseCourseData.units
      .flatMap(unit => unit.lessons)
      .find(l => l.id === lessonId)
    
    if (lesson && !lesson.isLocked) {
      // Navigate to lesson
      if (lessonId === 'lesson-1-3') {
        router.push('/chinese-demo')
      } else {
        // For now, redirect to demo for all lessons
        router.push('/chinese-demo')
      }
    }
  }

  const handleBack = () => {
    router.push('/courses')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Courses
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{chineseCourseData.language.flag}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {chineseCourseData.title}
                  </h1>
                  <p className="text-gray-600">{chineseCourseData.description}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">{userProgress.totalXP} XP</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-600">
                <Flame className="w-5 h-5" />
                <span className="font-semibold">{userProgress.currentStreak} day streak</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{userProgress.completedLessons} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="py-8">
        <LearningRoadmap
          units={chineseCourseData.units}
          onLessonClick={handleLessonClick}
          userProgress={userProgress}
        />
      </div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center py-8"
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-xl font-bold mb-2">Keep Going! 加油! (Jiā yóu!)</h3>
          <p className="text-red-100">
            You're making great progress learning Chinese. Practice daily to maintain your streak!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
