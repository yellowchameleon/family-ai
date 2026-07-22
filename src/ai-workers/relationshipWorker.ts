import "dotenv/config";
import express, { type Request, type Response } from "express";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { loadFamilyDocuments } from "../utilities/familyDocuments.js";
import { RelationshipResultSchema } from "../schemas/relationshipResult.js";
import { getRelationshipAssistantPrompt } from "../prompts/familyRelationshipAssistance.js";


const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing from the .env file.");
}

const openai = new OpenAI({ apiKey });


interface AskRequest {
  question?: unknown;
}

export const analyzeRelationship = async (request: Request<unknown, unknown, AskRequest>, response: Response) => {
  try {
    const question = request.body.question;

    if (typeof question !== "string" || question.trim().length === 0) {
      response.status(400).json({
        error: "The request must contain a non-empty question."
      });
      return;
    }

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
              FAMILY DOCUMENTS
              ${documentContext}
              QUESTION
              ${question.trim()}
            `
          }
        ],
        text: {
          format: zodTextFormat(RelationshipResultSchema, "family-relationship")
        }
      });

      const parsedResult = result.output_parsed;

      if (!parsedResult) {
        throw new Error("The model did not return a structured result.");
      }

    response.json({
      question: question.trim(),
      answer: parsedResult
    });
  } catch (error) {
    console.error(error);
  }
}
