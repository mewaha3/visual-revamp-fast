
import { pipeline } from '@huggingface/transformers';

// Cache for the embedding model to avoid loading it multiple times
let embeddingModel: any = null;

// Function to get or initialize the embedding model
export const getEmbeddingModel = async () => {
  if (!embeddingModel) {
    try {
      console.log("Loading text embedding model...");
      // Use a smaller model that's similar to all-mpnet-base-v2 but works in browser
      embeddingModel = await pipeline(
        "feature-extraction",
        "mixedbread-ai/mxbai-embed-xsmall-v1"
      );
      console.log("Text embedding model loaded successfully");
    } catch (error) {
      console.error("Failed to load embedding model:", error);
      throw error;
    }
  }
  return embeddingModel;
};

// Get embeddings for a text
export const getTextEmbedding = async (text: string) => {
  try {
    const model = await getEmbeddingModel();
    const embedding = await model(text, { pooling: "mean", normalize: true });
    return embedding.tolist()[0]; // Get the first (and only) embedding as an array
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

// Calculate cosine similarity between two vector arrays
export const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
  if (!vec1 || !vec2 || vec1.length === 0 || vec2.length === 0 || vec1.length !== vec2.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }
  
  return dotProduct / (mag1 * mag2);
};

// Calculate text similarity using embeddings
export const calculateTextSimilarity = async (text1: string, text2: string): Promise<number> => {
  try {
    if (!text1 || !text2) {
      return 0;
    }
    
    const embedding1 = await getTextEmbedding(text1);
    const embedding2 = await getTextEmbedding(text2);
    
    if (!embedding1 || !embedding2) {
      return 0;
    }
    
    return cosineSimilarity(embedding1, embedding2);
  } catch (error) {
    console.error("Error calculating text similarity:", error);
    return 0;
  }
};

// Fallback to simpler string similarity when embeddings fail
export const calculateSimpleStringSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) {
    return 0;
  }
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Count matching words
  const words1 = s1.split(/\s+|,/).filter(Boolean);
  const words2 = s2.split(/\s+|,/).filter(Boolean);
  
  const commonWords = words1.filter(word => words2.includes(word)).length;
  return commonWords / Math.max(words1.length, words2.length, 1);
};
