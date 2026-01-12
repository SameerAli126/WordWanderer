"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Volume2, CheckCircle, XCircle } from "lucide-react"
import type { Lesson } from "@/data/lessons"

interface LessonInterfaceProps {
  lesson: Lesson
}

export function LessonInterface({ lesson }: LessonInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState(5)

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
    } else {
      setHearts(Math.max(0, hearts - 1))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
      setShowResult(false)
    } else {
      // Lesson completed
      router.push("/?view=learn")
    }
  }

  const handleExit = () => {
    router.push("/?view=learn")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={handleExit}>
          <X className="w-5 h-5" />
        </Button>

        <div className="flex-1 mx-4">
          <Progress value={progress} className="h-3" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${
                  i < hearts ? "bg-red-500" : "bg-slate-600"
                } flex items-center justify-center`}
              >
                <span className="text-xs">❤️</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
              {currentQuestion.type === "audio" && (
                <Button variant="outline" className="mb-4 bg-transparent">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Play Audio
                </Button>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 text-left justify-start text-lg ${
                    selectedAnswer === option
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? "bg-green-500/20 border border-green-500" : "bg-red-500/20 border border-red-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-bold">{isCorrect ? "Correct!" : "Incorrect"}</span>
                </div>
                {currentQuestion.explanation && <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  CHECK
                </Button>
              ) : (
                <Button onClick={handleNext} className="px-8 py-3 bg-green-600 hover:bg-green-700">
                  {currentQuestionIndex < lesson.questions.length - 1 ? "CONTINUE" : "FINISH"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
