'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { BookOpen, Trophy, Flame, Zap, Play, Settings, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import XPDisplay from '@/components/gamification/XPDisplay'
import StreakDisplay from '@/components/gamification/StreakDisplay'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth, logout } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth().then(() => {
        if (!isAuthenticated) {
          router.push('/login')
        }
      })
    }
  }, [isAuthenticated, checkAuth, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">WordWanderer</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.displayName}!</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your language learning journey?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* XP Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <XPDisplay
              currentXP={user.totalXP}
              showLevel={true}
              showProgress={true}
              size="lg"
            />
          </motion.div>

          {/* Streak Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StreakDisplay
              currentStreak={user.currentStreak}
              longestStreak={user.longestStreak}
              size="lg"
            />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="flex flex-col justify-center items-center text-center">
                <Trophy className="w-12 h-12 text-warning-500 mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {user.achievements.length}
                </div>
                <div className="text-gray-600">Achievements</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/demo">
                  <Button
                    fullWidth
                    leftIcon={<Play className="w-5 h-5" />}
                    className="h-16 flex-col space-y-1"
                  >
                    <span>Try Demo</span>
                    <span className="text-xs opacity-75">Interactive Lesson</span>
                  </Button>
                </Link>
                
                <Link href="/courses">
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<BookOpen className="w-5 h-5" />}
                    className="h-16 flex-col space-y-1"
                  >
                    <span>Browse Courses</span>
                    <span className="text-xs opacity-75">Find Languages</span>
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Trophy className="w-5 h-5" />}
                  className="h-16 flex-col space-y-1"
                  onClick={() => alert('Achievements coming soon!')}
                >
                  <span>Achievements</span>
                  <span className="text-xs opacity-75">View Progress</span>
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Settings className="w-5 h-5" />}
                  className="h-16 flex-col space-y-1"
                  onClick={() => alert('Settings coming soon!')}
                >
                  <span>Settings</span>
                  <span className="text-xs opacity-75">Preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Your Learning Journey
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't started any lessons yet. Try our interactive demo or browse available courses.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/demo">
                    <Button leftIcon={<Play className="w-4 h-4" />}>
                      Try Demo Lesson
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="outline" leftIcon={<BookOpen className="w-4 h-4" />}>
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
