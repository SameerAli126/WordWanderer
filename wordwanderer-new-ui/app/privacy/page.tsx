"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Shield, Calendar, Eye, Lock, Users } from "lucide-react"

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Shield className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Privacy Policy
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
            <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Matters</h2>
            <p className="text-slate-300 mb-4">
              At WordWanderer, we are committed to protecting your privacy and being transparent about how we collect,
              use, and share your information. This Privacy Policy explains our practices regarding your personal data
              when you use our services.
            </p>
            <p className="text-slate-300">
              By using WordWanderer, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="p-6">
              <Eye className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Transparency</h3>
              <p className="text-slate-400 text-sm">We're clear about what data we collect and why</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="p-6">
              <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Security</h3>
              <p className="text-slate-400 text-sm">Your data is protected with industry-standard security</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Control</h3>
              <p className="text-slate-400 text-sm">You have control over your personal information</p>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">1. Information We Collect</h3>
              <div className="text-slate-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Information You Provide</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Account information (email, username, password)</li>
                    <li>Profile information (name, age, learning goals)</li>
                    <li>Learning progress and performance data</li>
                    <li>Communications with our support team</li>
                    <li>Payment information (processed by third-party providers)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Information We Collect Automatically</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Device information (type, operating system, unique identifiers)</li>
                    <li>Usage data (lessons completed, time spent, features used)</li>
                    <li>Log data (IP address, browser type, access times)</li>
                    <li>Location data (if you enable location services)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h3>
              <div className="text-slate-300 space-y-3">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and improve our language learning services</li>
                  <li>Personalize your learning experience</li>
                  <li>Track your progress and provide feedback</li>
                  <li>Send you important updates and notifications</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Provide customer support</li>
                  <li>Conduct research to improve our products</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">3. Information Sharing</h3>
              <div className="text-slate-300 space-y-4">
                <p>We may share your information in the following circumstances:</p>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Service Providers</h4>
                  <p className="text-sm">
                    We work with third-party companies to provide services like payment processing, analytics, and
                    customer support. These providers only have access to information needed to perform their services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Legal Requirements</h4>
                  <p className="text-sm">
                    We may disclose information if required by law, court order, or government request, or to protect
                    our rights and safety.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Business Transfers</h4>
                  <p className="text-sm">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                    part of that transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">4. Data Security</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="text-sm text-slate-400">
                  However, no method of transmission over the internet or electronic storage is 100% secure, and we
                  cannot guarantee absolute security.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">5. Your Rights and Choices</h3>
              <div className="text-slate-300 space-y-3">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a portable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                  <li>
                    <strong>Restriction:</strong> Limit how we process your data
                  </li>
                </ul>
                <p>
                  To exercise these rights, contact us at privacy@wordwanderer.com or use the privacy controls in your
                  account settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">6. Children's Privacy</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  WordWanderer is designed for users 13 years and older. We do not knowingly collect personal
                  information from children under 13 without parental consent.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information,
                  please contact us so we can delete such information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">7. International Data Transfers</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  WordWanderer operates globally, and your information may be transferred to and processed in countries
                  other than your own. We ensure appropriate safeguards are in place to protect your data during
                  international transfers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">8. Data Retention</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  We retain your personal information for as long as necessary to provide our services and fulfill the
                  purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
                <p>
                  When you delete your account, we will delete or anonymize your personal information, except where we
                  need to retain certain information for legal or business purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">9. Changes to This Policy</h3>
              <div className="text-slate-300 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this policy periodically to stay informed about how we protect your
                  information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">10. Contact Us</h3>
              <div className="text-slate-300 space-y-3">
                <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> privacy@wordwanderer.com
                  </p>
                  <p>
                    <strong>Mail:</strong>
                  </p>
                  <p>WordWanderer, Inc.</p>
                  <p>Attn: Privacy Team</p>
                  <p>5900 Penn Avenue</p>
                  <p>Pittsburgh, PA 15206</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
