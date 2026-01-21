"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Volume2, CheckCircle, XCircle } from "lucide-react"
import { toneExercises, initialExercises, type ToneExercise, type InitialExercise } from "@/data/pinyin-data"
import { apiRequest } from "@/lib/api"

export function PinyinPractice() {
  const router = useRouter()
  const [currentExercise, setCurrentExercise] = useState<ToneExercise | InitialExercise | null>(null)
  const [exerciseType, setExerciseType] = useState<"tones" | "initials">("tones")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const startTimeRef = useRef(Date.now())
  const correctCountRef = useRef(0)

  const exercises = exerciseType === "tones" ? toneExercises : initialExercises
  const totalExercises = 10

  useEffect(() => {
    loadNextExercise()
  }, [currentIndex, exerciseType])

  const loadNextExercise = () => {
    if (currentIndex >= totalExercises) {
      return
    }

    const exercise = exercises[currentIndex % exercises.length]
    setCurrentExercise(exercise)

    // Generate options
    if (exerciseType === "tones") {
      const toneExercise = exercise as ToneExercise
      const wrongOptions = toneExercises
        .filter((e) => e.id !== toneExercise.id)
        .slice(0, 3)
        .map((e) => e.pinyin)
      setOptions([toneExercise.pinyin, ...wrongOptions].sort(() => Math.random() - 0.5))
    } else {
      const initialExercise = exercise as InitialExercise
      const wrongOptions = initialExercises
        .filter((e) => e.id !== initialExercise.id)
        .slice(0, 3)
        .map((e) => e.character)
      setOptions([initialExercise.character, ...wrongOptions].sort(() => Math.random() - 0.5))
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!currentExercise) return

    let correct = false
    if (exerciseType === "tones") {
      correct = selectedAnswer === (currentExercise as ToneExercise).pinyin
    } else {
      correct = selectedAnswer === (currentExercise as InitialExercise).character
    }

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      correctCountRef.current += 1
      setScore((prev) => prev + 1)
    }
  }

  const recordPractice = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const total = totalExercises
      const correctAnswers = correctCountRef.current
      const accuracy = total ? Math.round((correctAnswers / total) * 100) : 0
      const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))

      await apiRequest("/api/progress/practice-complete", {
        method: "POST",
        body: JSON.stringify({
          practiceType: "pinyin",
          mode: exerciseType,
          totalExercises: total,
          correctAnswers,
          accuracy,
          timeSpent,
        }),
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save practice progress.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (currentIndex >= totalExercises - 1) {
      await recordPractice()
      router.push("/app?view=characters")
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer("")
    setShowResult(false)
  }

  const handleExit = () => {
    router.push("/app?view=characters")
  }

  const progress = ((currentIndex + 1) / totalExercises) * 100

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading practice...</div>
      </div>
    )
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

        <div className="text-sm text-slate-400">
          {currentIndex + 1} / {totalExercises}
        </div>
      </div>

      {/* Practice Type Selector */}
      <div className="flex justify-center p-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <Button
            variant={exerciseType === "tones" ? "default" : "ghost"}
            className={`px-6 py-2 ${
              exerciseType === "tones" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setExerciseType("tones")}
          >
            TONES
          </Button>
          <Button
            variant={exerciseType === "initials" ? "default" : "ghost"}
            className={`px-6 py-2 ${
              exerciseType === "initials" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setExerciseType("initials")}
          >
            INITIALS
          </Button>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {exerciseType === "tones" ? (
                <>
                  <div className="text-6xl font-bold mb-4">{(currentExercise as ToneExercise).character}</div>
                  <h2 className="text-2xl font-bold mb-2">Select the correct pinyin</h2>
                  <p className="text-slate-400">Meaning: {currentExercise.meaning}</p>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold mb-4">{(currentExercise as InitialExercise).pinyin}</div>
                  <h2 className="text-2xl font-bold mb-2">Select the correct character</h2>
                  <p className="text-slate-400">Meaning: {currentExercise.meaning}</p>
                </>
              )}

              <Button variant="outline" className="mt-4 bg-transparent">
                <Volume2 className="w-5 h-5 mr-2" />
                Play Audio
              </Button>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`p-6 text-2xl font-bold ${
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
                <p className="text-sm text-slate-300">
                  {exerciseType === "tones"
                    ? `${(currentExercise as ToneExercise).character} is pronounced "${(currentExercise as ToneExercise).pinyin}"`
                    : `"${(currentExercise as InitialExercise).pinyin}" is written as ${(currentExercise as InitialExercise).character}`}
                </p>
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
                <div className="flex flex-col items-center gap-3">
                  {submitError && (
                    <div className="text-sm text-red-300 border border-red-500/40 rounded-lg px-4 py-2">
                      {submitError}
                    </div>
                  )}
                  <Button onClick={handleNext} className="px-8 py-3 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {currentIndex < totalExercises - 1 ? "CONTINUE" : isSubmitting ? "SAVING..." : "FINISH"}
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
