import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummary(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // Start a chat session with Gemini
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  
  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}
