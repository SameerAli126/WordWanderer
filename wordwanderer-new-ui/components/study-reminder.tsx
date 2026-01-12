"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Clock, Smartphone, Mail } from "lucide-react"

interface StudyReminderProps {
  isOpen: boolean
  onClose: () => void
}

export function StudyReminder({ isOpen, onClose }: StudyReminderProps) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailReminders: false,
    dailyGoalReminder: true,
    streakProtection: true,
    reminderTime: "19:00",
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving reminder settings:", settings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-green-400" />
            Study Reminders
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reminder Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white">Daily Reminder Time</h3>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => setSettings((prev) => ({ ...prev, reminderTime: e.target.value }))}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Notification Types</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-slate-400">Get notified on your device</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">Email Reminders</p>
                    <p className="text-sm text-slate-400">Receive email notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailReminders}
                  onCheckedChange={(checked) => handleSettingChange("emailReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white">Daily Goal Reminder</p>
                    <p className="text-sm text-slate-400">Remind me about my daily XP goal</p>
                  </div>
                </div>
                <Switch
                  checked={settings.dailyGoalReminder}
                  onCheckedChange={(checked) => handleSettingChange("dailyGoalReminder", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="font-medium text-white">Streak Protection</p>
                    <p className="text-sm text-slate-400">Warn me if my streak is at risk</p>
                  </div>
                </div>
                <Switch
                  checked={settings.streakProtection}
                  onCheckedChange={(checked) => handleSettingChange("streakProtection", checked)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
