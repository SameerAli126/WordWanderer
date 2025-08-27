"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { WordBank } from "@/components/word-bank"

export default function VocabularyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Vocabulary Bank
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <WordBank />
      </div>
    </div>
  )
}
