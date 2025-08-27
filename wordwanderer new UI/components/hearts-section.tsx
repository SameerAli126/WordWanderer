import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Infinity } from "lucide-react"

const heartItems = [
  {
    id: 1,
    title: "Refill Hearts",
    description: "Get full hearts so you can worry less about making mistakes in a lesson",
    icon: Heart,
    iconColor: "bg-red-500",
    buttonText: "FULL",
    buttonVariant: "secondary" as const,
    price: null,
  },
  {
    id: 2,
    title: "Unlimited Hearts",
    description: "Never run out of hearts with Super!",
    icon: Infinity,
    iconColor: "bg-gradient-to-br from-purple-500 to-blue-500",
    buttonText: "FREE TRIAL",
    buttonVariant: "default" as const,
    price: null,
  },
]

export function HeartsSection() {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hearts</h2>

      <div className="space-y-4">
        {heartItems.map((item) => (
          <Card key={item.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${item.iconColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>

                <Button
                  variant={item.buttonVariant}
                  className={`px-6 py-2 font-bold text-sm sm:text-base flex-shrink-0 ${
                    item.buttonVariant === "default"
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
