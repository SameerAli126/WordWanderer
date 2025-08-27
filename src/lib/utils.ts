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
