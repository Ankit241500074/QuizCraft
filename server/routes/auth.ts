import { RequestHandler } from "express";
import { LoginRequest, SignupRequest, AuthResponse, User } from "@shared/api";

// In a real app, this would be a database
const users: User[] = [];
let userIdCounter = 1;

// Simple password hashing simulation (use bcrypt in production)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return Buffer.from(password).toString('base64') === hashedPassword;
};

// Generate simple JWT-like token (use proper JWT in production)
const generateToken = (userId: string): string => {
  return Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
};

const findUserByEmail = (email: string): (User & { password: string }) | undefined => {
  return (users as any[]).find(user => user.email === email);
};

// Create default admin user after functions are defined
const adminUser: User & { password: string } = {
  id: "admin",
  email: "admin@quizcraft.ai",
  firstName: "Admin",
  lastName: "User",
  institution: "QuizCraft AI",
  createdAt: new Date().toISOString(),
  password: hashPassword("admin123") // Default password: admin123
};

// Add admin user to users array
users.push(adminUser as any);

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      const response: AuthResponse = {
        success: false,
        error: "Email and password are required"
      };
      return res.status(400).json(response);
    }

    const user = findUserByEmail(email.toLowerCase());
    
    if (!user || !verifyPassword(password, user.password)) {
      const response: AuthResponse = {
        success: false,
        error: "Invalid email or password"
      };
      return res.status(401).json(response);
    }

    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    const response: AuthResponse = {
      success: true,
      user: userWithoutPassword,
      token
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const response: AuthResponse = {
      success: false,
      error: "Internal server error"
    };
    res.status(500).json(response);
  }
};

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName, institution }: SignupRequest = req.body;

    if (!email || !password || !firstName || !lastName) {
      const response: AuthResponse = {
        success: false,
        error: "Email, password, first name, and last name are required"
      };
      return res.status(400).json(response);
    }

    if (password.length < 8) {
      const response: AuthResponse = {
        success: false,
        error: "Password must be at least 8 characters long"
      };
      return res.status(400).json(response);
    }

    const existingUser = findUserByEmail(email.toLowerCase());
    if (existingUser) {
      const response: AuthResponse = {
        success: false,
        error: "An account with this email already exists"
      };
      return res.status(409).json(response);
    }

    const hashedPassword = hashPassword(password);
    const userId = userIdCounter.toString();
    userIdCounter++;

    const newUser: User & { password: string } = {
      id: userId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      institution: institution || undefined,
      createdAt: new Date().toISOString(),
      password: hashedPassword
    };

    users.push(newUser as any);

    const token = generateToken(userId);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    const response: AuthResponse = {
      success: true,
      user: userWithoutPassword,
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    const response: AuthResponse = {
      success: false,
      error: "Internal server error"
    };
    res.status(500).json(response);
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  // In a real app, you might invalidate the token in a blacklist
  res.json({ success: true, message: "Logged out successfully" });
};

export const handleVerifyToken: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: "No valid token provided" });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      const user = users.find(u => u.id === decoded.userId);

      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }

      const { password: _, ...userWithoutPassword } = user as any;
      res.json({ success: true, user: userWithoutPassword });
    } catch {
      res.status(401).json({ success: false, error: "Invalid token format" });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const user = findUserByEmail(email.toLowerCase());

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (user) {
      // In a real app, you would:
      // 1. Generate a secure reset token
      // 2. Store it in database with expiration
      // 3. Send email with reset link
      console.log(`Password reset requested for user: ${user.email}`);
      console.log(`In production, send email to: ${user.email} with reset token`);
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: "If an account with this email exists, you will receive password reset instructions."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
