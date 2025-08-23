import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QuizCraft AI</h1>
                <p className="text-sm text-gray-600">Privacy Policy</p>
              </div>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Signup
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Account information (name, email, institution)</li>
                <li>Educational content you upload for quiz generation</li>
                <li>Usage data and preferences</li>
                <li>Communication with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide and maintain our quiz generation service</li>
                <li>Generate educational content using AI</li>
                <li>Improve our service and AI models</li>
                <li>Send you service-related communications</li>
                <li>Respond to your requests and provide customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Educational Content Processing</h2>
              <p className="text-gray-700 leading-relaxed">
                When you upload educational materials, we process this content using AI services (including Claude AI) to generate quiz questions. This content is used solely for generating educational quizzes and improving our service quality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>To AI service providers (like Anthropic) for content processing</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
                <li>To service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of non-essential communications</li>
                <li>Request clarification about our data practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies to maintain user sessions and provide core functionality. We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is designed for educators and is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our support channels. We're committed to addressing your privacy concerns.
              </p>
            </section>

            <div className="bg-blue-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-blue-700 text-center">
                Your privacy is important to us. We are committed to protecting your personal information and being transparent about our data practices.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
