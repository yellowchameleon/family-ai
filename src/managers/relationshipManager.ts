import { analyzeRelationship } from "../ai-workers/relationshipWorker.js";
import { type Request, type Response } from "express";
import { InvalidQuestionError } from "../schemas/appErrors.js";
import type { RelationshipResult } from "../schemas/relationshipResult.js";
import { getSemanticallyRelevantFamilyDocuments } from "../retrievers/semanticFamilyDocumentRetriever.js";
import type { SemanticFamilyDocument } from "../retrievers/semanticFamilyDocumentRetriever.js";
import type { FamilyDocument } from "../utilities/familyDocuments.js";

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

    const relevantFamilyDocuments: SemanticFamilyDocument[] = await getSemanticallyRelevantFamilyDocuments(cleanedQuestion, 3);
    const familyDocumentsForAnalysis: FamilyDocument[] = relevantFamilyDocuments.map((result) => result.document);
    console.log(`Number of Semantically relevant family documents: ${familyDocumentsForAnalysis.length}`);


    const relationshipResult: RelationshipResult = await analyzeRelationship(cleanedQuestion, familyDocumentsForAnalysis);

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