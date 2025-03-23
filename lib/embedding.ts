// lib/embedding.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function generateEmbedding(text: string): Promise<number[]> {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) {
    throw new Error("COHERE_API_KEY is not set.");
  }

  // Cohere's embedding endpoint 
  const url = "https://api.cohere.ai/embed";

  try {
    const response = await axios.post(
      url,
      {
        texts: [text],
       
        model: "embed-english-light-v2.0",
      },
      {
        headers: {
          "Authorization": `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // The response should include an "embeddings" field as an array of arrays.
    // We only passed one text, so we extract the first embedding.
    const embedding = response.data.embeddings[0] as number[];
    return embedding;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error generating embedding with Cohere:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error generating embedding with Cohere:", error.message);
    } else {
      console.error("Error generating embedding with Cohere:", error);
    }
    throw error;
  }
}
