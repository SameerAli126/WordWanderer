import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Language flag utility
export function getLanguageFlag(language: string): string {
  const flags: Record<string, string> = {
    'chinese': '🇨🇳',
    'spanish': '🇪🇸',
    'french': '🇫🇷',
    'german': '🇩🇪',
    'japanese': '🇯🇵',
    'korean': '🇰🇷',
    'italian': '🇮🇹',
    'portuguese': '🇵🇹',
    'russian': '🇷🇺',
    'arabic': '🇸🇦',
  }
  return flags[language.toLowerCase()] || '🌍'
}

// Difficulty color utility
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    'beginner': 'text-green-600 bg-green-100',
    'intermediate': 'text-yellow-600 bg-yellow-100',
    'advanced': 'text-red-600 bg-red-100',
    'expert': 'text-purple-600 bg-purple-100',
  }
  return colors[difficulty.toLowerCase()] || 'text-gray-600 bg-gray-100'
}

// Random encouragement utility
export function getRandomEncouragement(): string {
  const encouragements = [
    "Great job! 🎉",
    "Excellent work! ⭐",
    "You're doing amazing! 🚀",
    "Keep it up! 💪",
    "Fantastic! 🌟",
    "Well done! 👏",
    "Outstanding! 🏆",
    "Perfect! ✨",
    "Incredible! 🎯",
    "Superb! 🔥"
  ]
  return encouragements[Math.floor(Math.random() * encouragements.length)]
}

// Time formatting utility
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `${minutes}m`
  }
  return `${minutes}m ${remainingSeconds}s`
}

// Streak message generator
export function generateStreakMessage(streak: number): string {
  if (streak === 0) {
    return "Start your learning streak today!"
  } else if (streak === 1) {
    return "Great start! Keep it going!"
  } else if (streak < 7) {
    return `${streak} days strong! You're building a habit!`
  } else if (streak < 30) {
    return `Amazing ${streak}-day streak! You're on fire! 🔥`
  } else if (streak < 100) {
    return `Incredible ${streak}-day streak! You're a learning machine!`
  } else {
    return `Legendary ${streak}-day streak! You're unstoppable! 🏆`
  }
}

// Number formatting utility
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  } else {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
}

// XP and level utilities
export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function getXPForNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp)
  return currentLevel * 100
}

export function getProgressToNextLevel(xp: number): number {
  const currentLevelXP = (getLevelFromXP(xp) - 1) * 100
  const nextLevelXP = getLevelFromXP(xp) * 100
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return Math.min(progress, 100)
}
