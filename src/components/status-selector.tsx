import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const statusEmojis = ["😎", "🎉", "🌙", "👀", "🗑️", "🇨🇳", "🤢", "💯", "🐵", "🏆", "🗂️", "👥"]

export function StatusSelector() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <h3 className="text-lg font-bold text-white">Set your status</h3>
        <Button variant="link" className="text-blue-400 p-0 h-auto text-sm">
          CLEAR
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
            <div className="text-xl">🦉</div>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {statusEmojis.map((emoji, index) => (
            <Button key={index} variant="ghost" className="w-10 h-10 p-0 bg-slate-700 hover:bg-slate-600 rounded-lg">
              <span className="text-lg">{emoji}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
