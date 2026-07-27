import { loadFamilyDocuments, type FamilyDocument } from "../utilities/familyDocuments.js";
import { createEmbeddings} from "../utilities/embeddings.js";

export interface EmbeddedFamilyDocument {
  document: FamilyDocument;
  embedding: number[];
}

let embeddedFamilyDocuments: EmbeddedFamilyDocument[] = [];

/**
 * 
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function initializeFamilyDocumentIndex():Promise<void> {
  console.log("Initializing family document index...");

  const documents = await loadFamilyDocuments();

  const documentTexts = documents.map((document) => `${document.filename}\n${document.content}`);

  const embeddings = await createEmbeddings(documentTexts);

  embeddedFamilyDocuments = documents.map((document, index) => {
      const embedding = embeddings[index];

      if (!embedding) {
        throw new Error(`Missing embedding for ${document.filename}.`);
      }

      return {
        document,
        embedding
      };
    }
  );

  console.log("Family document index initialized:", embeddedFamilyDocuments.map((item) => ({
      filename: item.document.filename,
      embeddingLength: item.embedding.length
    }))
  );
}

export function getEmbeddedFamilyDocuments(): EmbeddedFamilyDocument[] {
  if (embeddedFamilyDocuments.length === 0) {
    throw new Error("Family document index has not been initialized.");
  }

  return embeddedFamilyDocuments;
}