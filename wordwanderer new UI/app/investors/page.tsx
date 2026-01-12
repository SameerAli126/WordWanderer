"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, Users, Globe } from "lucide-react"

const financialHighlights = [
  { metric: "Revenue", value: "$531M", change: "+47% YoY", icon: DollarSign },
  { metric: "Monthly Active Users", value: "74.1M", change: "+35% YoY", icon: Users },
  { metric: "Paid Subscribers", value: "6.6M", change: "+54% YoY", icon: TrendingUp },
  { metric: "Markets", value: "40+", change: "Global presence", icon: Globe },
]

const investors = [
  { name: "General Atlantic", type: "Growth Equity", investment: "Series H" },
  { name: "CapitalG", type: "Growth Equity", investment: "Series H" },
  { name: "Durable Capital Partners", type: "Growth Equity", investment: "Series H" },
  { name: "Kleiner Perkins", type: "Venture Capital", investment: "Series F" },
  { name: "GV (Google Ventures)", type: "Corporate VC", investment: "Series E" },
  { name: "Drive Capital", type: "Venture Capital", investment: "Series D" },
]

export default function InvestorsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <TrendingUp className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Investor Relations
        </h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Building the Future of Education</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            WordWanderer is transforming how the world learns languages, with strong growth metrics and a clear path to
            continued expansion in the global education market.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Key Metrics (2024)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {financialHighlights.map((item, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 text-center">
                <CardContent className="p-6">
                  <item.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                  <div className="text-slate-400 text-sm mb-1">{item.metric}</div>
                  <div className="text-green-400 text-sm font-medium">{item.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment Thesis */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">Investment Thesis</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h4 className="text-xl font-bold text-white mb-3">Massive Market</h4>
                <p className="text-slate-300 mb-4">
                  The global language learning market is valued at $60B+ and growing at 18% CAGR, driven by
                  globalization and digital transformation.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• 1.5B+ people learning languages globally</li>
                  <li>• Shift from offline to digital accelerating</li>
                  <li>• Corporate training market expanding</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-xl font-bold text-white mb-3">Market Leadership</h4>
                <p className="text-slate-300 mb-4">
                  WordWanderer is the #1 language learning app globally with strong brand recognition and network
                  effects driving user acquisition.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• 500M+ registered users worldwide</li>
                  <li>• #1 education app in app stores</li>
                  <li>• Strong organic growth and retention</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="text-xl font-bold text-white mb-3">Monetization</h4>
                <p className="text-slate-300 mb-4">
                  Multiple revenue streams with strong unit economics and expanding opportunities in B2B and emerging
                  markets.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Subscription revenue growing 50%+ YoY</li>
                  <li>• High lifetime value and low churn</li>
                  <li>• B2B and enterprise expansion</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Growth Strategy */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center">Growth Strategy</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">Product Innovation</h4>
                <ul className="text-slate-300 space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>AI-powered personalization and adaptive learning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Expansion into new subjects beyond languages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Enhanced social features and community building</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">Market Expansion</h4>
                <ul className="text-slate-300 space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Geographic expansion in Asia and Latin America</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>B2B sales to schools and enterprises</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Strategic partnerships and acquisitions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investor Information */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center">Our Investors</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investors.map((investor, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="font-bold text-white mb-2">{investor.name}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{investor.type}</span>
                    <span className="text-green-400">{investor.investment}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Reports */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center">Financial Reports</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">Latest Reports</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Q4 2024 Earnings Report</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 hover:border-green-400 bg-transparent"
                    >
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Annual Report 2024</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 hover:border-green-400 bg-transparent"
                    >
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Q3 2024 Earnings Report</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 hover:border-green-400 bg-transparent"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-white mb-4">Upcoming Events</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-400 pl-4">
                    <div className="font-semibold text-white">Q1 2025 Earnings Call</div>
                    <div className="text-slate-400 text-sm">April 15, 2025 • 4:00 PM ET</div>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <div className="font-semibold text-white">Annual Shareholder Meeting</div>
                    <div className="text-slate-400 text-sm">June 20, 2025 • 2:00 PM ET</div>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <div className="font-semibold text-white">Investor Day 2025</div>
                    <div className="text-slate-400 text-sm">September 10, 2025 • 9:00 AM ET</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Investor Relations Contact</h3>
            <p className="text-green-100 mb-6">
              For investor inquiries, financial reports, and partnership opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 hover:bg-gray-100">Contact IR Team</Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Subscribe to Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
