"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/contexts/theme-context"
import { apiRequest } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  SettingsIcon,
  Palette,
  Volume2,
  Bell,
  Shield,
  HelpCircle,
  User,
  Globe,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react"

export function Settings() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const savePreferences = async (payload: Record<string, unknown>) => {
    setIsSaving(true)
    setError(null)
    try {
      await apiRequest("/api/users/preferences", {
        method: "PUT",
        body: JSON.stringify(payload),
      })
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save settings."
      setError(message)
      toast({ title: "Settings not saved", description: message })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await apiRequest<{
          user: {
            preferences?: {
              soundEnabled?: boolean
              notificationsEnabled?: boolean
              theme?: string
            }
          }
        }>("/api/auth/me")
        const prefs = response.user.preferences || {}
        if (typeof prefs.soundEnabled === "boolean") {
          setSoundEnabled(prefs.soundEnabled)
        }
        if (typeof prefs.notificationsEnabled === "boolean") {
          setNotificationsEnabled(prefs.notificationsEnabled)
        }
        if (prefs.theme && prefs.theme !== theme) {
          setTheme(prefs.theme as typeof theme)
        }
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Unable to load settings."
        setError(message)
      }
    }

    void loadPreferences()
  }, [setTheme, theme])

  const themeOptions = [
    {
      id: "light" as const,
      name: "Light Mode",
      description: "Clean and bright interface",
      icon: Sun,
      preview: "bg-white border-gray-200",
    },
    {
      id: "dark" as const,
      name: "Dark Mode",
      description: "Easy on the eyes",
      icon: Moon,
      preview: "bg-slate-900 border-slate-700",
    },
    {
      id: "wanderer" as const,
      name: "Wanderer Mode",
      description: "Signature gradient theme",
      icon: Sparkles,
      preview: "bg-gradient-to-br from-green-400 to-blue-500",
    },
  ]

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "min-h-screen bg-gray-50 text-gray-900"
      case "wanderer":
        return "min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-blue-900/20 text-white"
      default:
        return "min-h-screen bg-slate-900 text-white"
    }
  }

  const getCardClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white border-gray-200 shadow-sm"
      case "wanderer":
        return "bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-green-400/30 shadow-xl backdrop-blur-sm"
      default:
        return "bg-slate-800 border-slate-700 shadow-lg"
    }
  }

  const getHeaderGradient = () => {
    switch (theme) {
      case "light":
        return "bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent"
      case "wanderer":
        return "bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
      default:
        return "bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
    }
  }

  return (
    <div className={getThemeClasses()}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-green-400" />
            <h1 className={`text-3xl font-bold ${getHeaderGradient()}`}>Settings</h1>
          </div>
          <p className={theme === "light" ? "text-gray-600" : "text-slate-400"}>
            Customize your WordWanderer experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <Card className={getCardClasses()}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold">Theme</h3>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Choose your preferred visual style
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-3 transition-all ${
                      theme === option.id
                        ? theme === "wanderer"
                          ? "border-green-400 bg-green-400/10"
                          : "border-green-500 bg-green-50"
                        : theme === "light"
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => {
                      setTheme(option.id)
                      void savePreferences({ theme: option.id })
                    }}
                  >
                    <div className={`w-12 h-8 rounded-md ${option.preview} border-2 border-white/20`}></div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <option.icon className="w-4 h-4" />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
                        {option.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className={getCardClasses()}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">Audio</h3>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Control sound and pronunciation settings
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Enable audio feedback for interactions
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked)
                    void savePreferences({ soundEnabled: checked })
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Volume</div>
                  <div className="text-sm font-medium">{volume[0]}%</div>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={!soundEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className={getCardClasses()}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-bold">Notifications</h3>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Manage your learning reminders
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Daily Reminders</div>
                  <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Get reminded to practice daily
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked)
                    void savePreferences({ notificationsEnabled: checked })
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className={getCardClasses()}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-xl font-bold">Account</h3>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Manage your profile and preferences
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => router.push("/app?view=profile")}
              >
                <User className="w-4 h-4 mr-3" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() =>
                  toast({
                    title: "Language preferences",
                    description: "Use the language switcher in the header to change courses.",
                  })
                }
              >
                <Globe className="w-4 h-4 mr-3" />
                Language Preferences
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => router.push("/privacy")}
              >
                <Shield className="w-4 h-4 mr-3" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className={getCardClasses()}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold">Help & Support</h3>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
                    Get help and provide feedback
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => router.push("/about")}
              >
                Help Center
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => (window.location.href = "mailto:support@wordwanderer.app")}
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start ${
                  theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => (window.location.href = "mailto:feedback@wordwanderer.app")}
              >
                Send Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
        {error && (
          <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}
        {isSaving && <p className="mt-2 text-sm text-slate-400">Saving changes...</p>}
      </div>
    </div>
  )
}
