import { analyzeRelationship } from "../ai-workers/relationshipWorker.js";
import { type Request, type Response } from "express";
import { InvalidQuestionError } from "../schemas/appErrors.js";
import type { RelationshipResult } from "../schemas/relationshipResult.js";

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

    const relationshipResult: RelationshipResult = await analyzeRelationship(cleanedQuestion);

    response.json({
      question: question.trim(),
      personOneName: relationshipResult.person1InputName,
      personOneIdentifier: relationshipResult.person1IdentifiedAs,
      personTwoName: relationshipResult.person2InputName,
      personTwoIdentifier: relationshipResult.person2IdentifiedAs,
      person2: relationshipResult.person2InputName  ,
      answer: relationshipResult.relationship,
      explanation: relationshipResult.explanation,
      evidence: relationshipResult.evidence,
      confidence: relationshipResult.confidence,
      answerFound: relationshipResult.answerFound
    });
  }
}