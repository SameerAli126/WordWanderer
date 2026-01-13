import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, LogOut } from "lucide-react"

interface ProfileHeaderProps {
  user?: {
    displayName: string
    email: string
    avatar?: string | null
    joinedAt?: string
  } | null
  isLoading?: boolean
  onLogout?: () => void
}

const formatJoinDate = (value?: string) => {
  if (!value) {
    return "Joined recently"
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Joined recently"
  }
  return `Joined ${date.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
}

export function ProfileHeader({ user, isLoading, onLogout }: ProfileHeaderProps) {
  const initials = user?.displayName?.trim().slice(0, 1).toUpperCase() ?? "W"

  return (
    <Card className="bg-gradient-to-br from-green-400 to-green-500 border-0 relative overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-green-800 hover:bg-green-600/20">
            <Edit className="w-4 h-4" />
          </Button>
          {onLogout && (
            <Button size="sm" variant="ghost" onClick={onLogout} className="text-green-800 hover:bg-green-600/20">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={user?.avatar ?? "/placeholder.svg?height=96&width=96"} />
            <AvatarFallback className="bg-orange-400 text-white text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {isLoading ? "Loading..." : user?.displayName ?? "WordWanderer"}
          </h1>
          <p className="text-green-100 text-sm mb-4">
            {isLoading ? "Fetching profile details..." : formatJoinDate(user?.joinedAt)}
          </p>

          <div className="flex items-center gap-6 text-white">
            <div className="text-center">
              <div className="font-bold text-lg">38</div>
              <div className="text-green-100 text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">28</div>
              <div className="text-green-100 text-sm">Followers</div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <img src="https://flagcdn.com/w20/cn.png" alt="China" className="w-6 h-4 rounded border border-white/20" />
            <img src="https://flagcdn.com/w20/jp.png" alt="Japan" className="w-6 h-4 rounded border border-white/20" />
            <img src="https://flagcdn.com/w20/kr.png" alt="Korea" className="w-6 h-4 rounded border border-white/20" />
            <div className="w-6 h-4 bg-white/20 rounded border border-white/20 flex items-center justify-center">
              <span className="text-white text-xs">+4</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
