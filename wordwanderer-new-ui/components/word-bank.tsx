"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Volume2, BookOpen, Filter } from "lucide-react"

const vocabulary = [
  {
    id: 1,
    character: "你好",
    pinyin: "nǐ hǎo",
    meaning: "hello",
    category: "Greetings",
    difficulty: "Beginner",
    learned: true,
    starred: true,
    lastReviewed: "2 days ago",
    strength: 95,
  },
  {
    id: 2,
    character: "谢谢",
    pinyin: "xiè xiè",
    meaning: "thank you",
    category: "Greetings",
    difficulty: "Beginner",
    learned: true,
    starred: false,
    lastReviewed: "1 day ago",
    strength: 88,
  },
  {
    id: 3,
    character: "学习",
    pinyin: "xué xí",
    meaning: "to study, to learn",
    category: "Education",
    difficulty: "Intermediate",
    learned: true,
    starred: true,
    lastReviewed: "3 hours ago",
    strength: 76,
  },
  {
    id: 4,
    character: "朋友",
    pinyin: "péng yǒu",
    meaning: "friend",
    category: "Relationships",
    difficulty: "Beginner",
    learned: true,
    starred: false,
    lastReviewed: "5 days ago",
    strength: 62,
  },
  {
    id: 5,
    character: "工作",
    pinyin: "gōng zuò",
    meaning: "work, job",
    category: "Career",
    difficulty: "Intermediate",
    learned: false,
    starred: false,
    lastReviewed: "Never",
    strength: 0,
  },
]

const categories = ["All", "Greetings", "Education", "Relationships", "Career", "Food", "Travel"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export function WordBank() {
  const [words, setWords] = useState(vocabulary)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  const toggleStar = (id: number) => {
    setWords(words.map((word) => (word.id === id ? { ...word, starred: !word.starred } : word)))
  }

  const playAudio = (word: string) => {
    // Simulate audio playback
    console.log(`Playing audio for: ${word}`)
  }

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.character.includes(searchQuery) ||
      word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || word.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || word.difficulty === selectedDifficulty
    const matchesStarred = !showStarredOnly || word.starred

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStarred
  })

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500"
    if (strength >= 60) return "bg-yellow-500"
    if (strength >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Word Bank</h2>
        <Badge className="bg-blue-600 text-white">
          {words.filter((w) => w.learned).length} / {words.length} learned
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search words, pinyin, or meanings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">Filters:</span>
              </div>

              {/* Category Filter */}
              <div className="flex gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-slate-600 hover:border-slate-500 bg-transparent"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div className="flex gap-1">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={
                      selectedDifficulty === difficulty
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-slate-600 hover:border-slate-500 bg-transparent"
                    }
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>

              {/* Starred Filter */}
              <Button
                variant={showStarredOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={
                  showStarredOnly
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "border-slate-600 hover:border-slate-500 bg-transparent"
                }
              >
                <Star className="w-3 h-3 mr-1" />
                Starred
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word List */}
      <div className="grid gap-4">
        {filteredWords.map((word) => (
          <Card key={word.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Character */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{word.character}</div>
                  <div className="text-green-400 text-sm">{word.pinyin}</div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">{word.meaning}</h3>
                    <Badge className={`${getDifficultyColor(word.difficulty)} text-white text-xs`}>
                      {word.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                      {word.category}
                    </Badge>
                  </div>

                  {word.learned && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Strength</span>
                        <span className="text-white">{word.strength}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`${getStrengthColor(word.strength)} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${word.strength}%` }}
                        ></div>
                      </div>
                      <div className="text-slate-500 text-xs">Last reviewed: {word.lastReviewed}</div>
                    </div>
                  )}

                  {!word.learned && <div className="text-slate-400 text-sm">Not learned yet</div>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playAudio(word.character)}
                    className="text-slate-400 hover:text-blue-400 hover:bg-transparent"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStar(word.id)}
                    className={`hover:bg-transparent ${
                      word.starred ? "text-yellow-400 hover:text-yellow-300" : "text-slate-400 hover:text-yellow-400"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${word.starred ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No words found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
