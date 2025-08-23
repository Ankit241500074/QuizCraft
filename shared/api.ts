/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Quiz generation types
 */
export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface TrueFalse {
  question: string;
  answer: "True" | "False";
}

export interface GeneratedQuiz {
  mcqs: MCQ[];
  true_false: TrueFalse[];
}

export interface QuizGenerationRequest {
  difficulty_level: "Easy" | "Medium" | "Hard";
  pdf_text: string;
  mcq_count?: number;
  true_false_count?: number;
  include_mcq?: boolean;
  include_true_false?: boolean;
}

export interface QuizGenerationResponse {
  success: boolean;
  quiz?: GeneratedQuiz;
  error?: string;
}

/**
 * Authentication types
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institution?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
