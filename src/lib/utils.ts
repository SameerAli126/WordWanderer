import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function calculateXP(level: number): number {
  return level * 100 + (level - 1) * 50
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  let totalXP = 0
  
  while (totalXP + calculateXP(level) <= xp) {
    totalXP += calculateXP(level)
    level++
  }
  
  return level
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP)
  return calculateXP(currentLevel + 1)
}

export function getProgressToNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP)
  const xpForCurrentLevel = calculateXP(currentLevel)
  const xpForNextLevel = calculateXP(currentLevel + 1)
  
  const currentLevelXP = currentXP - (currentLevel - 1) * xpForCurrentLevel
  return (currentLevelXP / xpForNextLevel) * 100
}

export function generateStreakMessage(streak: number): string {
  if (streak === 0) return "Start your learning streak today!"
  if (streak === 1) return "Great start! Keep it going!"
  if (streak < 7) return `${streak} day streak! You're building momentum!`
  if (streak < 30) return `${streak} day streak! You're on fire! 🔥`
  if (streak < 100) return `${streak} day streak! Incredible dedication! 🌟`
  return `${streak} day streak! You're a language learning legend! 🏆`
}

export function getRandomEncouragement(): string {
  const encouragements = [
    "You're doing great!",
    "Keep up the excellent work!",
    "Every lesson brings you closer to fluency!",
    "You're making amazing progress!",
    "Learning a language is a journey, and you're on the right path!",
    "Consistency is key, and you're nailing it!",
    "Your dedication is inspiring!",
    "Small steps lead to big achievements!",
  ]
  
  return encouragements[Math.floor(Math.random() * encouragements.length)]
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getLanguageFlag(languageCode: string): string {
  const flags: Record<string, string> = {
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'zh': '🇨🇳',
    'ar': '🇸🇦',
    'hi': '🇮🇳',
    'en': '🇺🇸',
  }
  
  return flags[languageCode] || '🌍'
}

export function getDifficultyColor(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (difficulty) {
    case 'beginner':
      return 'text-success-600 bg-success-100'
    case 'intermediate':
      return 'text-warning-600 bg-warning-100'
    case 'advanced':
      return 'text-error-600 bg-error-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}
