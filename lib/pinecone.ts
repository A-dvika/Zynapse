// lib/pinecone.ts
import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "quickstart";

export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const index = pinecone.index(PINECONE_INDEX_NAME);
