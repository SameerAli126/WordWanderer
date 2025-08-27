'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  isAvailable: boolean
  courseCount: number
  description: string
  comingSoon?: boolean
}

const languages: Language[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    isAvailable: true,
    courseCount: 1,
    description: 'Learn Mandarin Chinese with characters, pinyin, and cultural context'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isAvailable: true,
    courseCount: 1,
    description: 'Master Spanish with interactive lessons and real-world conversations'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isAvailable: true,
    courseCount: 1,
    description: 'Discover the beauty of French language and culture'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isAvailable: true,
    courseCount: 1,
    description: 'Learn German grammar, vocabulary, and pronunciation'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isAvailable: false,
    courseCount: 0,
    description: 'Master Hiragana, Katakana, and Kanji characters',
    comingSoon: true
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    isAvailable: false,
    courseCount: 0,
    description: 'Learn Korean alphabet and conversation skills',
    comingSoon: true
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    isAvailable: false,
    courseCount: 0,
    description: 'Explore Italian language and Mediterranean culture',
    comingSoon: true
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    isAvailable: false,
    courseCount: 0,
    description: 'Learn Portuguese for global communication',
    comingSoon: true
  }
]

interface LanguageCarouselProps {
  className?: string
  showTitle?: boolean
  autoPlay?: boolean
  interval?: number
}

export default function LanguageCarousel({
  className,
  showTitle = true,
  autoPlay = true,
  interval = 5000
}: LanguageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % languages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isHovered])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % languages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + languages.length) % languages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentLanguage = languages[currentIndex]

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Language Adventure
          </h2>
          <p className="text-lg text-gray-600">
            Start learning a new language today with our interactive courses
          </p>
        </div>
      )}

      <div
        className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Content */}
        <div className="relative h-80 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-between p-8"
            >
              {/* Language Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{currentLanguage.flag}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {currentLanguage.name}
                    </h3>
                    <p className="text-xl text-gray-600">
                      {currentLanguage.nativeName}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-lg max-w-md">
                  {currentLanguage.description}
                </p>

                <div className="flex items-center space-x-4">
                  {currentLanguage.isAvailable ? (
                    <>
                      <Link href={currentLanguage.code === 'zh' ? '/learn/chinese' : `/courses?language=${currentLanguage.code}`}>
                        <Button
                          size="lg"
                          className={cn(
                            "bg-gradient-to-r hover:scale-105 transition-all duration-200",
                            currentLanguage.code === 'zh'
                              ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                              : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          )}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {currentLanguage.code === 'zh' ? 'Start Chinese Course' : 'Start Learning'}
                        </Button>
                      </Link>
                      <div className="text-sm text-gray-500">
                        {currentLanguage.courseCount} course{currentLanguage.courseCount !== 1 ? 's' : ''} available
                        {currentLanguage.code === 'zh' && (
                          <div className="text-red-600 font-medium">✨ Featured Language</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                        disabled
                      >
                        <Lock className="w-5 h-5 mr-2" />
                        Coming Soon
                      </Button>
                      {currentLanguage.comingSoon && (
                        <div className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm font-medium">
                          In Development
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Visual Element */}
              <div className="hidden md:block">
                <div className="w-48 h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <div className="text-8xl opacity-50">
                    {currentLanguage.flag}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {languages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-primary-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>

        {/* Available Badge */}
        {currentLanguage.isAvailable && (
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
              Available Now
            </div>
          </div>
        )}
      </div>

      {/* Language Grid Preview */}
      <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-4">
        {languages.map((language, index) => (
          <motion.button
            key={language.code}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'p-3 rounded-xl border-2 transition-all duration-200 text-center',
              index === currentIndex
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white',
              !language.isAvailable && 'opacity-50'
            )}
          >
            <div className="text-2xl mb-1">{language.flag}</div>
            <div className="text-xs font-medium text-gray-700">
              {language.name}
            </div>
            {!language.isAvailable && (
              <div className="text-xs text-gray-500 mt-1">
                <Lock className="w-3 h-3 mx-auto" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
