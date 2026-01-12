"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle, XCircle } from "lucide-react"

const pronunciationExercises = [
  {
    id: 1,
    character: "你好",
    pinyin: "nǐ hǎo",
    meaning: "hello",
    audioUrl: "/audio/nihao.mp3",
  },
  {
    id: 2,
    character: "谢谢",
    pinyin: "xiè xiè",
    meaning: "thank you",
    audioUrl: "/audio/xiexie.mp3",
  },
  {
    id: 3,
    character: "再见",
    pinyin: "zài jiàn",
    meaning: "goodbye",
    audioUrl: "/audio/zaijian.mp3",
  },
]

export function VoicePractice() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [feedback, setFeedback] = useState<{ score: number; message: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const exercise = pronunciationExercises[currentExercise]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        // Here you would typically send the audio to a speech recognition service
        analyzePronunciation(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setFeedback(null)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setHasRecorded(true)
    }
  }

  const analyzePronunciation = async (audioBlob: Blob) => {
    // Simulate AI pronunciation analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const score = Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    const messages = [
      "Great pronunciation! Your tones are spot on.",
      "Good effort! Try to emphasize the second tone more.",
      "Excellent! Your pronunciation is very clear.",
      "Nice work! The rhythm sounds natural.",
      "Well done! Your accent is improving.",
    ]

    setFeedback({
      score,
      message: messages[Math.floor(Math.random() * messages.length)],
    })
  }

  const playAudio = () => {
    setIsPlaying(true)
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const nextExercise = () => {
    if (currentExercise < pronunciationExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setHasRecorded(false)
      setFeedback(null)
    }
  }

  const resetExercise = () => {
    setHasRecorded(false)
    setFeedback(null)
  }

  const getFeedbackColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    return "text-orange-400"
  }

  const getFeedbackIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />
    return <XCircle className="w-5 h-5 text-orange-400" />
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Voice Practice</h3>
            <p className="text-slate-400">Practice your pronunciation with AI feedback</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-white">
                {currentExercise + 1} / {pronunciationExercises.length}
              </span>
            </div>
            <Progress value={((currentExercise + 1) / pronunciationExercises.length) * 100} className="h-2" />
          </div>

          {/* Exercise */}
          <div className="space-y-4">
            <div className="text-6xl font-bold text-white mb-2">{exercise.character}</div>
            <div className="text-2xl text-green-400 mb-1">{exercise.pinyin}</div>
            <div className="text-slate-400">"{exercise.meaning}"</div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={playAudio}
              disabled={isPlaying}
              className="border-slate-600 hover:border-slate-500 bg-transparent"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>

            <Button
              variant="outline"
              onClick={resetExercise}
              className="border-slate-600 hover:border-slate-500 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Recording */}
          <div className="space-y-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full ${
                isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>

            <p className="text-slate-400 text-sm">
              {isRecording ? "Recording... Tap to stop" : "Tap to record your pronunciation"}
            </p>
          </div>

          {/* Feedback */}
          {feedback && (
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {getFeedbackIcon(feedback.score)}
                  <span className={`text-2xl font-bold ${getFeedbackColor(feedback.score)}`}>{feedback.score}%</span>
                </div>
                <p className="text-slate-300 text-sm">{feedback.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {hasRecorded && feedback && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetExercise}
                className="flex-1 border-slate-600 hover:border-slate-500 bg-transparent"
              >
                Try Again
              </Button>
              <Button
                onClick={nextExercise}
                disabled={currentExercise >= pronunciationExercises.length - 1}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {currentExercise >= pronunciationExercises.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
