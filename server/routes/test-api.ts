import { RequestHandler } from "express";
import OpenAI from "openai";

export const testOpenRouterAPI: RequestHandler = async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.json({
        success: false,
        error: "OPENROUTER_API_KEY not set"
      });
    }

    console.log("Testing OpenRouter API with key:", apiKey.substring(0, 20) + "...");

    const openrouter = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const completion = await openrouter.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test. Please respond with 'API Working'"
        }
      ],
      max_tokens: 10,
      temperature: 0.3
    });

    const responseText = completion.choices[0]?.message?.content || '';

    return res.json({
      success: true,
      response: responseText,
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      apiKeyPrefix: apiKey.substring(0, 20) + "..."
    });

  } catch (error: any) {
    console.error("OpenRouter test error:", error);
    
    return res.json({
      success: false,
      error: error.message,
      status: error.status,
      details: error.error || error
    });
  }
};
