const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
require("dotenv/config");

// Create Express app for Netlify function
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.netlify.app', 'https://your-custom-domain.com']
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for users (in production, use a database)
const users = [];
let userIdCounter = 1;

// Simple password hashing simulation (use bcrypt in production)
const hashPassword = (password) => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password, hashedPassword) => {
  return Buffer.from(password).toString('base64') === hashedPassword;
};

// Generate simple JWT-like token (use proper JWT in production)
const generateToken = (userId) => {
  return Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
};

// Health check endpoint
app.get("/api/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

// Demo endpoint
app.get("/api/demo", (_req, res) => {
  res.json({ message: "Hello from Express server" });
});

// Authentication routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName, institution } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: "Email, password, first name, and last name are required"
  });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Check if user already exists
    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists"
      });
    }

    // Create new user
    const newUser = {
      id: `user_${userIdCounter++}`,
      email: email.toLowerCase(),
      password: hashPassword(password),
      firstName,
      lastName,
      institution: institution || "",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  // In a real app, you might want to invalidate the token
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    // Decode token (in production, verify JWT signature)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
        error: "Invalid token"
    });
  }
});

app.post("/api/auth/forgot-password", (req, res) => {
  // In a real app, send password reset email
  res.json({ 
    success: true, 
    message: "If an account with that email exists, a password reset link has been sent" 
  });
});

// Quiz generation endpoint (simplified)
app.post("/api/generate-quiz", (req, res) => {
  try {
    const { pdfText, difficulty, mcqCount, trueFalseCount } = req.body;
    
    if (!pdfText) {
      return res.status(400).json({
        success: false,
        error: "PDF text is required"
      });
    }

    // Simple quiz generation logic
    const sentences = pdfText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const mcqs = [];
    const trueFalse = [];

    // Generate sample MCQs
    for (let i = 0; i < Math.min(mcqCount || 3, sentences.length); i++) {
      mcqs.push({
        question: `Sample MCQ question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0
      });
    }

    // Generate sample True/False questions
    for (let i = 0; i < Math.min(trueFalseCount || 2, sentences.length); i++) {
      trueFalse.push({
        question: `Sample True/False question ${i + 1}?`,
        correctAnswer: true
      });
    }

    res.json({
      success: true,
      quiz: { mcqs, true_false: trueFalse }
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in Netlify function:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? err.message : 'Something went wrong'
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    path: req.originalUrl
  });
});

exports.handler = serverless(app);
