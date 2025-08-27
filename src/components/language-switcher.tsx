"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Globe, Star, Lock, CheckCircle } from "lucide-react"

interface Language {
  code: string
  name: string
  flag: string
  progress: number
  isUnlocked: boolean
  isActive: boolean
}

interface LanguageSwitcherProps {
  isOpen: boolean
  onClose: () => void
  onLanguageChange: (language: string) => void
}

export function LanguageSwitcher({ isOpen, onClose, onLanguageChange }: LanguageSwitcherProps) {
  const [languages] = useState<Language[]>([
    { code: "zh", name: "Chinese", flag: "🇨🇳", progress: 75, isUnlocked: true, isActive: true },
    { code: "es", name: "Spanish", flag: "🇪🇸", progress: 45, isUnlocked: true, isActive: false },
    { code: "fr", name: "French", flag: "🇫🇷", progress: 20, isUnlocked: true, isActive: false },
    { code: "de", name: "German", flag: "🇩🇪", progress: 0, isUnlocked: false, isActive: false },
    { code: "ja", name: "Japanese", flag: "🇯🇵", progress: 0, isUnlocked: false, isActive: false },
    { code: "ko", name: "Korean", flag: "🇰🇷", progress: 0, isUnlocked: false, isActive: false },
  ])

  const handleLanguageSelect = (language: Language) => {
    if (language.isUnlocked) {
      onLanguageChange(language.code)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-blue-400" />
            Choose Language
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                language.isActive
                  ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/50"
                  : language.isUnlocked
                    ? "bg-slate-800/50 border-slate-600 hover:border-slate-500"
                    : "bg-slate-800/30 border-slate-700 opacity-60 cursor-not-allowed"
              }`}
              onClick={() => handleLanguageSelect(language)}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{language.flag}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{language.name}</h3>
                    {language.isActive && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {!language.isUnlocked && <Lock className="w-4 h-4 text-slate-500" />}
                  </div>

                  {language.isUnlocked ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{language.progress}%</span>
                      </div>
                      <Progress value={language.progress} className="h-2" />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Complete more lessons to unlock</p>
                  )}
                </div>

                {language.progress > 50 && <Star className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
