"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Users, Heart, Zap, Globe } from "lucide-react"

const jobOpenings = [
  {
    id: 1,
    title: "Senior Software Engineer - Mobile",
    department: "Engineering",
    location: "Pittsburgh, PA / Remote",
    type: "Full-time",
    description: "Build and maintain our iOS and Android apps used by millions of learners worldwide.",
    requirements: [
      "5+ years mobile development",
      "React Native or native iOS/Android",
      "Experience with large-scale apps",
    ],
    featured: true,
  },
  {
    id: 2,
    title: "Product Manager - Learning Experience",
    department: "Product",
    location: "Pittsburgh, PA / Remote",
    type: "Full-time",
    description: "Drive product strategy for our core learning features and user engagement.",
    requirements: ["3+ years product management", "EdTech or consumer app experience", "Data-driven decision making"],
    featured: true,
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design intuitive and delightful learning experiences for our global user base.",
    requirements: ["4+ years UX design", "Mobile-first design experience", "User research skills"],
    featured: false,
  },
  {
    id: 4,
    title: "Data Scientist - Learning Analytics",
    department: "Data Science",
    location: "Pittsburgh, PA / Remote",
    type: "Full-time",
    description: "Analyze learning patterns and optimize our educational algorithms.",
    requirements: ["PhD or Masters in relevant field", "Machine learning expertise", "Python/R proficiency"],
    featured: false,
  },
  {
    id: 5,
    title: "Content Creator - Chinese",
    department: "Content",
    location: "Remote",
    type: "Contract",
    description: "Create engaging Chinese language lessons and exercises for our platform.",
    requirements: ["Native Chinese speaker", "Teaching experience", "Creative writing skills"],
    featured: false,
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Pittsburgh, PA / Remote",
    type: "Full-time",
    description: "Maintain and scale our infrastructure serving millions of daily active users.",
    requirements: ["AWS/GCP experience", "Kubernetes knowledge", "CI/CD pipeline expertise"],
    featured: false,
  },
]

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness stipends",
  },
  {
    icon: Zap,
    title: "Professional Growth",
    description: "Learning budget, conference attendance, and mentorship programs",
  },
  {
    icon: Globe,
    title: "Remote-First",
    description: "Work from anywhere with flexible hours and home office setup budget",
  },
  {
    icon: Users,
    title: "Inclusive Culture",
    description: "Diverse team, employee resource groups, and inclusive hiring practices",
  },
]

const departments = ["All", "Engineering", "Product", "Design", "Data Science", "Content", "Marketing"]

export default function CareersPage() {
  const router = useRouter()

  const featuredJobs = jobOpenings.filter((job) => job.featured)
  const regularJobs = jobOpenings.filter((job) => !job.featured)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Users className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Careers at WordWanderer
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Join Our Mission</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Help us make language learning free, fun, and accessible to everyone. Work with a passionate team building
            products used by millions worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">500M+</div>
              <div className="text-slate-400 text-sm">Users served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1000+</div>
              <div className="text-slate-400 text-sm">Team members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">40+</div>
              <div className="text-slate-400 text-sm">Countries</div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">Why Work With Us</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 text-center">
                <CardContent className="p-6">
                  <benefit.icon className="w-8 h-8 text-green-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-3">{benefit.title}</h4>
                  <p className="text-slate-400 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-green-400 hover:text-green-400 bg-transparent"
            >
              {dept}
            </Button>
          ))}
        </div>

        {/* Featured Jobs */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Featured Positions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{job.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Featured</Badge>
                  </div>

                  <p className="text-slate-300 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <h5 className="font-semibold text-white mb-2">Requirements:</h5>
                    <ul className="text-slate-400 text-sm space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Jobs */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">All Open Positions</h3>
          <div className="space-y-4">
            {regularJobs.map((job) => (
              <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-bold text-white text-lg">{job.title}</h4>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {job.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-slate-300">{job.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="ml-4 border-slate-600 hover:border-green-400 hover:text-green-400 bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Don't See Your Role?</h3>
            <p className="text-green-100 mb-6">
              We're always looking for talented people to join our team. Send us your resume and tell us how you'd like
              to contribute.
            </p>
            <Button className="bg-white text-green-600 hover:bg-gray-100">Send General Application</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
