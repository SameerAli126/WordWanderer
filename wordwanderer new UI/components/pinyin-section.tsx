"use client"

import { Button } from "@/components/ui/button"

export function PinyinSection() {
  return (
    <div className="text-center space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let's learn Pinyin!</h1>
        <p className="text-slate-300 text-lg">Get to know the sound system for Chinese</p>
      </div>

      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-bold rounded-xl"
        onClick={() => (window.location.href = "/practice/pinyin")}
      >
        LEARN PINYIN
      </Button>
    </div>
  )
}
