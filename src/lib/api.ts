const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// API Response types
interface LoginResponse {
  success: boolean
  user?: any
  message?: string
}

interface RegisterResponse {
  success: boolean
  user?: any
  message?: string
}

interface UserResponse {
  success: boolean
  user?: any
  message?: string
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, username: string, displayName: string, password: string): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, displayName, password }),
    })
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/auth/me')
  }

  // Courses endpoints
  async getCourses(params?: {
    difficulty?: string
    language?: string
    search?: string
    sort?: string
    limit?: number
    page?: number
  }) {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request(`/courses${query ? `?${query}` : ''}`)
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`)
  }

  async getPopularCourses(limit: number = 6) {
    return this.request(`/courses/popular?limit=${limit}`)
  }

  // Lessons endpoints
  async getLessons(courseId: string, unitId?: string) {
    const params = new URLSearchParams({ courseId })
    if (unitId) params.append('unitId', unitId)
    return this.request(`/lessons?${params}`)
  }

  async getLesson(id: string) {
    return this.request(`/lessons/${id}`)
  }

  async getNextLesson(id: string) {
    return this.request(`/lessons/${id}/next`)
  }

  async getPreviousLesson(id: string) {
    return this.request(`/lessons/${id}/previous`)
  }

  // Progress endpoints
  async recordLessonCompletion(data: {
    lessonId: string
    accuracy: number
    timeSpent: number
    xpEarned: number
    questions: any[]
  }) {
    return this.request('/progress/lesson-complete', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProgressStats() {
    return this.request('/progress/stats')
  }

  async enrollInCourse(courseId: string) {
    return this.request('/progress/enroll-course', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    })
  }

  async getUserCourses() {
    return this.request('/progress/courses')
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile')
  }

  async updateUserProfile(data: {
    displayName?: string
    avatar?: string
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateUserPreferences(preferences: {
    dailyGoal?: number
    soundEnabled?: boolean
    notificationsEnabled?: boolean
    theme?: 'light' | 'dark' | 'auto'
  }) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  async addXP(xp: number) {
    return this.request('/users/add-xp', {
      method: 'POST',
      body: JSON.stringify({ xp }),
    })
  }

  async updateStreak() {
    return this.request('/users/update-streak', {
      method: 'POST',
    })
  }

  async getLeaderboard(limit: number = 10, type: 'xp' | 'streak' = 'xp') {
    return this.request(`/users/leaderboard?limit=${limit}&type=${type}`)
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
export default apiService
