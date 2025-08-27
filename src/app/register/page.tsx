'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, isAuthenticated } = useUserStore()
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/new-dashboard')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required'
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be less than 50 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const success = await register(
      formData.email,
      formData.username,
      formData.displayName,
      formData.password
    )
    
    if (success) {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">WordWanderer</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join WordWanderer
          </h1>
          <p className="text-gray-600">
            Start your language learning adventure today
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-error-500 bg-error-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.username ? 'border-error-500 bg-error-50' : 'border-gray-300'
                    }`}
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-error-600">{errors.username}</p>
                )}
              </div>

              {/* Display Name Field */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.displayName ? 'border-error-500 bg-error-50' : 'border-gray-300'
                    }`}
                    placeholder="Your display name"
                    disabled={isLoading}
                  />
                </div>
                {errors.displayName && (
                  <p className="mt-1 text-sm text-error-600">{errors.displayName}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-error-500 bg-error-50' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-error-500 bg-error-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
