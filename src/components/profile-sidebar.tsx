import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronRight, Search, Mail } from "lucide-react"

const activities = [
  {
    user: "Ira dao",
    action: "Collected the June badge!",
    time: "4 days",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🏆",
  },
  {
    user: "Ira dao",
    action: "Finished top 3 on the leaderboard and was promoted to the Ruby League!",
    time: "4 days",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "🏆",
  },
]

const following = [
  { name: "Andrey", xp: "2,597,832 XP", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Nancy Carrillo", xp: "206,798.3 XP", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Michal", xp: "50,058 XP", avatar: "/placeholder.svg?height=32&width=32" },
]

export function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">{activity.user}</span>
                  <span className="text-slate-400 text-xs">{activity.time}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{activity.action}</p>

                <div className="flex items-center justify-between mt-2">
                  <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 p-0 h-auto">
                    🎉 CELEBRATE
                  </Button>
                  <div className="text-lg">{activity.badge}</div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-white">
            View all
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Following/Followers */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex gap-4">
            <Button variant="ghost" className="text-blue-400 p-0 h-auto font-medium">
              FOLLOWING
            </Button>
            <Button variant="ghost" className="text-slate-400 p-0 h-auto font-medium">
              FOLLOWERS
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {following.map((user, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{user.name}</div>
                <div className="text-slate-400 text-xs">{user.xp}</div>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-white mt-4">
            View 35 more
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Add Friends */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <h3 className="font-bold text-white">Add friends</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-between text-white hover:bg-slate-700">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              Find friends
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="ghost" className="w-full justify-between text-white hover:bg-slate-700">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              Invite friends
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
