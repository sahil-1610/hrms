// @/helpers/geminiAIModel.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

// Initialize the GoogleGenerativeAI instance with your API key.
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Get the desired generative model.
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Define safety settings.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Define generation configuration.
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

/**
 * Sends a prompt to Gemini AI and returns the AI's response text.
 * @param prompt - The prompt/message to send.
 * @returns A promise that resolves to the response text.
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt provided");
  }
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    throw new Error(`AI Processing error: ${error.message}`);
  }
}

/**
 * Initiates a chat session with Gemini AI and returns the response text.
 * @param prompt - The message to send.
 * @returns A promise that resolves to the chat response text.
 */
export async function chatWithAI(prompt: string): Promise<string> {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt provided");
  }
  try {
    // Start a new chat session with the provided generation configuration and safety settings.
    const chat = await model.startChat({
      generationConfig,
      safetySettings,
    });
    // Send the prompt and wait for the response.
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw new Error(`Chat Processing error: ${error.message}`);
  }
}
