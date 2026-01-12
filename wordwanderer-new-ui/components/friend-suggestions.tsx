"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

const suggestions = [
  {
    name: "Aysha Arif",
    subtitle: "You may know each other",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Li Li",
    subtitle: "Followed by Ira dao",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Anna",
    subtitle: "Followed by Ira dao",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

interface FriendSuggestionsProps {
  onViewAll?: () => void
}

export function FriendSuggestions({ onViewAll }: FriendSuggestionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Friend suggestions</h2>
        <Button variant="link" className="text-blue-400 p-0 h-auto" onClick={onViewAll}>
          VIEW ALL
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((friend, index) => (
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
              <p className="text-slate-400 text-sm mb-4">{friend.subtitle}</p>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">FOLLOW</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
