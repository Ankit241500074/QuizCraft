import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, ScrollText } from "lucide-react";

export default function Terms() {
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
                <p className="text-sm text-gray-600">Terms of Service</p>
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
              <div className="p-3 bg-blue-100 rounded-full">
                <ScrollText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using QuizCraft AI, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed">
                QuizCraft AI is an educational platform that uses artificial intelligence to generate quiz questions from study materials. The service is designed for teachers and educational professionals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                You are responsible for maintaining the confidentiality of your account and password. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Use the service only for educational purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Content and Usage</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Users may upload educational materials for quiz generation. You agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You own or have rights to any content you upload</li>
                <li>Content will not violate any laws or third-party rights</li>
                <li>Generated quizzes are for educational use only</li>
                <li>We may use uploaded content to improve our AI models</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. AI-Generated Content</h2>
              <p className="text-gray-700 leading-relaxed">
                Quiz questions are generated using AI technology. While we strive for accuracy, users should review all generated content before use in educational settings. We are not responsible for any errors or inaccuracies in AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy and Data</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                QuizCraft AI is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our support channels.
              </p>
            </section>

            <div className="bg-gray-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 text-center">
                By using QuizCraft AI, you acknowledge that you have read, understood, and agree to these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
