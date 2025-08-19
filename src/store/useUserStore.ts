import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserCourse, Achievement, StudySession } from '@/types'
import toast from 'react-hot-toast'
import { apiService } from '@/lib/api'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  currentCourse: UserCourse | null
  studySessions: StudySession[]

  // Actions
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, displayName: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateXP: (xp: number) => void
  updateStreak: (streak: number) => void
  setCurrentCourse: (course: UserCourse) => void
  addAchievement: (achievement: Achievement) => void
  addStudySession: (session: StudySession) => void
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentCourse: null,
      studySessions: [],

      setUser: (user) => set({ user, isAuthenticated: true }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const data = await apiService.login(email, password)

          if (data.success) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false
            })
            toast.success('Welcome back!')
            return true
          } else {
            toast.error(data.message || 'Login failed')
            set({ isLoading: false })
            return false
          }
        } catch (error: any) {
          console.error('Login error:', error)
          toast.error(error.message || 'Network error. Please try again.')
          set({ isLoading: false })
          return false
        }
      },

      register: async (email: string, username: string, displayName: string, password: string) => {
        set({ isLoading: true })
        try {
          const data = await apiService.register(email, username, displayName, password)

          if (data.success) {
            toast.success('Account created successfully! Please log in.')
            set({ isLoading: false })
            return true
          } else {
            toast.error(data.message || 'Registration failed')
            set({ isLoading: false })
            return false
          }
        } catch (error: any) {
          console.error('Registration error:', error)
          toast.error(error.message || 'Network error. Please try again.')
          set({ isLoading: false })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await apiService.logout()

          set({
            user: null,
            isAuthenticated: false,
            currentCourse: null,
            isLoading: false
          })
          toast.success('Logged out successfully')
        } catch (error) {
          console.error('Logout error:', error)
          set({ isLoading: false })
        }
      },

      checkAuth: async () => {
        try {
          const data = await apiService.getCurrentUser()

          if (data.success && data.user) {
            set({
              user: data.user,
              isAuthenticated: true
            })
          } else {
            set({
              user: null,
              isAuthenticated: false
            })
          }
        } catch (error) {
          console.error('Auth check error:', error)
          set({
            user: null,
            isAuthenticated: false
          })
        }
      },
      
      updateXP: (xp) => set((state) => ({
        user: state.user ? {
          ...state.user,
          totalXP: state.user.totalXP + xp
        } : null
      })),
      
      updateStreak: (streak) => set((state) => ({
        user: state.user ? {
          ...state.user,
          currentStreak: streak,
          longestStreak: Math.max(state.user.longestStreak, streak)
        } : null
      })),
      
      setCurrentCourse: (course) => set({ currentCourse: course }),
      
      addAchievement: (achievement) => set((state) => ({
        user: state.user ? {
          ...state.user,
          achievements: [...state.user.achievements, achievement]
        } : null
      })),
      
      addStudySession: (session) => set((state) => ({
        studySessions: [session, ...state.studySessions.slice(0, 29)] // Keep last 30 sessions
      })),
      
      updateUserPreferences: (preferences) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        } : null
      })),
    }),
    {
      name: 'wordwanderer-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentCourse: state.currentCourse,
        studySessions: state.studySessions,
      }),
    }
  )
)
