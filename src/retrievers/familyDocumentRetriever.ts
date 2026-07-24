import type { FamilyDocument } from "../utilities/familyDocuments.js";

export interface ScoredFamilyDocument {
  document: FamilyDocument;
  score: number;
}

export function getRelevantFamilyDocuments( question: string, documents: FamilyDocument[], topK = 3): ScoredFamilyDocument[] {
  const questionWords = extractSearchWords(question);

  const scoredDocuments: ScoredFamilyDocument[] =
    documents.map((document) => ({
      document,
      score: calculateDocumentScore(
        document,
        questionWords
      )
    }));

  return scoredDocuments
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
}

function calculateDocumentScore(
  document: FamilyDocument,
  questionWords: string[]
): number {
  const searchableText =
    `${document.filename} ${document.content}`.toLowerCase();

  return questionWords.reduce((score, word) => {
    return searchableText.includes(word)
      ? score + 1
      : score;
  }, 0);
}

function extractSearchWords(question: string): string[] {
  return question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word));
}

const stopWords = new Set([
  "the",
  "and",
  "how",
  "who",
  "what",
  "where",
  "when",
  "why",
  "is",
  "are",
  "was",
  "were",
  "to",
  "of",
  "related",
  "relationship"
]);