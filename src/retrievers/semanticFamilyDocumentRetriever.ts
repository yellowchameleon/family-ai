import { getEmbeddedFamilyDocuments, type EmbeddedFamilyDocument } from "../indexers/familyDocumentIndexer.js";
import { createEmbedding, calculateCosineSimilarity } from "../utilities/embeddings.js";

export interface SemanticFamilyDocument {
  document: EmbeddedFamilyDocument["document"];
  similarity: number;
}

export async function getSemanticallyRelevantFamilyDocuments( question: string, topK = 3 ): Promise<SemanticFamilyDocument[]> {
  console.log( "Starting semantic retrieval for question:", question );

  const questionEmbedding = await createEmbedding(question);
  const embeddedDocuments = getEmbeddedFamilyDocuments();

  const scoredDocuments = embeddedDocuments.map((embeddedDocument) => {
      const similarity = calculateCosineSimilarity( questionEmbedding, embeddedDocument.embedding );

      return {
        document: embeddedDocument.document,
        similarity
      };
    });

  const selectedDocuments = scoredDocuments.sort((left, right) => right.similarity - left.similarity).slice(0, topK);

  console.log("Semantic retriever results:", selectedDocuments.map((item) => ({filename: item.document.filename, similarity: item.similarity})));

  return selectedDocuments;
}