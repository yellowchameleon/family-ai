import "dotenv/config";
import OpenAI from "openai";

import { FamilyDocument, loadFamilyDocuments } from "../utilities/familyDocuments.js";
import { relationshipResponseFormat, RelationshipResult } from "../schemas/relationshipResult.js";
import { getRelationshipAssistantPrompt } from "../prompts/familyRelationshipAssistance.js";
import { StructuredResultError } from "../schemas/appErrors.js";


const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing from the .env file.");
}

const openai = new OpenAI({ apiKey });

export const analyzeRelationship = async (question: string): Promise<RelationshipResult> => {
  const familyDocuments: FamilyDocument[] = await loadFamilyDocuments();

  const familyDocumentsContent = familyDocuments.map((document) =>
    `DOCUMENT: ${document.filename}\n${document.content.trim()}`
  ).join("\n\n---\n\n");

  const result = await openai.responses.parse({
    model: process.env.OPENAI_MODEL ?? "gpt-5.6",

    input: 
    [
      {
        role: "system",
        content: getRelationshipAssistantPrompt()
      },
      {
        role: "user",
        content: `
          FAMILY TREE INFORMATION
          ${familyDocumentsContent}
          QUESTION
          ${question.trim()}
        `
      }
    ],
    text: {
      format: relationshipResponseFormat
    }
  });

  const parsedResult = result.output_parsed;

  if (!parsedResult) {
    throw new StructuredResultError();
  }

  return parsedResult;
};
