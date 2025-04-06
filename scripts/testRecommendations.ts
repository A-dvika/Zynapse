import { index2 } from "../lib/pinecone"; // Ensure this points to your "board" index
import axios from "axios";

/**
 * Generate an embedding for a given text using Cohere.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) throw new Error("COHERE_API_KEY is not set.");
  const url = "https://api.cohere.ai/embed";
  console.log(`Generating embedding for query: "${text}"...`);

  try {
    const response = await axios.post(
      url,
      {
        texts: [text],
        model: "embed-english-light-v2.0",
      },
      {
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const embedding = response.data.embeddings[0] as number[];
    console.log(`Embedding generated with dimension: ${embedding.length}`);
    return embedding;
  } catch (error: any) {
    console.error("Error generating embedding for query:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Query Pinecone with the generated embedding and print the results.
 */
async function testQuery(queryText: string) {
  try {
    // Generate embedding for the search query
    const embedding = await generateEmbedding(queryText);

    // Query Pinecone for the top 5 similar vectors
    const queryResponse = await index2.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log(`\nPinecone Query Results for: "${queryText}"`);
    queryResponse.matches.forEach((match: any, index: number) => {
      console.log(`\nResult ${index + 1}:`);
      console.log(`ID: ${match.id}`);
      console.log(`Score: ${match.score}`);
      console.log(`Metadata: ${JSON.stringify(match.metadata, null, 2)}`);
    });
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
}


testQuery("Reddit posts on cybersecurity best practices");
