import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function SuperPromotion() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
              SUPER
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Try Super for free</h3>
            <p className="text-slate-300 text-sm">No ads, personalized practice, and unlimited Legendary!</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <div className="text-2xl">🦉</div>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">TRY 2 WEEKS FREE</Button>
      </CardContent>
    </Card>
  )
}
