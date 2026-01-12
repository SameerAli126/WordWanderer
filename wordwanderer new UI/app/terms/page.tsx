"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText, Calendar } from "lucide-react"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <FileText className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Last Updated */}
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Last updated: March 1, 2024</span>
        </div>

        {/* Introduction */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to WordWanderer</h2>
            <p className="text-slate-300 mb-4">
              These Terms of Service ("Terms") govern your use of WordWanderer's website, mobile applications, and
              related services (collectively, the "Service") operated by WordWanderer, Inc. ("we," "us," or "our").
            </p>
            <p className="text-slate-300">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of
              these terms, then you may not access the Service.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  By creating an account or using WordWanderer, you confirm that you are at least 13 years old (or the
                  minimum age required in your jurisdiction) and have the legal capacity to enter into these Terms.
                </p>
                <p>
                  If you are under 18, you represent that your parent or guardian has reviewed and agreed to these
                  Terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">2. Description of Service</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  WordWanderer provides language learning services through our website and mobile applications. Our
                  Service includes:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Interactive language lessons and exercises</li>
                  <li>Progress tracking and personalized learning paths</li>
                  <li>Community features and social learning tools</li>
                  <li>Premium subscription services</li>
                  <li>Educational content and resources</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">3. User Accounts</h3>
              <div className="text-slate-300 space-y-3">
                <p>To access certain features of the Service, you must create an account. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Promptly updating your account information</li>
                </ul>
                <p>You may not share your account with others or create multiple accounts for the same person.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">4. Acceptable Use</h3>
              <div className="text-slate-300 space-y-3">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Distribute spam, malware, or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to access the Service</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">5. Subscription Services</h3>
              <div className="text-slate-300 space-y-3">
                <p>WordWanderer offers premium subscription services ("WordWanderer Plus") with additional features:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You may cancel at any time through your account settings</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>Pricing may change with 30 days notice</li>
                  <li>Free trial periods may be offered at our discretion</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  The Service and its content, including but not limited to text, graphics, images, audio, video,
                  software, and other materials, are owned by WordWanderer or our licensors and are protected by
                  copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor
                  may you reverse engineer or attempt to extract the source code of that software.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">7. Privacy</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                  information when you use our Service. By using our Service, you agree to the collection and use of
                  information in accordance with our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">8. Termination</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice
                  or liability, for any reason, including if you breach these Terms.
                </p>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in
                  the app.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">9. Disclaimer of Warranties</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  The Service is provided "as is" and "as available" without warranties of any kind, either express or
                  implied, including but not limited to implied warranties of merchantability, fitness for a particular
                  purpose, and non-infringement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">10. Limitation of Liability</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  In no event shall WordWanderer be liable for any indirect, incidental, special, consequential, or
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">11. Changes to Terms</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes
                  by posting the new Terms on this page and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">12. Contact Information</h3>
              <div className="text-slate-300 space-y-3">
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p>WordWanderer, Inc.</p>
                  <p>5900 Penn Avenue</p>
                  <p>Pittsburgh, PA 15206</p>
                  <p>Email: legal@wordwanderer.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
