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
import { setStoredToken } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.displayName) {
      setError("Please fill out all required fields.")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return false
    }
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          displayName: formData.displayName,
          password: formData.password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.token) {
        setStoredToken(data.token)
      }

      setRecoveryCode(data.recoveryCode || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceedToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col">
      <MarketingNavbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <Card className="border-slate-800/60 bg-slate-950/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Create your account</CardTitle>
              <CardDescription className="text-slate-300">
                Save your 9-digit recovery code. You will use it to reset your password later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recoveryCode && (
                <Alert className="mb-6 border-emerald-500/40 bg-emerald-500/10">
                  <AlertTitle className="text-emerald-200">Recovery code</AlertTitle>
                  <AlertDescription className="text-emerald-100">
                    Your recovery code is <span className="font-semibold">{recoveryCode}</span>. Store it safely.
                  </AlertDescription>
                  <Button
                    type="button"
                    className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900"
                    onClick={handleProceedToLogin}
                  >
                    Continue to sign in
                  </Button>
                </Alert>
              )}

              {!recoveryCode && (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Registration failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-200">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-slate-200">
                      Display name
                    </Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      autoComplete="name"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Your display name"
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
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password (8+ characters)"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repeat your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              )}

              {!recoveryCode && (
                <div className="mt-6 text-sm text-slate-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-300 hover:text-emerald-200">
                    Sign in
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
