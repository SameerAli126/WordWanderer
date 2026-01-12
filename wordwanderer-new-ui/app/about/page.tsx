"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Globe, Award, Heart } from "lucide-react"

const stats = [
  { icon: Users, value: "500M+", label: "Learners worldwide" },
  { icon: Globe, value: "40+", label: "Languages offered" },
  { icon: Award, value: "#1", label: "Education app" },
  { icon: Heart, value: "15+", label: "Years of impact" },
]

const teamMembers = [
  {
    name: "Luis von Ahn",
    role: "CEO & Co-founder",
    bio: "Computer scientist and entrepreneur passionate about making education accessible to everyone.",
    image: "/placeholder.svg?height=120&width=120&text=LVA",
  },
  {
    name: "Severin Hacker",
    role: "CTO & Co-founder",
    bio: "Software engineer focused on building scalable learning platforms.",
    image: "/placeholder.svg?height=120&width=120&text=SH",
  },
  {
    name: "Ahn Bui",
    role: "VP of Engineering",
    bio: "Leading our technical teams to create innovative learning experiences.",
    image: "/placeholder.svg?height=120&width=120&text=AB",
  },
  {
    name: "Karin Tsai",
    role: "VP of Learning",
    bio: "Educational expert ensuring our courses are effective and engaging.",
    image: "/placeholder.svg?height=120&width=120&text=KT",
  },
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          About WordWanderer
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto text-4xl">
            🦉
          </div>
          <h2 className="text-4xl font-bold">Making language learning free, fun, and effective</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            WordWanderer is the world's most popular way to learn a language. It's 100% free, fun, and scientifically
            proven to work.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center">Our Mission</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-slate-300">
                We believe that education should be free, accessible, and effective for everyone. Our mission is to
                develop the best education in the world and make it universally available.
              </p>
              <p className="text-lg text-slate-300">
                Through gamification, personalized learning, and cutting-edge technology, we're making language learning
                an enjoyable journey rather than a chore.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h4 className="text-xl font-bold mb-2">Global Impact</h4>
              <p className="text-slate-300">Connecting cultures and breaking down language barriers worldwide</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">Meet Our Team</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500"
                  />
                  <h4 className="font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-green-400 text-sm mb-3">{member.role}</p>
                  <p className="text-slate-400 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-white mb-3">Effectiveness</h4>
                <p className="text-slate-400">
                  We use data and research to create the most effective learning experience possible.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h4 className="font-bold text-white mb-3">Fun</h4>
                <p className="text-slate-400">Learning should be enjoyable and engaging, not boring or stressful.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h4 className="font-bold text-white mb-3">Accessibility</h4>
                <p className="text-slate-400">
                  Quality education should be available to everyone, regardless of their background.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
