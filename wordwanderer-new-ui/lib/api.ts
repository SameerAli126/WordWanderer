export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    const message = data.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data as T
}
