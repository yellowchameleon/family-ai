import { analyzeRelationship } from "../ai-workers/relationshipWorker.js";
import { type Request, type Response } from "express";
import { InvalidQuestionError } from "../schemas/appErrors.js";

interface AskRequest {
  question?: unknown;
}

export class RelationshipManager {

  async ask(request: Request<unknown, unknown, AskRequest>, response: Response): Promise<void> {
    const question = request.body.question;

    if (typeof question !== "string" || question.trim().length === 0) {
        throw new InvalidQuestionError();
    }

    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      throw new InvalidQuestionError();
    }

    const relationship = await analyzeRelationship(cleanedQuestion);

    response.json({
      question: question.trim(),
      answer: relationship
    });
  }
}