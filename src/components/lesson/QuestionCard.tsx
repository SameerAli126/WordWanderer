'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { Question, QuestionType } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  onAnswer: (answer: string | string[], timeSpent: number) => void
  showResult?: boolean
  isCorrect?: boolean
  disabled?: boolean
}

export default function QuestionCard({
  question,
  onAnswer,
  showResult = false,
  isCorrect = false,
  disabled = false,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('')
  const [startTime] = useState(Date.now())
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setSelectedAnswer('')
    setShowHint(false)
  }, [question.id])

  const handleSubmit = () => {
    if (!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)) return
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onAnswer(selectedAnswer, timeSpent)
  }

  const handleOptionSelect = (option: string) => {
    if (disabled) return
    
    if (question.type === 'multiple-choice') {
      setSelectedAnswer(option)
    }
  }

  const handleTextInput = (value: string) => {
    if (disabled) return
    setSelectedAnswer(value)
  }

  const playAudio = () => {
    if (question.content.audio) {
      const audio = new Audio(question.content.audio)
      audio.play()
    }
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.content.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(option)}
                disabled={disabled}
                className={cn(
                  'w-full p-4 text-left rounded-xl border-2 transition-all duration-200',
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                  disabled && 'cursor-not-allowed opacity-60',
                  showResult && selectedAnswer === option && isCorrect && 'border-success-500 bg-success-50',
                  showResult && selectedAnswer === option && !isCorrect && 'border-error-500 bg-error-50',
                  showResult && option === question.correctAnswer && 'border-success-500 bg-success-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && option === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  )}
                  {showResult && selectedAnswer === option && !isCorrect && (
                    <XCircle className="w-5 h-5 text-error-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )

      case 'fill-in-blank':
      case 'translation':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900">
              {question.content.text}
            </div>
            <input
              type="text"
              value={selectedAnswer as string}
              onChange={(e) => handleTextInput(e.target.value)}
              disabled={disabled}
              placeholder="Type your answer..."
              className={cn(
                'w-full p-4 text-lg border-2 rounded-xl transition-all duration-200',
                'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                showResult && isCorrect && 'border-success-500 bg-success-50',
                showResult && !isCorrect && 'border-error-500 bg-error-50',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            />
            {showResult && !isCorrect && (
              <div className="text-success-600 font-medium">
                Correct answer: {question.correctAnswer}
              </div>
            )}
          </div>
        )

      case 'listening':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Volume2 className="w-6 h-6" />}
                onClick={playAudio}
                className="mb-4"
              >
                Play Audio
              </Button>
              <p className="text-gray-600">Listen and type what you hear</p>
            </div>
            <input
              type="text"
              value={selectedAnswer as string}
              onChange={(e) => handleTextInput(e.target.value)}
              disabled={disabled}
              placeholder="Type what you heard..."
              className={cn(
                'w-full p-4 text-lg border-2 rounded-xl transition-all duration-200',
                'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                showResult && isCorrect && 'border-success-500 bg-success-50',
                showResult && !isCorrect && 'border-error-500 bg-error-50',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            />
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500">
            Question type not implemented yet
          </div>
        )
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Question Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {question.prompt}
          </h2>
          {question.content.image && (
            <div className="mb-4">
              <img
                src={question.content.image}
                alt="Question illustration"
                className="max-w-xs mx-auto rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Question Content */}
        {renderQuestionContent()}

        {/* Hint Section */}
        <AnimatePresence>
          {showHint && question.hints && question.hints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-warning-50 border border-warning-200 rounded-xl p-4"
            >
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-warning-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning-800 mb-1">Hint</h4>
                  <p className="text-warning-700">{question.hints[0]}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!showResult && (
          <div className="flex items-center justify-between">
            {question.hints && question.hints.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Lightbulb className="w-4 h-4" />}
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            )}
            
            <div className="flex-1" />
            
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || disabled}
              size="lg"
            >
              Check Answer
            </Button>
          </div>
        )}

        {/* Result Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'p-4 rounded-xl border-2',
                isCorrect
                  ? 'bg-success-50 border-success-200'
                  : 'bg-error-50 border-error-200'
              )}
            >
              <div className="flex items-center space-x-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-success-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-error-600" />
                )}
                <div>
                  <h3 className={cn(
                    'font-semibold',
                    isCorrect ? 'text-success-800' : 'text-error-800'
                  )}>
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </h3>
                  {question.explanation && (
                    <p className={cn(
                      'text-sm mt-1',
                      isCorrect ? 'text-success-700' : 'text-error-700'
                    )}>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
