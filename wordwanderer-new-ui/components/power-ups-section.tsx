import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Snowflake, Zap, Shield, Target } from "lucide-react"

const powerUpItems = [
  {
    id: 1,
    title: "Streak Freeze",
    description: "Streak Freeze allows your streak to remain in place for one full day of inactivity.",
    icon: Snowflake,
    iconColor: "bg-cyan-500",
    buttonText: "EQUIPPED",
    buttonVariant: "secondary" as const,
    equipped: "2 / 2 EQUIPPED",
    price: null,
  },
  {
    id: 2,
    title: "Double or Nothing",
    description: "Double your lingots by maintaining a 7-day streak or lose them all!",
    icon: Zap,
    iconColor: "bg-yellow-500",
    buttonText: "50 GEMS",
    buttonVariant: "default" as const,
    equipped: null,
    price: 50,
  },
  {
    id: 3,
    title: "Streak Shield",
    description: "Protect your streak from being broken for 24 hours.",
    icon: Shield,
    iconColor: "bg-blue-500",
    buttonText: "10 GEMS",
    buttonVariant: "default" as const,
    equipped: null,
    price: 10,
  },
  {
    id: 4,
    title: "XP Boost",
    description: "Double your XP for the next lesson you complete.",
    icon: Target,
    iconColor: "bg-green-500",
    buttonText: "25 GEMS",
    buttonVariant: "default" as const,
    equipped: null,
    price: 25,
  },
]

export function PowerUpsSection() {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Power-Ups</h2>

      <div className="space-y-4">
        {powerUpItems.map((item) => (
          <Card key={item.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${item.iconColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg sm:text-xl">{item.title}</h3>
                    {item.equipped && (
                      <span className="text-cyan-400 text-xs sm:text-sm font-medium bg-cyan-500/20 px-2 py-1 rounded-full">
                        {item.equipped}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>

                <Button
                  variant={item.buttonVariant}
                  disabled={item.buttonText === "EQUIPPED"}
                  className={`px-4 sm:px-6 py-2 font-bold text-sm sm:text-base flex-shrink-0 ${
                    item.buttonText === "EQUIPPED"
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : item.buttonVariant === "default"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-600 hover:bg-slate-500 text-white"
                  }`}
                >
                  {item.buttonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
