"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Science Behind Spaced Repetition in Language Learning",
    excerpt:
      "Discover how our algorithm uses spaced repetition to help you remember vocabulary more effectively and for longer periods.",
    author: "Dr. Sarah Chen",
    date: "March 15, 2024",
    category: "Research",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=400&text=Spaced+Repetition",
    featured: true,
  },
  {
    id: 2,
    title: "New Feature: AI-Powered Conversation Practice",
    excerpt:
      "Practice real conversations with our new AI tutor that adapts to your learning level and provides instant feedback.",
    author: "Mike Rodriguez",
    date: "March 12, 2024",
    category: "Product",
    readTime: "3 min read",
    image: "/placeholder.svg?height=200&width=400&text=AI+Conversations",
    featured: true,
  },
  {
    id: 3,
    title: "Learning Chinese: Tips from Native Speakers",
    excerpt:
      "Get insider tips from native Chinese speakers on the most effective ways to master tones, characters, and cultural nuances.",
    author: "Li Wei",
    date: "March 10, 2024",
    category: "Tips",
    readTime: "7 min read",
    image: "/placeholder.svg?height=200&width=400&text=Chinese+Tips",
    featured: false,
  },
  {
    id: 4,
    title: "WordWanderer for Schools: Transforming Language Education",
    excerpt: "How educators worldwide are using WordWanderer to enhance their language curriculum and engage students.",
    author: "Emma Thompson",
    date: "March 8, 2024",
    category: "Education",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400&text=Schools",
    featured: false,
  },
  {
    id: 5,
    title: "The Psychology of Gamification in Learning",
    excerpt: "Explore how game elements like streaks, XP, and achievements make learning more engaging and effective.",
    author: "Dr. James Park",
    date: "March 5, 2024",
    category: "Research",
    readTime: "8 min read",
    image: "/placeholder.svg?height=200&width=400&text=Gamification",
    featured: false,
  },
  {
    id: 6,
    title: "Community Spotlight: Learner Success Stories",
    excerpt:
      "Read inspiring stories from our community members who achieved their language learning goals with WordWanderer.",
    author: "Anna Martinez",
    date: "March 3, 2024",
    category: "Community",
    readTime: "4 min read",
    image: "/placeholder.svg?height=200&width=400&text=Success+Stories",
    featured: false,
  },
]

const categories = ["All", "Research", "Product", "Tips", "Education", "Community"]

export default function BlogPage() {
  const router = useRouter()

  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          WordWanderer Blog
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Learn, Discover, Grow</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Insights, tips, and stories from the world of language learning
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-green-400 hover:text-green-400 bg-transparent"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Posts */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Featured Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              >
                <CardContent className="p-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        {post.category}
                      </Badge>
                      <span className="text-slate-400 text-sm">{post.readTime}</span>
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                        <Calendar className="w-4 h-4 ml-2" />
                        <span>{post.date}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regular Posts */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              >
                <CardContent className="p-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {post.category}
                      </Badge>
                      <span className="text-slate-400 text-xs">{post.readTime}</span>
                    </div>
                    <h4 className="font-bold text-white mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-green-100 mb-6">
              Get the latest language learning tips and WordWanderer updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white text-slate-900"
              />
              <Button className="bg-white text-green-600 hover:bg-gray-100">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
