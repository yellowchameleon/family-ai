import "dotenv/config";
import { type Request, type Response } from "express";
import OpenAI from "openai";

import { loadFamilyDocuments } from "../utilities/familyDocuments.js";
import { relationshipResponseFormat, RelationshipResult } from "../schemas/relationshipResult.js";
import { getRelationshipAssistantPrompt } from "../prompts/familyRelationshipAssistance.js";
import { RelationshipAnalysisError, StructuredResultError } from "../schemas/appErrors.js";


const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing from the .env file.");
}

const openai = new OpenAI({ apiKey });

export const analyzeRelationship = async (question: string): Promise<RelationshipResult> => {
  try {
    const documentContext = await loadFamilyDocuments();

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
            FAMILY INFORMATION CONTEXT
            ${documentContext}
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}
