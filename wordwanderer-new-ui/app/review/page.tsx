"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api"

interface ReviewItem {
  itemId: string
  lessonId: string
  prompt: string
  correctAnswer: string
  type: string
}

interface ReviewQueueResponse {
  items: ReviewItem[]
  totalDue: number
}

const normalize = (value: string) => value.trim().toLowerCase()

export default function ReviewPage() {
  const router = useRouter()
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const response = await apiRequest<ReviewQueueResponse>("/api/progress/review-queue?limit=20")
        setQueue(response.items || [])
        setError(null)
      } catch (queueError) {
        setError(queueError instanceof Error ? queueError.message : "Unable to load review queue.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadQueue()
  }, [])

  const currentItem = queue[currentIndex]

  const handleCheck = async () => {
    if (!currentItem) {
      return
    }
    const correct = normalize(answer) === normalize(currentItem.correctAnswer)
    setIsCorrect(correct)
    setFeedback(correct ? "Nice! Keep it going." : `Correct answer: ${currentItem.correctAnswer}`)

    try {
      await apiRequest("/api/progress/review-complete", {
        method: "POST",
        body: JSON.stringify({
          itemId: currentItem.itemId,
          lessonId: currentItem.lessonId,
          userAnswer: answer,
          isCorrect: correct,
        }),
      })
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Unable to save review.")
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setIsCorrect(null)
    setAnswer("")
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      router.push("/app?view=learn")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading reviews...
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>No reviews due right now.</p>
          <Button onClick={() => router.push("/app?view=learn")}>Back to lessons</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-xl bg-slate-800 border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="text-sm text-slate-400">Review {currentIndex + 1} of {queue.length}</div>
          <h1 className="text-xl font-semibold">{currentItem.prompt}</h1>

          <Input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
            className="bg-slate-900/60 border-slate-600 text-white"
          />

          {feedback && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                isCorrect ? "border-green-500/60 bg-green-500/10 text-green-200" : "border-red-500/60 bg-red-500/10 text-red-200"
              }`}
            >
              {feedback}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/app?view=learn")} className="border-slate-600">
              Exit
            </Button>
            {feedback ? (
              <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900">
                {currentIndex < queue.length - 1 ? "Next" : "Finish"}
              </Button>
            ) : (
              <Button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-500">
                Check
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
