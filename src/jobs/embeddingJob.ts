
import { redisClient } from "../../lib/cache";
import { generateEmbedding } from "../../lib/embedding";


// Generates and caches the user embedding using a simple sentence-based profile.
export async function generateAndCacheUserEmbedding(
  userId: string,
  interests: string[],
  sources: string[],
  contentTypes: string[]
): Promise<number[]> {
  const profileKey = `profile-embedding:${userId}`;
  
  // Build a concise profile string from user preferences.
  const profileText = `Interests: ${interests.join(", ")}. Sources: ${sources.join(", ")}. Types: ${contentTypes.join(", ")}.`;
  
  // Generate the embedding using a deterministic (fast) sentence transformer.
  const embedding = await generateEmbedding(profileText);
  
  // Cache the embedding for one day.
  await redisClient.setEx(profileKey, 86400, JSON.stringify(embedding));
  return embedding;
}
