// lib/verify.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const verifyWithGemini = async (formData: any) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("Missing Gemini API key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Please verify if this is a legitimate tech opportunity for women:

    Name: ${formData.name}
    Organization: ${formData.organization}
    Description: ${formData.description}
    Eligibility: ${formData.eligibility}
    URL: ${formData.url}

    Respond with a JSON object only:
    Respond with *only* a raw JSON object, no formatting, no code block.

    {
      "isValid": true/false,
      "confidence": 0-100,
      "reason": "Brief reason"
    }
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });

  const raw = await result.response.text();

  // 🧽 Clean the Gemini output by stripping markdown like ```json ... ```
  const cleaned = raw
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", cleaned);
    throw err;
  }
};
