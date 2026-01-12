"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, ShoppingCart, Gift } from "lucide-react"

const products = [
  {
    id: 1,
    name: "WordWanderer Plus Annual",
    price: "$83.99",
    originalPrice: "$119.88",
    description: "Remove ads, unlimited hearts, and exclusive features",
    features: ["No ads", "Unlimited hearts", "Offline lessons", "Progress quizzes", "Legendary levels"],
    badge: "Most Popular",
    badgeColor: "bg-green-600",
    image: "/placeholder.svg?height=200&width=200&text=Plus",
  },
  {
    id: 2,
    name: "WordWanderer Family Plan",
    price: "$119.99",
    originalPrice: "$179.88",
    description: "Plus benefits for up to 6 family members",
    features: [
      "All Plus features",
      "Up to 6 accounts",
      "Family progress tracking",
      "Parental controls",
      "Shared achievements",
    ],
    badge: "Best Value",
    badgeColor: "bg-blue-600",
    image: "/placeholder.svg?height=200&width=200&text=Family",
  },
  {
    id: 3,
    name: "WordWanderer Merchandise",
    price: "$24.99",
    description: "Official WordWanderer branded items",
    features: ["T-shirts", "Mugs", "Stickers", "Notebooks", "Tote bags"],
    badge: "New",
    badgeColor: "bg-purple-600",
    image: "/placeholder.svg?height=200&width=200&text=Merch",
  },
]

const giftCards = [
  { amount: "$25", popular: false },
  { amount: "$50", popular: true },
  { amount: "$100", popular: false },
  { amount: "Custom", popular: false },
]

export default function StorePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <ShoppingCart className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          WordWanderer Store
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Supercharge Your Learning</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Unlock premium features and show your WordWanderer pride with our exclusive products
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Subscription Plans</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-slate-800 border-slate-700 relative overflow-hidden">
                {product.badge && (
                  <div
                    className={`absolute top-4 right-4 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-bold`}
                  >
                    {product.badge}
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-20 h-20 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-400 to-blue-500"
                    />
                    <h4 className="font-bold text-white text-lg mb-2">{product.name}</h4>
                    <p className="text-slate-300 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-3xl font-bold text-green-400">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-slate-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <Badge className="bg-red-600 text-white mb-4">
                        Save{" "}
                        {Math.round(
                          (1 -
                            Number.parseFloat(product.price.slice(1)) /
                              Number.parseFloat(product.originalPrice.slice(1))) *
                            100,
                        )}
                        %
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gift Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Gift className="w-12 h-12 text-yellow-400 mx-auto" />
            <h3 className="text-2xl font-bold">Gift Cards</h3>
            <p className="text-slate-300">Give the gift of language learning to someone special</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {giftCards.map((card, index) => (
              <Card
                key={index}
                className={`bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors ${card.popular ? "ring-2 ring-green-400" : ""}`}
              >
                <CardContent className="p-4 text-center">
                  {card.popular && <Badge className="bg-green-600 text-white mb-2">Popular</Badge>}
                  <div className="text-2xl font-bold text-white mb-2">{card.amount}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 hover:border-green-400 bg-transparent"
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Why Go Premium?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🚫</div>
                <h4 className="font-bold text-white mb-3">No Ads</h4>
                <p className="text-slate-400">Learn without interruptions and focus on what matters most.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">💖</div>
                <h4 className="font-bold text-white mb-3">Unlimited Hearts</h4>
                <p className="text-slate-400">Make mistakes without losing progress. Learn at your own pace.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="font-bold text-white mb-3">Offline Access</h4>
                <p className="text-slate-400">Download lessons and learn anywhere, even without internet.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-4">14-Day Money-Back Guarantee</h3>
            <p className="text-green-100 mb-6">Not satisfied? Get a full refund within 14 days, no questions asked.</p>
            <Button className="bg-white text-green-600 hover:bg-gray-100">Start Free Trial</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
