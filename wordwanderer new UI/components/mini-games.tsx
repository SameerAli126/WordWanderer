"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Zap, Target, Clock, Star, Trophy } from "lucide-react"

const games = [
  {
    id: 1,
    title: "Character Match",
    description: "Match Chinese characters with their meanings",
    icon: "🎯",
    difficulty: "Easy",
    xpReward: 25,
    timeLimit: "2 min",
    bestScore: 850,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    title: "Tone Master",
    description: "Identify the correct tone for each character",
    icon: "🎵",
    difficulty: "Medium",
    xpReward: 40,
    timeLimit: "3 min",
    bestScore: 1240,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Speed Pinyin",
    description: "Type pinyin as fast as you can",
    icon: "⚡",
    difficulty: "Hard",
    xpReward: 60,
    timeLimit: "90 sec",
    bestScore: 2100,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    title: "Word Builder",
    description: "Build words from character components",
    icon: "🧩",
    difficulty: "Medium",
    xpReward: 35,
    timeLimit: "4 min",
    bestScore: 980,
    color: "from-orange-500 to-red-500",
  },
]

const leaderboard = [
  { rank: 1, name: "DragonMaster", score: 2850, avatar: "🐉" },
  { rank: 2, name: "PinyinPro", score: 2720, avatar: "🎯" },
  { rank: 3, name: "ToneTiger", score: 2650, avatar: "🐅" },
  { rank: 4, name: "You", score: 2100, avatar: "👨‍💻", isUser: true },
  { rank: 5, name: "WordWiz", score: 1980, avatar: "🧙‍♂️" },
]

export function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">("menu")
  const [currentScore, setCurrentScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600"
      case "Medium":
        return "bg-yellow-600"
      case "Hard":
        return "bg-red-600"
      default:
        return "bg-slate-600"
    }
  }

  const startGame = (gameId: number) => {
    setSelectedGame(gameId)
    setGameState("playing")
    setCurrentScore(0)
    setTimeLeft(120)

    // Simulate game progression
    const gameTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimer)
          setGameState("results")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simulate score increases
    const scoreTimer = setInterval(() => {
      setCurrentScore((prev) => prev + Math.floor(Math.random() * 50) + 10)
    }, 2000)

    setTimeout(() => {
      clearInterval(scoreTimer)
    }, 10000)
  }

  const resetGame = () => {
    setGameState("menu")
    setSelectedGame(null)
    setCurrentScore(0)
    setTimeLeft(120)
  }

  if (gameState === "playing" && selectedGame) {
    const game = games.find((g) => g.id === selectedGame)!

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Game Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{game.icon}</span>
                <h3 className="text-xl font-bold text-white">{game.title}</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetGame}
                className="border-slate-600 hover:border-slate-500 bg-transparent"
              >
                Exit
              </Button>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{currentScore}</div>
                <div className="text-slate-400 text-sm">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-slate-400 text-sm">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{game.bestScore}</div>
                <div className="text-slate-400 text-sm">Best Score</div>
              </div>
            </div>

            {/* Game Area */}
            <Card className={`bg-gradient-to-br ${game.color} border-0 min-h-[300px] flex items-center justify-center`}>
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎮</div>
                <h4 className="text-xl font-bold mb-2">Game in Progress</h4>
                <p className="text-white/80">Playing {game.title}...</p>
              </div>
            </Card>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">{Math.floor(((120 - timeLeft) / 120) * 100)}%</span>
              </div>
              <Progress value={((120 - timeLeft) / 120) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "results" && selectedGame) {
    const game = games.find((g) => g.id === selectedGame)!
    const isNewRecord = currentScore > game.bestScore

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Results Header */}
            <div className="space-y-2">
              <div className="text-4xl">{isNewRecord ? "🏆" : "🎉"}</div>
              <h3 className="text-2xl font-bold text-white">{isNewRecord ? "New Record!" : "Game Complete!"}</h3>
            </div>

            {/* Score Display */}
            <Card className={`bg-gradient-to-br ${game.color} border-0`}>
              <CardContent className="p-6 text-center text-white">
                <div className="text-4xl font-bold mb-2">{currentScore}</div>
                <div className="text-white/80">Final Score</div>
                {isNewRecord && (
                  <Badge className="bg-yellow-500 text-yellow-900 mt-2">
                    <Star className="w-3 h-3 mr-1" />
                    New Personal Best!
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* XP Reward */}
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Zap className="w-5 h-5" />
              <span className="font-bold">+{game.xpReward} XP Earned!</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => startGame(game.id)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Play Again
              </Button>
              <Button
                variant="outline"
                onClick={resetGame}
                className="flex-1 border-slate-600 hover:border-slate-500 bg-transparent"
              >
                Back to Menu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Gamepad2 className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Mini Games</h2>
        <Badge className="bg-purple-600 text-white">Fun Learning</Badge>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card
            key={game.id}
            className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer hover:scale-105"
            onClick={() => startGame(game.id)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Game Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{game.icon}</div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{game.title}</h3>
                      <p className="text-slate-400 text-sm">{game.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getDifficultyColor(game.difficulty)} text-white`}>{game.difficulty}</Badge>
                </div>

                {/* Game Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-green-400">
                      <Zap className="w-3 h-3" />
                      <span>{game.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      <span>{game.timeLimit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy className="w-3 h-3" />
                    <span>{game.bestScore}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90`}>
                  <Target className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Global Leaderboard
          </h3>

          <div className="space-y-3">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  player.isUser ? "bg-blue-600/20 border border-blue-500/30" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1
                      ? "bg-yellow-500 text-yellow-900"
                      : player.rank === 2
                        ? "bg-slate-400 text-slate-900"
                        : player.rank === 3
                          ? "bg-orange-500 text-orange-900"
                          : "bg-slate-600 text-white"
                  }`}
                >
                  {player.rank}
                </div>

                <div className="text-2xl">{player.avatar}</div>

                <div className="flex-1">
                  <div className={`font-semibold ${player.isUser ? "text-blue-400" : "text-white"}`}>{player.name}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white">{player.score.toLocaleString()}</div>
                  <div className="text-slate-400 text-xs">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
