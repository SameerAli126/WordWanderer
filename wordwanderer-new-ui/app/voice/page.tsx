"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic } from "lucide-react"
import { VoicePractice } from "@/components/voice-practice"

export default function VoicePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Mic className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Voice Practice
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <VoicePractice />
      </div>
    </div>
  )
}
