"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Snowflake, Gem, Shield, Clock } from "lucide-react"
import { apiRequest, emitBalanceUpdate } from "@/lib/api"

interface StreakFreezeModalProps {
  isOpen: boolean
  onClose: () => void
  currentStreak: number
  gems: number
}

export function StreakFreezeModal({ isOpen, onClose, currentStreak, gems }: StreakFreezeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const freezeCost = 200

  const handlePurchase = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await apiRequest<{ gems: number; streakFreezes: number }>("/api/users/streak-freeze/purchase", {
        method: "POST",
      })
      emitBalanceUpdate({ gems: response.gems, streakFreezes: response.streakFreezes })
      setIsProcessing(false)
      onClose()
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : "Unable to purchase streak freeze.")
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Snowflake className="w-5 h-5 text-blue-400" />
            Streak Freeze
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className="text-center p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">{currentStreak}</div>
            <div className="text-sm text-slate-300">Day Streak 🔥</div>
          </div>

          {/* Protection Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Streak Protection</h3>
                <p className="text-sm text-slate-300">
                  Protect your streak for one day if you forget to complete a lesson.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
              <Clock className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">24-Hour Coverage</h3>
                <p className="text-sm text-slate-300">Valid for 24 hours from purchase. Use it wisely!</p>
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Cost</span>
              </div>
              <div className="text-xl font-bold text-blue-400">{freezeCost}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your gems:</span>
              <span className="font-semibold text-white">{gems.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={gems < freezeCost || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Purchase for ${freezeCost} gems`
              )}
            </Button>
          </div>

          {gems < freezeCost && (
            <p className="text-sm text-red-400 text-center">Not enough gems. Complete more lessons to earn gems!</p>
          )}
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
