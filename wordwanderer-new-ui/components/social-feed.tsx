"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, MessageCircle, Share } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function SocialFeed() {
  const { theme } = useTheme()

  const activities = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "A",
      action: "completed a lesson",
      subject: "Basic Greetings",
      time: "2h ago",
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      user: "Maria Garcia",
      avatar: "M",
      action: "reached a milestone",
      subject: "50-day streak! 🔥",
      time: "5h ago",
      likes: 12,
      comments: 4,
    },
  ]

  const getCardClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      case "wanderer":
        return "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-400/30"
      default:
        return "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/30"
    }
  }

  return (
    <Card className={getCardClasses()}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-4 h-4 text-blue-500" />
          Friend Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  <span className={theme === "light" ? "text-gray-600" : "text-slate-400"}>{activity.action}</span>{" "}
                  <span className="font-medium">{activity.subject}</span>
                </p>
                <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>{activity.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-11">
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                {activity.likes}
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                {activity.comments}
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  )
}
