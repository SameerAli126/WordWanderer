"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { MarketingNavbar } from "@/components/marketing/marketing-navbar"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed")
      }

      router.push("/app")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col">
      <MarketingNavbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="border-slate-800/60 bg-slate-950/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Welcome back</CardTitle>
              <CardDescription className="text-slate-300">
                Sign in to continue your WordWanderer journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Login failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-2 text-sm text-slate-300">
                <Link href="/forgot-password" className="text-emerald-300 hover:text-emerald-200">
                  Forgot password?
                </Link>
                <div>
                  New here?{" "}
                  <Link href="/register" className="text-emerald-300 hover:text-emerald-200">
                    Create an account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
