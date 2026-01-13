"use client"

import { useMemo, useState } from "react"
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
  const [matchSelection, setMatchSelection] = useState<{ left?: string; right?: string }>({})
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({})
  const [matchError, setMatchError] = useState("")

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100
  const isMatchQuestion = currentQuestion.type === "match"

  const parsedMatchPairs = useMemo(() => {
    if (!isMatchQuestion) {
      return []
    }

    return (currentQuestion.options ?? []).map((option) => {
      const [left, right] = option.split(" - ")
      return { left: left?.trim() ?? option, right: right?.trim() ?? option }
    })
  }, [currentQuestion.options, isMatchQuestion])

  const matchMap = useMemo(() => {
    const map = new Map<string, string>()
    parsedMatchPairs.forEach((pair) => {
      map.set(pair.left, pair.right)
    })
    return map
  }, [parsedMatchPairs])

  const rightOptions = useMemo(() => {
    if (!isMatchQuestion) {
      return []
    }

    const items = parsedMatchPairs.map((pair) => pair.right)
    let seed = currentQuestion.id * 9301 + 49297
    const shuffled = [...items]

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      seed = (seed * 9301 + 49297) % 233280
      const j = Math.floor((seed / 233280) * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }, [currentQuestion.id, isMatchQuestion, parsedMatchPairs])

  const matchedLeft = useMemo(() => new Set(Object.keys(matchPairs)), [matchPairs])
  const matchedRight = useMemo(() => new Set(Object.values(matchPairs)), [matchPairs])

  const handleAnswerSelect = (answer: string) => {
    if (isMatchQuestion) {
      return
    }
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    const correct = isMatchQuestion
      ? Object.keys(matchPairs).length === parsedMatchPairs.length
      : selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore((prev) => prev + 1)
    } else {
      setHearts((prev) => Math.max(0, prev - 1))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
      setShowResult(false)
      setMatchSelection({})
      setMatchPairs({})
      setMatchError("")
    } else {
      // Lesson completed
      router.push("/?view=learn")
    }
  }

  const handleExit = () => {
    router.push("/?view=learn")
  }

  const handleMatchSelection = (nextLeft?: string, nextRight?: string) => {
    if (nextLeft && nextRight) {
      if (matchMap.get(nextLeft) === nextRight) {
        setMatchPairs((prev) => ({ ...prev, [nextLeft]: nextRight }))
        setMatchSelection({})
        setMatchError("")
        return
      }

      setMatchSelection({})
      setMatchError("Not a match. Try again.")
      setHearts((prev) => Math.max(0, prev - 1))
      return
    }

    setMatchSelection({ left: nextLeft, right: nextRight })
  }

  const handleMatchLeft = (left: string) => {
    if (matchedLeft.has(left)) {
      return
    }

    const nextLeft = matchSelection.left === left ? undefined : left
    handleMatchSelection(nextLeft, matchSelection.right)
  }

  const handleMatchRight = (right: string) => {
    if (matchedRight.has(right)) {
      return
    }

    const nextRight = matchSelection.right === right ? undefined : right
    handleMatchSelection(matchSelection.left, nextRight)
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
            {isMatchQuestion ? (
              <div className="mb-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    {parsedMatchPairs.map((pair) => {
                      const isSelected = matchSelection.left === pair.left
                      const isMatched = matchedLeft.has(pair.left)

                      return (
                        <Button
                          key={pair.left}
                          variant="outline"
                          disabled={isMatched}
                          className={`w-full p-4 justify-start text-lg ${
                            isMatched
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                              : isSelected
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-slate-600 hover:border-slate-500"
                          }`}
                          onClick={() => handleMatchLeft(pair.left)}
                        >
                          {pair.left}
                        </Button>
                      )
                    })}
                  </div>

                  <div className="space-y-3">
                    {rightOptions.map((right) => {
                      const isSelected = matchSelection.right === right
                      const isMatched = matchedRight.has(right)

                      return (
                        <Button
                          key={right}
                          variant="outline"
                          disabled={isMatched}
                          className={`w-full p-4 justify-start text-lg ${
                            isMatched
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                              : isSelected
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-slate-600 hover:border-slate-500"
                          }`}
                          onClick={() => handleMatchRight(right)}
                        >
                          {right}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {matchError && (
                  <div className="mt-4 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {matchError}
                  </div>
                )}
              </div>
            ) : (
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
            )}

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
                  disabled={
                    isMatchQuestion
                      ? Object.keys(matchPairs).length !== parsedMatchPairs.length
                      : !selectedAnswer
                  }
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
