"use client"

import { Button } from "@/components/ui/button"
import { Check, Lock } from "lucide-react"

interface LevelButtonProps {
  label: string
  completed: boolean
  locked: boolean
  current?: boolean
  onClick?: () => void
}

export function LevelButton({ label, completed, locked, current, onClick }: LevelButtonProps) {
  const getButtonStyle = () => {
    if (completed) {
      return "bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-yellow-900 border-yellow-500 shadow-lg hover:shadow-xl"
    }
    if (current) {
      return "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border-green-400 shadow-lg"
    }
    if (locked) {
      return "bg-slate-600 text-slate-400 cursor-not-allowed border-slate-500"
    }
    return "bg-gradient-to-br from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white border-slate-600 shadow-md hover:shadow-lg"
  }

  return (
    <Button
      size="lg"
      disabled={locked}
      className={`w-16 h-16 rounded-full border-4 transition-all duration-300 hover:scale-105 ${getButtonStyle()}`}
      onClick={onClick}
    >
      {completed ? (
        <Check className="w-6 h-6" />
      ) : locked ? (
        <Lock className="w-6 h-6" />
      ) : (
        <span className="text-lg font-bold">{label}</span>
      )}
    </Button>
  )
}
