import { RequestHandler } from "express";

// In-memory storage for admin data (in production, use a database)
let adminConfig = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || "",
  maxQuestionsPerQuiz: 10,
  enablePdfUpload: true,
  enableFallbackGeneration: true
};

let systemStats = {
  totalUsers: 0,
  totalQuizzes: 0,
  activeUsers: 0,
  apiUsage: 0
};

// Middleware to check admin permissions
const checkAdminAccess = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // In a real app, you'd check the user's role from the database
    // For now, we'll check if the token contains admin info
    if (!decoded.userId) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    
    // For demo purposes, assume userId "1" is admin or check email in a real implementation
    req.adminUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

export const handleGetStats: RequestHandler = async (req, res) => {
  try {
    // In a real app, you'd calculate these from the database
    const stats = {
      totalUsers: 15, // Mock data
      totalQuizzes: 247,
      activeUsers: 8,
      apiUsage: 142
    };
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, error: "Failed to fetch statistics" });
  }
};

export const handleGetConfig: RequestHandler = async (req, res) => {
  try {
    // Return config without sensitive data
    const config = {
      deepseekApiKey: adminConfig.deepseekApiKey ? '***********' : '',
      maxQuestionsPerQuiz: adminConfig.maxQuestionsPerQuiz,
      enablePdfUpload: adminConfig.enablePdfUpload,
      enableFallbackGeneration: adminConfig.enableFallbackGeneration
    };
    
    res.json(config);
  } catch (error) {
    console.error("Error fetching admin config:", error);
    res.status(500).json({ success: false, error: "Failed to fetch configuration" });
  }
};

export const handleUpdateApiConfig: RequestHandler = async (req, res) => {
  try {
    const { deepseekApiKey } = req.body;
    
    if (deepseekApiKey) {
      adminConfig.deepseekApiKey = deepseekApiKey;
      // Update environment variable for runtime use
      process.env.DEEPSEEK_API_KEY = deepseekApiKey;
    }
    
    res.json({ success: true, message: "API configuration updated successfully" });
  } catch (error) {
    console.error("Error updating API config:", error);
    res.status(500).json({ success: false, error: "Failed to update API configuration" });
  }
};

export const handleUpdateSystemConfig: RequestHandler = async (req, res) => {
  try {
    const { maxQuestionsPerQuiz, enablePdfUpload, enableFallbackGeneration } = req.body;
    
    if (typeof maxQuestionsPerQuiz === 'number' && maxQuestionsPerQuiz > 0 && maxQuestionsPerQuiz <= 50) {
      adminConfig.maxQuestionsPerQuiz = maxQuestionsPerQuiz;
    }
    
    if (typeof enablePdfUpload === 'boolean') {
      adminConfig.enablePdfUpload = enablePdfUpload;
    }
    
    if (typeof enableFallbackGeneration === 'boolean') {
      adminConfig.enableFallbackGeneration = enableFallbackGeneration;
    }
    
    res.json({ success: true, message: "System settings updated successfully" });
  } catch (error) {
    console.error("Error updating system config:", error);
    res.status(500).json({ success: false, error: "Failed to update system settings" });
  }
};

export const handleGetUsers: RequestHandler = async (req, res) => {
  try {
    // Mock user data - in production, fetch from database
    const users = [
      {
        id: "1",
        email: "admin@quizcraft.ai",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        createdAt: "2024-01-01T00:00:00Z",
        lastActive: "2024-01-20T10:00:00Z"
      },
      {
        id: "2", 
        email: "teacher@school.edu",
        firstName: "Jane",
        lastName: "Smith",
        role: "user",
        createdAt: "2024-01-15T00:00:00Z",
        lastActive: "2024-01-20T09:30:00Z"
      }
    ];
    
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
};

// Export middleware for use in routes
export { checkAdminAccess };

// Export config for use in other modules
export const getAdminConfig = () => adminConfig;
