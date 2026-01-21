"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Volume2, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { hanziCharacters, type HanziCharacter } from "@/data/hanzi-data"
import { apiRequest } from "@/lib/api"

export function HanziPractice() {
  const router = useRouter()
  const [currentCharacter, setCurrentCharacter] = useState<HanziCharacter | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState<"recognition" | "writing" | "meaning">("recognition")
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [strokeIndex, setStrokeIndex] = useState(0)
  const [showStrokes, setShowStrokes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const startTimeRef = useRef(Date.now())
  const correctCountRef = useRef(0)

  const totalExercises = 10

  useEffect(() => {
    loadNextExercise()
  }, [currentIndex, practiceMode])

  const loadNextExercise = () => {
    if (currentIndex >= totalExercises) {
      return
    }

    const character = hanziCharacters[currentIndex % hanziCharacters.length]
    setCurrentCharacter(character)
    setStrokeIndex(0)
    setShowStrokes(false)

    // Generate options based on practice mode
    const wrongCharacters = hanziCharacters.filter((c) => c.id !== character.id).slice(0, 3)

    switch (practiceMode) {
      case "recognition":
        setOptions([character.pinyin, ...wrongCharacters.map((c) => c.pinyin)].sort(() => Math.random() - 0.5))
        break
      case "meaning":
        setOptions([character.meaning, ...wrongCharacters.map((c) => c.meaning)].sort(() => Math.random() - 0.5))
        break
      case "writing":
        setOptions([character.character, ...wrongCharacters.map((c) => c.character)].sort(() => Math.random() - 0.5))
        break
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!currentCharacter) return

    let correct = false
    switch (practiceMode) {
      case "recognition":
        correct = selectedAnswer === currentCharacter.pinyin
        break
      case "meaning":
        correct = selectedAnswer === currentCharacter.meaning
        break
      case "writing":
        correct = selectedAnswer === currentCharacter.character
        break
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
          practiceType: "hanzi",
          mode: practiceMode,
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

  const showStrokeOrder = () => {
    setShowStrokes(true)
    setStrokeIndex(0)
  }

  const nextStroke = () => {
    if (currentCharacter && strokeIndex < currentCharacter.strokeOrder.strokes.length - 1) {
      setStrokeIndex(strokeIndex + 1)
    }
  }

  const progress = ((currentIndex + 1) / totalExercises) * 100

  if (!currentCharacter) {
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

      {/* Practice Mode Selector */}
      <div className="flex justify-center p-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <Button
            variant={practiceMode === "recognition" ? "default" : "ghost"}
            className={`px-4 py-2 text-sm ${
              practiceMode === "recognition" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setPracticeMode("recognition")}
          >
            RECOGNITION
          </Button>
          <Button
            variant={practiceMode === "meaning" ? "default" : "ghost"}
            className={`px-4 py-2 text-sm ${
              practiceMode === "meaning" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setPracticeMode("meaning")}
          >
            MEANING
          </Button>
          <Button
            variant={practiceMode === "writing" ? "default" : "ghost"}
            className={`px-4 py-2 text-sm ${
              practiceMode === "writing" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setPracticeMode("writing")}
          >
            WRITING
          </Button>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              {practiceMode === "recognition" && (
                <>
                  <div className="text-8xl font-bold mb-4">{currentCharacter.character}</div>
                  <h2 className="text-2xl font-bold mb-2">Select the correct pinyin</h2>
                </>
              )}

              {practiceMode === "meaning" && (
                <>
                  <div className="text-8xl font-bold mb-4">{currentCharacter.character}</div>
                  <div className="text-2xl mb-4">{currentCharacter.pinyin}</div>
                  <h2 className="text-2xl font-bold mb-2">Select the correct meaning</h2>
                </>
              )}

              {practiceMode === "writing" && (
                <>
                  <div className="text-2xl mb-4">{currentCharacter.pinyin}</div>
                  <div className="text-xl mb-4">"{currentCharacter.meaning}"</div>
                  <h2 className="text-2xl font-bold mb-2">Select the correct character</h2>
                </>
              )}

              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Play Audio
                </Button>
                <Button variant="outline" onClick={showStrokeOrder}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Stroke Order
                </Button>
              </div>
            </div>

            {/* Stroke Order Display */}
            {showStrokes && (
              <div className="mb-8 p-4 bg-slate-700 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2">
                    {currentCharacter.strokeOrder.strokes.slice(0, strokeIndex + 1).join("")}
                  </div>
                  <p className="text-sm text-slate-400">{currentCharacter.strokeOrder.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Stroke {strokeIndex + 1} of {currentCharacter.strokes}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={nextStroke}
                    disabled={strokeIndex >= currentCharacter.strokeOrder.strokes.length - 1}
                  >
                    Next Stroke
                  </Button>
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`p-6 ${practiceMode === "writing" ? "text-4xl" : "text-xl"} font-bold ${
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
                <div className="text-sm text-slate-300">
                  <p>
                    <strong>{currentCharacter.character}</strong> ({currentCharacter.pinyin}) means "
                    {currentCharacter.meaning}"
                  </p>
                  <p className="mt-2">Examples:</p>
                  <ul className="list-disc list-inside mt-1">
                    {currentCharacter.examples.slice(0, 2).map((example, i) => (
                      <li key={i}>
                        {example.word} ({example.pinyin}) - {example.meaning}
                      </li>
                    ))}
                  </ul>
                </div>
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
