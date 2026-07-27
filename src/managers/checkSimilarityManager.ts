import { analyzeRelationship } from "../ai-workers/relationshipWorker.js";
import { type Request, type Response } from "express";
import { InvalidQuestionError } from "../schemas/appErrors.js";
import type { RelationshipResult } from "../schemas/relationshipResult.js";
import { checkSimilarity } from "../ai-workers/checkSimilarityWorker.js";

interface AskRequest {
  firstValue: string;
  secondValue: string;
}

export class CheckSimilarityManager {

  async ask(request: Request<unknown, unknown, AskRequest>, response: Response): Promise<void> {
    const firstValue = request.body.firstValue;
    const secondValue = request.body.secondValue; 
    
    if (typeof firstValue !== "string" || firstValue.trim().length === 0) {
        throw new InvalidQuestionError();
    }

    if (typeof secondValue !== "string" || secondValue.trim().length === 0) {
        throw new InvalidQuestionError();
    }

    const cleanedFirstValue = firstValue.trim();
    const cleanedSecondValue = secondValue.trim();

    const similarityScore: number = await checkSimilarity(cleanedFirstValue, cleanedSecondValue);

    response.json({
      firstValue: cleanedFirstValue,
      secondValue: cleanedSecondValue,
      answer: similarityScore
    });
  }
}