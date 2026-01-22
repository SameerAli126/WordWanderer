export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const TOKEN_KEY = "ww-token"
export const BALANCE_EVENT_NAME = "ww-balance-update"

export type BalanceUpdate = {
  gems?: number
  hearts?: number
  maxHearts?: number
  currentStreak?: number
  streakFreezes?: number
}

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null
  }
  return window.localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token)
  }
}

export const clearStoredToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

export const emitBalanceUpdate = (detail: BalanceUpdate) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BALANCE_EVENT_NAME, { detail }))
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    const message = data.message || `Request failed with status ${response.status}`
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return data as T
}
