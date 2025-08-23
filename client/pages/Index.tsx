import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  CheckCircle,
  Brain,
  BookOpen,
  GraduationCap,
  AlertCircle,
  BarChart3,
  LogOut,
  User,
  Shield,
  Zap,
  FileCheck,
  Target,
  Clock,
  Star,
  RefreshCw,
  Upload as UploadIcon,
  Loader2,
  ChevronDown,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Bell,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizGenerationRequest, QuizGenerationResponse } from "@shared/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

interface TrueFalse {
  question: string;
  answer: "True" | "False";
}

interface GeneratedQuiz {
  mcqs: MCQ[];
  true_false: TrueFalse[];
}

export default function Index() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<{pages: number, title: string | null, extractedLength: number} | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [showInstructionalNotice, setShowInstructionalNotice] = useState(false);
  const [mcqCount, setMcqCount] = useState(3);
  const [trueFalseCount, setTrueFalseCount] = useState(2);
  const [includesMCQ, setIncludesMCQ] = useState(true);
  const [includesTrueFalse, setIncludesTrueFalse] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extractionInProgress = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auto-clear messages
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Prevent concurrent extractions
    if (extractionInProgress.current) {
      throw new Error('PDF extraction already in progress. Please wait.');
    }
    
    extractionInProgress.current = true;
    setUploadProgress(0);
    
    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('pdf', file);
        
        console.log('Sending PDF extraction request via XMLHttpRequest...');
        
        const xhr = new XMLHttpRequest();
        
        xhr.timeout = 30000; // 30 second timeout
        
        // Progress tracking
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        };
        
        xhr.onload = function() {
          try {
            console.log('Received response:', xhr.status, xhr.statusText);
            console.log('Response text length:', xhr.responseText.length);
            
            let data;
            try {
              data = JSON.parse(xhr.responseText);
            } catch (parseError) {
              console.error('JSON parse error:', parseError);
              console.error('Response text:', xhr.responseText.substring(0, 500));
              reject(new Error('Server returned invalid JSON response'));
              return;
            }
            
            if (xhr.status >= 200 && xhr.status < 300) {
              if (data.success && data.text) {
                console.log(`Extracted ${data.extractedLength || 0} characters from ${data.pages || 0} pages`);
                
                // Store PDF metadata for display
                setPdfInfo({
                  pages: data.pages || 0,
                  title: data.metadata?.title || null,
                  extractedLength: data.extractedLength || 0
                });
                
                setSuccessMessage(`Successfully extracted text from PDF (${data.pages || 0} pages)`);
                resolve(data.text);
              } else {
                reject(new Error(data.error || 'Failed to extract text from PDF'));
              }
            } else {
              reject(new Error(data.error || `Server error: ${xhr.status}`));
            }
          } catch (error) {
            console.error('Error processing response:', error);
            reject(new Error('Failed to process server response'));
          }
        };
        
        xhr.onerror = function() {
          console.error('Network error during PDF upload');
          reject(new Error('Network error: Failed to upload PDF. Please check your connection.'));
        };
        
        xhr.ontimeout = function() {
          console.error('PDF upload timeout');
          reject(new Error('Upload timed out. Please try a smaller PDF or check your connection.'));
        };
        
        xhr.onabort = function() {
          console.error('PDF upload aborted');
          reject(new Error('Upload was cancelled.'));
        };
        
        // Set up the request
        xhr.open('POST', '/api/extract-pdf-text');
        
        // Set authorization header
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }
        
        // Send the request
        xhr.send(formData);
        
      } catch (error) {
        console.error('Error setting up PDF extraction request:', error);
        reject(new Error('Failed to set up PDF upload'));
      }
    }).finally(() => {
      extractionInProgress.current = false;
      setUploadProgress(0);
    });
  };

  const generateQuiz = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError("Please log in to generate quizzes");
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      const requestBody: QuizGenerationRequest = {
        difficulty_level: difficulty,
        pdf_text: pdfText,
        mcq_count: includesMCQ ? mcqCount : 0,
        true_false_count: includesTrueFalse ? trueFalseCount : 0,
        include_mcq: includesMCQ,
        include_true_false: includesTrueFalse
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle HTTP errors before trying to read JSON
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;

          // Handle authentication errors
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setError("Session expired. Please log in again.");
            navigate('/login');
            return;
          }
        } catch {
          // If we can't parse error JSON, use the status message
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;

          // Handle authentication errors even if JSON parsing fails
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setError("Session expired. Please log in again.");
            navigate('/login');
            return;
          }
        }
        throw new Error(errorMessage);
      }

      const data: QuizGenerationResponse = await response.json();

      if (data.success && data.quiz) {
        setGeneratedQuiz(data.quiz);
        setSuccessMessage(`Quiz generated successfully! ${data.quiz.mcqs.length + data.quiz.true_false.length} questions created.`);

        // Check if this was a fallback generation
        const responseHeaders = response.headers.get('x-fallback-used');
        if (responseHeaders === 'true') {
          setIsUsingFallback(true);
        }
      } else {
        setError(data.error || "Failed to generate quiz");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Request timed out. Please try again with shorter content or check your connection.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Network error: Unable to generate quiz");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedQuiz) {
      navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2));
      setCopied(true);
      setSuccessMessage("Quiz JSON copied to clipboard!");
    }
  };

  const downloadQuiz = () => {
    if (generatedQuiz) {
      const quizData = JSON.stringify(generatedQuiz, null, 2);
      const blob = new Blob([quizData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-${difficulty.toLowerCase()}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage("Quiz downloaded successfully!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      // Basic file validation
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("PDF file is too large. Please use a file smaller than 10MB.");
        return;
      }

      setSelectedFile(file);
      setError(null);
      setPdfInfo(null);
      setIsProcessingPdf(true);

      try {
        const extractedText = await extractTextFromPDF(file);
        setPdfText(extractedText);
        console.log('PDF extraction completed successfully');
      } catch (error) {
        console.error("PDF extraction error:", error);
        setSelectedFile(null);
        setPdfInfo(null);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to extract text from PDF. Please try pasting the text manually.");
        }
      } finally {
        setIsProcessingPdf(false);
      }
    } else if (file) {
      setError("Please select a PDF file only.");
    }
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setPdfText("");
    setError(null);
    setGeneratedQuiz(null);
    setPdfInfo(null);
    setShowInstructionalNotice(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        const fakeEvent = {
          target: { files: [file] }
        } as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(fakeEvent);
      } else {
        setError("Please drop a PDF file only.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      {/* Enhanced Navigation Bar */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">

            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="group cursor-pointer float-animation">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 hover:animate-glow">
                  <Brain className="h-8 w-8 text-white group-hover:animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold gradient-text animate-fade-in">
                  QuizCraft AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium theme-transition">Intelligent Quiz Generator</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium hover-scale animate-slide-in-left"
              >
                <BookOpen className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/results"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium hover-scale animate-slide-in-left"
                style={{ animationDelay: '100ms' }}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Results</span>
              </Link>

              {user.email === "admin@example.com" && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-medium hover-scale animate-slide-in-left"
                  style={{ animationDelay: '200ms' }}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hidden md:block hover-scale animate-bounce-in">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full pulse-glow"></span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-all duration-200 hidden md:block hover-scale"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'dark' ?
                  <Sun className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} /> :
                  <Moon className="h-5 w-5" />
                }
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 pr-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md hover-scale animate-fade-in"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 theme-transition">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition">{user.email}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-600 py-2 z-50 animate-scale-in theme-transition">

                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 animate-fade-in">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      {user.institution && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user.institution}</p>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-slide-in-left hover-scale"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ animationDelay: '50ms' }}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>

                      <Link
                        to="/results"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-slide-in-left hover-scale"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ animationDelay: '100ms' }}
                      >
                        <Activity className="h-4 w-4" />
                        <span>My Activity</span>
                      </Link>

                      <button
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left animate-slide-in-left hover-scale"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Add settings functionality
                        }}
                        style={{ animationDelay: '150ms' }}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Preferences</span>
                      </button>

                      <Link
                        to="/help"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-slide-in-left hover-scale"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ animationDelay: '200ms' }}
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>

                      {user.email === "admin@example.com" && (
                        <>
                          <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors animate-slide-in-left hover-scale"
                            onClick={() => setIsUserMenuOpen(false)}
                            style={{ animationDelay: '250ms' }}
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left animate-slide-in-left hover-scale"
                        style={{ animationDelay: '300ms' }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Enhanced Input Section */}
          <div className="space-y-6">
            
            {/* Welcome Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 animate-fade-in-up hover-scale theme-transition">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Welcome back, {user.firstName}!</CardTitle>
                    <CardDescription className="dark:text-gray-300">Transform your study materials into engaging quizzes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced File Upload */}
            <Card className="border-dashed border-2 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200 dark:bg-gray-800/50 animate-fade-in-up theme-transition" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Upload Study Material
                </CardTitle>
                <CardDescription>
                  Upload a PDF or paste your study content to generate quiz questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {!selectedFile && !pdfText && (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Drop your PDF here</p>
                        <p className="text-sm text-gray-600">or click to browse files</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Supports PDF files up to 10MB
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />

                {isProcessingPdf && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Processing PDF...</span>
                    </div>
                    {uploadProgress > 0 && (
                      <Progress value={uploadProgress} className="h-2" />
                    )}
                  </div>
                )}

                {selectedFile && !isProcessingPdf && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <FileCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-sm text-blue-700">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          {pdfInfo && ` • ${pdfInfo.pages} pages • ${pdfInfo.extractedLength} characters`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReupload}
                      className="text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reupload
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="manual-text" className="text-sm font-medium">Or paste your content manually</Label>
                  <Textarea
                    id="manual-text"
                    placeholder="Paste your study material here..."
                    value={pdfText}
                    onChange={(e) => setPdfText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  {pdfText && (
                    <p className="text-xs text-gray-500">
                      Content length: {pdfText.length} characters
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quiz Configuration */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Quiz Configuration
                </CardTitle>
                <CardDescription>
                  Customize your quiz difficulty and question types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Difficulty Level
                  </Label>
                  <RadioGroup value={difficulty} onValueChange={(value: "Easy" | "Medium" | "Hard") => setDifficulty(value)}>
                    <div className="grid grid-cols-3 gap-3">
                      {["Easy", "Medium", "Hard"].map((level) => (
                        <div key={level} className="relative">
                          <RadioGroupItem
                            value={level}
                            id={level}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={level}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                              "peer-checked:border-blue-500 peer-checked:bg-blue-50",
                              getDifficultyColor(level),
                              difficulty === level && "ring-2 ring-blue-500 ring-offset-2"
                            )}
                          >
                            <span className="font-medium">{level}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Question Types */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Question Types</Label>
                  
                  <div className="space-y-4">
                    {/* MCQ Configuration */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="mcq"
                          checked={includesMCQ}
                          onChange={(e) => setIncludesMCQ(e.target.checked)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="mcq" className="font-medium text-blue-900">Multiple Choice Questions</Label>
                      </div>
                      {includesMCQ && (
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setMcqCount(Math.max(1, mcqCount - 1))}
                            disabled={mcqCount <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="min-w-[2rem] text-center font-medium">{mcqCount}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setMcqCount(Math.min(10, mcqCount + 1))}
                            disabled={mcqCount >= 10}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* True/False Configuration */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="tf"
                          checked={includesTrueFalse}
                          onChange={(e) => setIncludesTrueFalse(e.target.checked)}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Label htmlFor="tf" className="font-medium text-purple-900">True/False Questions</Label>
                      </div>
                      {includesTrueFalse && (
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setTrueFalseCount(Math.max(1, trueFalseCount - 1))}
                            disabled={trueFalseCount <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="min-w-[2rem] text-center font-medium">{trueFalseCount}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setTrueFalseCount(Math.min(10, trueFalseCount + 1))}
                            disabled={trueFalseCount >= 10}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!includesMCQ && !includesTrueFalse && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Please select at least one question type to generate.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Generate Button */}
            <Button
              onClick={generateQuiz}
              disabled={!pdfText.trim() || isGenerating || (!includesMCQ && !includesTrueFalse)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Quiz...</span>
                  <Clock className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5" />
                  <span>Generate Quiz</span>
                  <span className="text-sm opacity-90">
                    ({includesMCQ && includesTrueFalse
                      ? `${mcqCount} MCQ + ${trueFalseCount} T/F`
                      : includesMCQ
                      ? `${mcqCount} MCQ`
                      : `${trueFalseCount} T/F`})
                  </span>
                </div>
              )}
            </Button>
          </div>

          {/* Enhanced Output Section */}
          <div className="space-y-6">
            {/* Status Messages */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-5 duration-500">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 font-medium">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-5 duration-500">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {isUsingFallback && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  AI service is temporarily unavailable. Generated quiz using content analysis.
                </AlertDescription>
              </Alert>
            )}

            {generatedQuiz ? (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <BookOpen className="h-6 w-6 text-green-600" />
                      <div>
                        <span>Generated Quiz</span>
                        <Badge className={cn("ml-3", getDifficultyColor(difficulty))}>{difficulty}</Badge>
                      </div>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadQuiz}
                        className="hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center space-x-4">
                    <span>Total Questions: {generatedQuiz.mcqs.length + generatedQuiz.true_false.length}</span>
                    <span>•</span>
                    <span>MCQs: {generatedQuiz.mcqs.length}</span>
                    <span>•</span>
                    <span>T/F: {generatedQuiz.true_false.length}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-white">Preview</TabsTrigger>
                      <TabsTrigger value="json" className="data-[state=active]:bg-white">JSON Output</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview" className="mt-6">
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {/* MCQs */}
                          {generatedQuiz.mcqs.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-lg mb-4 text-blue-800 flex items-center">
                                <Target className="h-5 w-5 mr-2" />
                                Multiple Choice Questions ({generatedQuiz.mcqs.length})
                              </h3>
                              {generatedQuiz.mcqs.map((mcq, index) => (
                                <Card key={index} className="mb-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                                  <CardContent className="pt-4">
                                    <p className="font-medium mb-3 text-gray-900">{index + 1}. {mcq.question}</p>
                                    <div className="space-y-2">
                                      {mcq.options.map((option, optIndex) => (
                                        <div key={optIndex} className={cn(
                                          "p-3 rounded-lg border text-sm transition-colors",
                                          option === mcq.answer 
                                            ? "bg-green-50 border-green-200 text-green-800 font-medium" 
                                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                        )}>
                                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                          {option === mcq.answer && <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* True/False */}
                          {generatedQuiz.true_false.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-lg mb-4 text-purple-800 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                True/False Questions ({generatedQuiz.true_false.length})
                              </h3>
                              {generatedQuiz.true_false.map((tf, index) => (
                                <Card key={index} className="mb-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                                  <CardContent className="pt-4">
                                    <p className="font-medium mb-3 text-gray-900">{index + 1}. {tf.question}</p>
                                    <div className="flex space-x-4">
                                      <div className={cn(
                                        "px-4 py-2 rounded-lg text-sm border font-medium transition-colors",
                                        tf.answer === "True" 
                                          ? "bg-green-50 border-green-200 text-green-800" 
                                          : "bg-gray-50 border-gray-200"
                                      )}>
                                        True {tf.answer === "True" && <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />}
                                      </div>
                                      <div className={cn(
                                        "px-4 py-2 rounded-lg text-sm border font-medium transition-colors",
                                        tf.answer === "False" 
                                          ? "bg-green-50 border-green-200 text-green-800" 
                                          : "bg-gray-50 border-gray-200"
                                      )}>
                                        False {tf.answer === "False" && <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="json" className="mt-6">
                      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-inner">
                        <pre className="text-sm overflow-auto max-h-[500px] leading-relaxed">
                          {JSON.stringify(generatedQuiz, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-gray-200 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No Quiz Generated Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Upload your study material and configure your preferences to create personalized quiz questions
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    {[
                      { icon: Target, text: "MCQ Questions" },
                      { icon: CheckCircle, text: "True/False Questions" },
                      { icon: Download, text: "JSON Export" },
                      { icon: Star, text: "Custom Difficulty" }
                    ].map(({ icon: Icon, text }, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-green-500" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
