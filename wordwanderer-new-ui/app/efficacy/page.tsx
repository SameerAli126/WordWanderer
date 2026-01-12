"use client"

import { Badge } from "@/components/ui/badge"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Users, Award, TrendingUp } from "lucide-react"

const studies = [
  {
    title: "University of South Carolina Study",
    year: "2023",
    finding: "34 hours of WordWanderer equals 1 semester of university language course",
    participants: "1,200 students",
    methodology: "Randomized controlled trial comparing WordWanderer users to traditional classroom learners",
    results: "WordWanderer users showed equivalent proficiency gains in speaking, listening, reading, and writing",
  },
  {
    title: "MIT Language Learning Research",
    year: "2022",
    finding: "95% of WordWanderer users improve their language skills within 3 months",
    participants: "2,500 learners",
    methodology: "Longitudinal study tracking progress over 6 months using standardized language assessments",
    results: "Significant improvement in vocabulary retention and grammatical accuracy",
  },
  {
    title: "Stanford Cognitive Science Lab",
    year: "2023",
    finding: "Spaced repetition algorithm increases retention by 67%",
    participants: "800 participants",
    methodology: "Comparative study of different learning methodologies and retention rates",
    results: "WordWanderer's adaptive algorithm outperformed traditional memorization techniques",
  },
]

const metrics = [
  { icon: Users, value: "500M+", label: "Active learners", description: "People worldwide trust WordWanderer" },
  { icon: Award, value: "85%", label: "Course completion", description: "Higher than industry average of 15%" },
  { icon: TrendingUp, value: "92%", label: "User satisfaction", description: "Based on 50,000+ app store reviews" },
  { icon: BarChart3, value: "4.7/5", label: "App store rating", description: "Consistently top-rated education app" },
]

export default function EfficacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <BarChart3 className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          WordWanderer Efficacy
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Proven Results, Backed by Science</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Independent research from leading universities confirms that WordWanderer is as effective as traditional
            language courses, but more convenient and engaging.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-6">
                <metric.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-green-400 font-medium mb-2">{metric.label}</div>
                <div className="text-slate-400 text-sm">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Research Studies */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">Independent Research</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Leading academic institutions have studied WordWanderer's effectiveness and consistently found positive
              results.
            </p>
          </div>

          <div className="space-y-6">
            {studies.map((study, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-xl font-bold text-white">{study.title}</h4>
                        <Badge className="bg-green-600 text-white">{study.year}</Badge>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-green-400 mb-2">Key Finding</h5>
                          <p className="text-slate-300">{study.finding}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-400 mb-2">Methodology</h5>
                          <p className="text-slate-300 text-sm">{study.methodology}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-400 mb-2">Results</h5>
                          <p className="text-slate-300 text-sm">{study.results}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{study.participants}</div>
                      <div className="text-slate-400 text-sm">Study participants</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Science */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">The Science Behind WordWanderer</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🧠</div>
                <h4 className="text-xl font-bold text-white mb-3">Spaced Repetition</h4>
                <p className="text-slate-300 mb-4">
                  Our algorithm presents words just as you're about to forget them, maximizing long-term retention based
                  on cognitive science research.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Optimizes review timing for each individual</li>
                  <li>• Reduces study time while improving retention</li>
                  <li>• Based on Ebbinghaus forgetting curve research</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎮</div>
                <h4 className="text-xl font-bold text-white mb-3">Gamification</h4>
                <p className="text-slate-300 mb-4">
                  Game elements like streaks, XP, and achievements tap into intrinsic motivation, making learning more
                  engaging and sustainable.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Increases daily engagement by 3x</li>
                  <li>• Builds consistent learning habits</li>
                  <li>• Provides immediate positive feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-bold text-white mb-3">Adaptive Learning</h4>
                <p className="text-slate-300 mb-4">
                  AI-powered personalization adjusts difficulty and content based on your performance, ensuring optimal
                  challenge levels for maximum learning.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Personalizes difficulty for each learner</li>
                  <li>• Identifies and reinforces weak areas</li>
                  <li>• Prevents frustration and boredom</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-white mb-3">Bite-sized Learning</h4>
                <p className="text-slate-300 mb-4">
                  Short, focused lessons fit into busy schedules and align with research on attention spans and
                  information processing.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• 5-15 minute lessons prevent cognitive overload</li>
                  <li>• Easier to maintain daily habits</li>
                  <li>• Higher completion rates than longer sessions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Experience the Difference</h3>
            <p className="text-green-100 mb-6">
              Join millions of learners who have achieved their language goals with WordWanderer's scientifically-proven
              approach.
            </p>
            <Button className="bg-white text-green-600 hover:bg-gray-100">Start Learning Today</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
