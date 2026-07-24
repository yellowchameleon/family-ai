import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "OPENAI_API_KEY is missing from the .env file."
  );
}

const openai = new OpenAI({
  apiKey
});

/**
 * 
 * 
 * @export
 * @param {string} text 
 * @returns {Promise<number[]>} 
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error("OpenAI did not return an embedding.");
  }

  console.log(
    `Created embedding with ${embedding.length} numbers.`
  );

  return embedding;
}

/**
 * 
 * 
 * @export
 * @param {number[]} firstVector 
 * @param {number[]} secondVector 
 * @returns {number} 
 */
export function calculateCosineSimilarity( firstVector: number[], secondVector: number[]): number {
  if (firstVector.length !== secondVector.length) {
    throw new Error(
      "Embedding vectors must have the same length."
    );
  }

  let dotProduct = 0;
  let firstMagnitude = 0;
  let secondMagnitude = 0;

  for (let index = 0; index < firstVector.length; index++) {
    const firstValue = firstVector[index];
    const secondValue = secondVector[index];

    dotProduct += firstValue * secondValue;
    firstMagnitude += firstValue * firstValue;
    secondMagnitude += secondValue * secondValue;
  }

  if (firstMagnitude === 0 || secondMagnitude === 0) {
    return 0;
  }

  return ( dotProduct / (Math.sqrt(firstMagnitude) * Math.sqrt(secondMagnitude))
  );
}