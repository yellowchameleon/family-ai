import "dotenv/config";
import { calculateCosineSimilarity, createEmbedding } from "../utilities/embeddings.js";


export const checkSimilarity = async (firstString: string, secondString: string): Promise<number> => {
  const firstStringEmbeddingVector: number[] = await createEmbedding(firstString);
  const secondStringEmbeddingVector: number[] = await createEmbedding(secondString);

  const similarityScore:number = calculateCosineSimilarity(firstStringEmbeddingVector, secondStringEmbeddingVector);

  return similarityScore;
};
