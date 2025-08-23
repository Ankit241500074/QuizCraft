import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleQuizGeneration } from "./routes/quiz";
import { handleLogin, handleSignup, handleLogout, handleVerifyToken, handleForgotPassword } from "./routes/auth";
import { uploadMiddleware, handlePdfTextExtraction } from "./routes/pdf";
import {
  checkAdminAccess,
  handleGetStats,
  handleGetConfig,
  handleUpdateApiConfig,
  handleUpdateSystemConfig,
  handleGetUsers
} from "./routes/admin";
import { testOpenRouterAPI } from "./routes/test-api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://quizcraft-p7qu.onrender.com', // Your Render server
          'http://localhost:5173', // Local development
          'http://localhost:3000' // Local development alternative
        ]
      : true,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/test-openrouter", testOpenRouterAPI);
  app.post("/api/generate-quiz", handleQuizGeneration);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/verify", handleVerifyToken);
  app.post("/api/auth/forgot-password", handleForgotPassword);

  // PDF processing routes
  app.post("/api/extract-pdf-text", uploadMiddleware, handlePdfTextExtraction);

  // Admin routes (with admin access check)
  app.get("/api/admin/stats", checkAdminAccess, handleGetStats);
  app.get("/api/admin/config", checkAdminAccess, handleGetConfig);
  app.post("/api/admin/config/api", checkAdminAccess, handleUpdateApiConfig);
  app.post("/api/admin/config/system", checkAdminAccess, handleUpdateSystemConfig);
  app.get("/api/admin/users", checkAdminAccess, handleGetUsers);

  return app;
}
