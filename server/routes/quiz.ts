import { RequestHandler } from "express";
import { QuizGenerationRequest, QuizGenerationResponse, GeneratedQuiz } from "@shared/api";
import OpenAI from "openai";

// Initialize OpenRouter client using OpenAI-compatible API
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1"
});

// Type definitions for quiz questions
interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

interface TrueFalse {
  question: string;
  answer: "True" | "False";
}

// Fallback quiz generation when OpenRouter API is unavailable
const handleFallbackQuizGeneration = (
  req: any,
  res: any,
  difficulty: string,
  pdfText: string,
  mcqCount: number,
  trueFalseCount: number,
  includeMCQ: boolean,
  includeTrueFalse: boolean
) => {
  // Analyze the text content to create relevant questions
  const sentences = pdfText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const words = pdfText.toLowerCase().split(/\s+/);
  const keyTerms = extractKeyTerms(pdfText);

  const fallbackQuiz: GeneratedQuiz = {
    mcqs: includeMCQ ? generateFallbackMCQs(sentences, keyTerms, difficulty, mcqCount) : [],
    true_false: includeTrueFalse ? generateFallbackTrueFalse(sentences, keyTerms, difficulty, trueFalseCount) : []
  };

  const response: QuizGenerationResponse = {
    success: true,
    quiz: fallbackQuiz
  };

  res.set('x-fallback-used', 'true');
  res.json(response);
};

// Extract key terms from the text
const extractKeyTerms = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'cannot', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'them', 'us', 'who', 'what', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'just', 'now', 'also', 'here', 'there', 'then', 'up', 'out', 'down', 'over', 'under', 'above', 'below', 'into', 'from', 'through', 'during', 'before', 'after', 'between', 'among', 'within', 'without'
  ]);

  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordCount: { [key: string]: number } = {};

  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  return Object.entries(wordCount)
    .filter(([word, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

// Generate MCQs based on content analysis
const generateFallbackMCQs = (sentences: string[], keyTerms: string[], difficulty: string, count: number = 3): MCQ[] => {
  const mcqs: MCQ[] = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    let sentenceIndex;
    do {
      sentenceIndex = Math.floor(Math.random() * sentences.length);
    } while (usedSentences.has(sentenceIndex) || sentences[sentenceIndex].trim().length < 50);

    usedSentences.add(sentenceIndex);
    const sentence = sentences[sentenceIndex].trim();

    // Create question based on difficulty
    let question: string;
    let correctAnswer: string;
    let options: string[];

    if (difficulty === "Easy") {
      // Simple recall questions
      const keyTerm = keyTerms[i % keyTerms.length] || "concept";
      question = `According to the material, what is mentioned about ${keyTerm}?`;
      correctAnswer = `It is discussed in relation to ${sentence.substring(0, 50)}...`;
      options = [
        correctAnswer,
        `It is primarily used for ${keyTerms[(i + 1) % keyTerms.length] || "analysis"}`,
        `It relates to ${keyTerms[(i + 2) % keyTerms.length] || "theory"}`,
        `It is not mentioned in the material`
      ];
    } else if (difficulty === "Medium") {
      // Application questions
      question = `How does the material suggest applying the concepts discussed?`;
      correctAnswer = `Through the methods described in the text`;
      options = [
        correctAnswer,
        `By ignoring the theoretical framework`,
        `Only in laboratory settings`,
        `Without considering practical implications`
      ];
    } else {
      // Analysis questions
      question = `What can be inferred from the discussion of ${keyTerms[i % keyTerms.length] || "the main concepts"}?`;
      correctAnswer = `The concepts require critical analysis and application`;
      options = [
        correctAnswer,
        `The concepts are purely theoretical`,
        `The concepts are outdated`,
        `The concepts lack empirical support`
      ];
    }

    mcqs.push({ question, options, answer: correctAnswer });
  }

  return mcqs;
};

// Generate True/False questions
const generateFallbackTrueFalse = (sentences: string[], keyTerms: string[], difficulty: string, count: number = 2): TrueFalse[] => {
  const trueFalse: TrueFalse[] = [];

  for (let i = 0; i < Math.min(count, keyTerms.length); i++) {
    const keyTerm = keyTerms[i];
    let question: string;
    let answer: "True" | "False";

    if (i % 2 === 0) {
      // True statements
      if (difficulty === "Easy") {
        question = `The material discusses ${keyTerm}.`;
      } else if (difficulty === "Medium") {
        question = `The concept of ${keyTerm} is explained within the educational context.`;
      } else {
        question = `The material provides sufficient detail about ${keyTerm} for practical application.`;
      }
      answer = "True";
    } else {
      // False statements
      if (difficulty === "Easy") {
        question = `The material completely ignores the topic of ${keyTerm}.`;
      } else if (difficulty === "Medium") {
        question = `The material suggests that ${keyTerm} is irrelevant to the subject.`;
      } else {
        question = `The material concludes that ${keyTerm} has no practical applications.`;
      }
      answer = "False";
    }

    trueFalse.push({ question, answer });
  }

  return trueFalse;
};

const generateDeepSeekPrompt = (
  pdfText: string,
  difficulty: string,
  mcqCount: number,
  trueFalseCount: number,
  includeMCQ: boolean,
  includeTrueFalse: boolean
): string => {
  const difficultyInstructions = {
    Easy: "basic recall and simple concepts",
    Medium: "understanding, application, and moderate reasoning",
    Hard: "critical thinking, deeper reasoning, and applied problem-solving"
  };

  let questionTypes = "";
  if (includeMCQ && includeTrueFalse) {
    questionTypes = `- ${mcqCount} Multiple-Choice Questions (MCQs) with exactly 4 options each.\n- ${trueFalseCount} True/False questions.`;
  } else if (includeMCQ) {
    questionTypes = `- ${mcqCount} Multiple-Choice Questions (MCQs) with exactly 4 options each.`;
  } else if (includeTrueFalse) {
    questionTypes = `- ${trueFalseCount} True/False questions.`;
  }

  return `You are an expert educational content creator. Your task is to generate high-quality quiz questions from the provided study material. The user uploading the material is a teacher, and your output should be ready for classroom use.

Guidelines:

Difficulty level: ${difficulty} (${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}).

Types of questions to generate:
${questionTypes}

For MCQs:
- Ensure only one correct answer.
- Distractor options should be plausible but incorrect.
- Clearly mark the correct answer.

For True/False:
- Keep statements factually accurate and based on the provided content.
- Clearly state the correct answer (True/False).

Output format must be structured JSON in this schema:
{
${includeMCQ ? `"mcqs": [
{
"question": "...",
"options": ["A", "B", "C", "D"],
"answer": "..."
}
],` : `"mcqs": [],`}
${includeTrueFalse ? `"true_false": [
{
"question": "...",
"answer": "True/False"
}
]` : `"true_false": []`}
}

Study material:
${pdfText}

Please respond with ONLY the JSON output, no additional text or explanations.`;
};

export const handleQuizGeneration: RequestHandler = async (req, res) => {
  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: QuizGenerationResponse = {
        success: false,
        error: "Authentication required. Please log in."
      };
      return res.status(401).json(response);
    }

    // Validate the token (basic validation)
    const token = authHeader.substring(7);
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (!decoded.userId || !decoded.timestamp) {
        throw new Error("Invalid token structure");
      }
      // Token is valid, continue with quiz generation
    } catch (tokenError) {
      console.error("Invalid auth token:", tokenError);
      const response: QuizGenerationResponse = {
        success: false,
        error: "Invalid authentication token. Please log in again."
      };
      return res.status(401).json(response);
    }

    const {
      difficulty_level,
      pdf_text,
      mcq_count = 3,
      true_false_count = 2,
      include_mcq = true,
      include_true_false = true
    }: QuizGenerationRequest = req.body;

    if (!pdf_text || !difficulty_level) {
      const response: QuizGenerationResponse = {
        success: false,
        error: "Missing required fields: pdf_text and difficulty_level"
      };
      return res.status(400).json(response);
    }

    if (!include_mcq && !include_true_false) {
      const response: QuizGenerationResponse = {
        success: false,
        error: "Please select at least one question type (MCQ or True/False)"
      };
      return res.status(400).json(response);
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.log("OpenRouter API key not configured, using fallback generation");
      return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
    }

    try {
      // Generate quiz using OpenRouter DeepSeek
      const prompt = generateDeepSeekPrompt(pdf_text, difficulty_level, mcq_count, true_false_count, include_mcq, include_true_false);

      console.log("Sending request to OpenRouter with DeepSeek model...");
      
      const completion = await openrouter.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      // Extract the JSON from OpenRouter DeepSeek's response
      const responseText = completion.choices[0]?.message?.content || '';
      console.log("Received response from OpenRouter:", responseText.substring(0, 200) + "...");

      // Try to parse the JSON response
      let generatedQuiz: GeneratedQuiz;
      try {
        // Clean the response in case DeepSeek includes markdown formatting
        const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
        generatedQuiz = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse OpenRouter DeepSeek response:", responseText);
        console.log("Falling back to content analysis due to parse error");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      }

      // Validate the structure
      if (!generatedQuiz.mcqs || !generatedQuiz.true_false ||
          !Array.isArray(generatedQuiz.mcqs) || !Array.isArray(generatedQuiz.true_false)) {
        console.error("Invalid quiz structure from AI");
        console.log("Falling back to content analysis due to invalid structure");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      }

      console.log("Successfully generated quiz with OpenRouter DeepSeek");
      const response: QuizGenerationResponse = {
        success: true,
        quiz: generatedQuiz
      };

      res.json(response);

    } catch (aiError: any) {
      console.error("OpenRouter DeepSeek AI error:", aiError);

      // Handle specific OpenRouter API errors
      if (aiError.status === 400) {
        console.log("AI service bad request, switching to fallback generation");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      } else if (aiError.status === 401) {
        console.log("OpenRouter API authentication failed, switching to fallback generation");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      } else if (aiError.status === 429) {
        console.log("AI API rate limit exceeded, switching to fallback generation");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      } else if (aiError.status === 500 || aiError.status >= 500) {
        console.log("AI service server error, switching to fallback generation");
        return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
      }

      // For other errors, use fallback
      console.log("Unknown AI error, switching to fallback generation");
      return handleFallbackQuizGeneration(req, res, difficulty_level, pdf_text, mcq_count, true_false_count, include_mcq, include_true_false);
    }

  } catch (error) {
    console.error("Error generating quiz:", error);
    const response: QuizGenerationResponse = {
      success: false,
      error: "Internal server error while generating quiz"
    };
    res.status(500).json(response);
  }
};
