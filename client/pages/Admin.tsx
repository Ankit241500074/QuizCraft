import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Users, 
  Settings, 
  BarChart3, 
  Key, 
  Shield,
  Database,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  activeUsers: number;
  apiUsage: number;
}

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalQuizzes: 0,
    activeUsers: 0,
    apiUsage: 0
  });
  
  // API Configuration
  const [deepseekApiKey, setDeepseekApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  
  // System Settings
  const [maxQuestionsPerQuiz, setMaxQuestionsPerQuiz] = useState(10);
  const [enablePdfUpload, setEnablePdfUpload] = useState(true);
  const [enableFallbackGeneration, setEnableFallbackGeneration] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.email !== 'admin@quizcraft.ai') {
      navigate('/');
      return;
    }
    
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load admin stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Load system configuration
      const configResponse = await fetch('/api/admin/config', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (configResponse.ok) {
        const configData = await configResponse.json();
        setDeepseekApiKey(configData.deepseekApiKey || '');
        setMaxQuestionsPerQuiz(configData.maxQuestionsPerQuiz || 10);
        setEnablePdfUpload(configData.enablePdfUpload !== false);
        setEnableFallbackGeneration(configData.enableFallbackGeneration !== false);
      }
      
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiConfiguration = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/config/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          deepseekApiKey
        })
      });
      
      if (response.ok) {
        setSuccess('API configuration saved successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save API configuration');
      }
    } catch (err) {
      setError('Network error while saving configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSystemSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/config/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          maxQuestionsPerQuiz,
          enablePdfUpload,
          enableFallbackGeneration
        })
      });
      
      if (response.ok) {
        setSuccess('System settings saved successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save system settings');
      }
    } catch (err) {
      setError('Network error while saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.email !== 'admin@quizcraft.ai') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-800">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">QuizCraft AI Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to App
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes Generated</p>
                  <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                </div>
                <Brain className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls Today</p>
                  <p className="text-2xl font-bold">{stats.apiUsage}</p>
                </div>
                <Database className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* API Configuration */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-blue-600" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Configure external API services for quiz generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="deepseek-key"
                        type={showApiKey ? "text" : "password"}
                        value={deepseekApiKey}
                        onChange={(e) => setDeepseekApiKey(e.target.value)}
                        placeholder="Enter your DeepSeek API key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get your API key from <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DeepSeek Platform</a>
                  </p>
                </div>
                
                <Button onClick={saveApiConfiguration} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save API Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-green-600" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and limitations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="max-questions">Maximum Questions per Quiz</Label>
                  <Input
                    id="max-questions"
                    type="number"
                    min="1"
                    max="50"
                    value={maxQuestionsPerQuiz}
                    onChange={(e) => setMaxQuestionsPerQuiz(parseInt(e.target.value) || 10)}
                  />
                  <p className="text-xs text-gray-500">
                    Maximum number of questions users can generate in a single quiz
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>PDF Upload</Label>
                      <p className="text-xs text-gray-500">Allow users to upload PDF files</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enablePdfUpload}
                      onChange={(e) => setEnablePdfUpload(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fallback Generation</Label>
                      <p className="text-xs text-gray-500">Enable content analysis when AI is unavailable</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableFallbackGeneration}
                      onChange={(e) => setEnableFallbackGeneration(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>

                <Button onClick={saveSystemSettings} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">User Management Coming Soon</h3>
                  <p className="text-gray-500">
                    User management features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
