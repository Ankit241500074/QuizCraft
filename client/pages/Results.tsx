import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, BarChart3, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Results() {
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
                <p className="text-sm text-gray-600">Quiz Analytics & Results</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Generator
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Analytics Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            This page will show detailed analytics about quiz performance, student responses, and learning insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Track student performance and identify learning gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Average Score</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Time to Complete</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Student Insights
              </CardTitle>
              <CardDescription>
                Understand how students interact with your quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Most Challenging Questions</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Learning Patterns</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Improvement Areas</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Generate New Quiz
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
