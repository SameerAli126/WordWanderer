"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, UserPlus, X } from "lucide-react"

const allFriends = [
  { name: "Aysha Arif", subtitle: "You may know each other", avatar: "/placeholder.svg?height=60&width=60", mutual: 5 },
  { name: "Li Li", subtitle: "Followed by Ira dao", avatar: "/placeholder.svg?height=60&width=60", mutual: 3 },
  { name: "Anna", subtitle: "Followed by Ira dao", avatar: "/placeholder.svg?height=60&width=60", mutual: 2 },
  { name: "Chen Wei", subtitle: "Learning Chinese", avatar: "/placeholder.svg?height=60&width=60", mutual: 8 },
  { name: "Maria Garcia", subtitle: "From your contacts", avatar: "/placeholder.svg?height=60&width=60", mutual: 1 },
  { name: "David Kim", subtitle: "Similar interests", avatar: "/placeholder.svg?height=60&width=60", mutual: 4 },
  {
    name: "Sarah Johnson",
    subtitle: "Followed by 3 friends",
    avatar: "/placeholder.svg?height=60&width=60",
    mutual: 6,
  },
  { name: "Ahmed Hassan", subtitle: "Learning Chinese", avatar: "/placeholder.svg?height=60&width=60", mutual: 2 },
  {
    name: "Emma Wilson",
    subtitle: "You may know each other",
    avatar: "/placeholder.svg?height=60&width=60",
    mutual: 7,
  },
]

export default function AllFriendsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [followedUsers, setFollowedUsers] = useState<string[]>([])

  const filteredFriends = allFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFollow = (friendName: string) => {
    setFollowedUsers((prev) => [...prev, friendName])
  }

  const handleUnfollow = (friendName: string) => {
    setFollowedUsers((prev) => prev.filter((name) => name !== friendName))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Friend Suggestions</h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search for friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Friends Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFriends.map((friend, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 w-6 h-6 p-0 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>

              <CardContent className="p-4 text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <h3 className="font-medium text-white mb-1">{friend.name}</h3>
                <p className="text-slate-400 text-sm mb-2">{friend.subtitle}</p>
                <p className="text-slate-500 text-xs mb-4">{friend.mutual} mutual connections</p>

                {followedUsers.includes(friend.name) ? (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleUnfollow(friend.name)}
                  >
                    Following
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleFollow(friend.name)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFriends.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No friends found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
