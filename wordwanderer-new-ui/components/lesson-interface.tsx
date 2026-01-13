"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { X, Volume2, CheckCircle, XCircle, Heart } from "lucide-react"
import type { Lesson, LessonQuestion } from "@/types/lesson"
import { apiRequest } from "@/lib/api"

interface LessonInterfaceProps {
  lesson: Lesson
}

interface LessonCompletionResponse {
  success: boolean
}

const normalizeText = (value: string) => value.trim().toLowerCase()

const compareTextAnswer = (answer: string, expected: LessonQuestion["correctAnswer"]) => {
  const normalized = normalizeText(answer)
  if (Array.isArray(expected)) {
    return expected.some((item) => normalizeText(item) === normalized)
  }
  return normalizeText(String(expected)) === normalized
}

const compareSelectAnswer = (answer: string, expected: LessonQuestion["correctAnswer"]) => {
  if (Array.isArray(expected)) {
    return expected.some((item) => normalizeText(item) === normalizeText(answer))
  }
  return normalizeText(String(expected)) === normalizeText(answer)
}

const compareOrdering = (answer: string[], expected: LessonQuestion["correctAnswer"]) => {
  if (!Array.isArray(expected) || expected.length !== answer.length) {
    return false
  }
  return expected.every((item, index) => normalizeText(item) === normalizeText(answer[index] ?? ""))
}

const getSeedFromId = (id: string) =>
  id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

const shuffleWithSeed = (items: string[], seed: number) => {
  const shuffled = [...items]
  let nextSeed = seed
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    nextSeed = (nextSeed * 9301 + 49297) % 233280
    const j = Math.floor((nextSeed / 233280) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function LessonInterface({ lesson }: LessonInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [textAnswer, setTextAnswer] = useState("")
  const [orderingSelection, setOrderingSelection] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [matchSelection, setMatchSelection] = useState<{ left?: string; right?: string }>({})
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({})
  const [matchError, setMatchError] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resultsRef = useRef<{ id: string; correct: boolean }[]>([])
  const startTimeRef = useRef(Date.now())

  const currentQuestion = lesson.questions[currentQuestionIndex] ?? lesson.questions[0]
  const currentQuestionId = currentQuestion?.id ?? "0"
  const progress = lesson.questions.length
    ? ((currentQuestionIndex + 1) / lesson.questions.length) * 100
    : 0

  const isMatchQuestion = currentQuestion?.type === "match"
  const isOrderingQuestion = currentQuestion?.type === "ordering"
  const isAudioQuestion = currentQuestion?.type === "audio"
  const isTextQuestion = currentQuestion?.type === "translate"
  const hasOptions = (currentQuestion?.options?.length ?? 0) > 0

  const matchPairsList = useMemo(() => currentQuestion?.pairs ?? [], [currentQuestion?.pairs])
  const matchMap = useMemo(() => {
    const map = new Map<string, string>()
    matchPairsList.forEach((pair) => {
      map.set(pair.left, pair.right)
    })
    return map
  }, [matchPairsList])

  const rightOptions = useMemo(() => {
    if (!isMatchQuestion || !currentQuestion) {
      return []
    }
    const items = matchPairsList.map((pair) => pair.right)
    return shuffleWithSeed(items, getSeedFromId(currentQuestionId))
  }, [currentQuestion, currentQuestionId, isMatchQuestion, matchPairsList])

  const orderingOptions = useMemo(() => {
    if (!isOrderingQuestion || !currentQuestion) {
      return []
    }
    const items = currentQuestion.items ?? []
    return shuffleWithSeed(items, getSeedFromId(currentQuestionId))
  }, [currentQuestion, currentQuestionId, isOrderingQuestion])

  const matchedLeft = useMemo(() => new Set(Object.keys(matchPairs)), [matchPairs])
  const matchedRight = useMemo(() => new Set(Object.values(matchPairs)), [matchPairs])

  const handleExit = () => {
    router.push("/app?view=learn")
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

  const handleOrderingPick = (item: string) => {
    if (orderingSelection.includes(item)) {
      return
    }
    setOrderingSelection((prev) => [...prev, item])
  }

  const handleOrderingRemove = (item: string) => {
    setOrderingSelection((prev) => prev.filter((entry) => entry !== item))
  }

  const handleSubmit = () => {
    if (!currentQuestion) {
      return
    }

    let correct = false
    if (isMatchQuestion) {
      correct = matchPairsList.every((pair) => matchPairs[pair.left] === pair.right)
    } else if (isOrderingQuestion) {
      correct = compareOrdering(orderingSelection, currentQuestion.correctAnswer)
    } else if (isTextQuestion || (isAudioQuestion && !hasOptions)) {
      correct = compareTextAnswer(textAnswer, currentQuestion.correctAnswer)
    } else {
      correct = compareSelectAnswer(selectedAnswer, currentQuestion.correctAnswer)
    }

    resultsRef.current = [
      ...resultsRef.current,
      { id: currentQuestion.id, correct },
    ]

    setIsCorrect(correct)
    setShowResult(true)
    if (!correct) {
      setHearts((prev) => Math.max(0, prev - 1))
    }
  }

  const resetAnswerState = () => {
    setSelectedAnswer("")
    setTextAnswer("")
    setOrderingSelection([])
    setShowResult(false)
    setIsCorrect(false)
    setMatchSelection({})
    setMatchPairs({})
    setMatchError("")
    setSubmitError(null)
  }

  const finalizeLesson = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const totalQuestions = lesson.questions.length
      const correctAnswers = resultsRef.current.filter((result) => result.correct).length
      const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
      const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      const xpEarned = Math.round((lesson.xpReward * accuracy) / 100)

      await apiRequest<LessonCompletionResponse>("/api/progress/lesson-complete", {
        method: "POST",
        body: JSON.stringify({
          lessonId: lesson.id,
          accuracy,
          timeSpent,
          xpEarned,
          questions: resultsRef.current,
        }),
      })

      router.push("/app?view=learn")
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save progress.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = async () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      resetAnswerState()
      return
    }

    await finalizeLesson()
  }

  if (!currentQuestion) {
    return null
  }

  const isAnswerReady = isMatchQuestion
    ? matchPairsList.length > 0 && Object.keys(matchPairs).length === matchPairsList.length
    : isOrderingQuestion
      ? orderingSelection.length === (currentQuestion.items?.length ?? 0)
      : isTextQuestion || (isAudioQuestion && !hasOptions)
        ? textAnswer.trim().length > 0
        : selectedAnswer.length > 0

  return (
    <div className="min-h-screen bg-slate-900 text-white">
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
                <Heart className="w-3 h-3 text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{currentQuestion.prompt}</h2>
              {currentQuestion.context && <p className="text-slate-300">{currentQuestion.context}</p>}
              {isAudioQuestion && (
                <Button variant="outline" className="mb-4 bg-transparent">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Play Audio
                </Button>
              )}
            </div>

            {isMatchQuestion ? (
              <div className="mb-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    {matchPairsList.map((pair) => {
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
            ) : isOrderingQuestion ? (
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Available</div>
                  {orderingOptions.map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      disabled={orderingSelection.includes(item)}
                      className={`w-full justify-start text-base ${
                        orderingSelection.includes(item)
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => handleOrderingPick(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Your order</div>
                  {orderingSelection.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-600 p-4 text-sm text-slate-400">
                      Tap items to build the sequence.
                    </div>
                  )}
                  {orderingSelection.map((item, index) => (
                    <Button
                      key={`${item}-${index}`}
                      variant="outline"
                      className="w-full justify-start border-slate-600 hover:border-slate-500"
                      onClick={() => handleOrderingRemove(item)}
                    >
                      {index + 1}. {item}
                    </Button>
                  ))}
                </div>
              </div>
            ) : isTextQuestion || (isAudioQuestion && !hasOptions) ? (
              <div className="mb-8">
                <Input
                  value={textAnswer}
                  onChange={(event) => setTextAnswer(event.target.value)}
                  placeholder="Type your answer"
                  className="bg-slate-900/60 border-slate-600 text-white"
                />
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
                    onClick={() => setSelectedAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

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

            <div className="flex justify-center">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isAnswerReady}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  CHECK
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {submitError && (
                    <div className="text-sm text-red-300 border border-red-500/40 rounded-lg px-4 py-2">
                      {submitError}
                    </div>
                  )}
                  <Button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {currentQuestionIndex < lesson.questions.length - 1
                      ? "CONTINUE"
                      : isSubmitting
                        ? "SAVING..."
                        : "FINISH"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
