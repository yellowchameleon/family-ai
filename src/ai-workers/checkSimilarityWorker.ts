import "dotenv/config";
import { calculateCosineSimilarity, createEmbeddings } from "../utilities/embeddings.js";


export const checkSimilarity = async (firstString: string, secondString: string): Promise<number> => {
  const [firstStringEmbedding, secondStringEmbedding] = await createEmbeddings([firstString, secondString]);
  const similarityScore:number = calculateCosineSimilarity(firstStringEmbedding, secondStringEmbedding);

  return similarityScore;
};
