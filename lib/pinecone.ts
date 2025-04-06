// lib/pinecone.ts
import dotenv from "dotenv";
dotenv.config();

import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
if (!PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set in the environment.");
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "quickstart";
const PINECONE_INDEX_2NAME = process.env.PINECONE_INDEX_2NAME || "board";

console.log("Pinecone API Key:", PINECONE_API_KEY); // Debug log: remove this in production

export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const index = pinecone.index(PINECONE_INDEX_NAME);
export const index2 = pinecone.index(PINECONE_INDEX_2NAME);
