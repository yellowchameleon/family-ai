import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

export const EvidenceSchema = z.object({
  fact: z.string(),
  source: z.string()
});

export const RelationshipResultSchema = z.object({
  person1InputName: z.string(),
  person1IdentifiedAs: z.string(),
  person2InputName: z.string(),
  person2IdentifiedAs: z.string(),
  relationship: z.string(),
  explanation: z.string(),
  evidence: z.array(EvidenceSchema),
  confidence: z.enum(["high", "medium", "low"]),
  answerFound: z.boolean()
});

export type RelationshipResult = z.infer<
  typeof RelationshipResultSchema
>;

export const relationshipResponseFormat =
    zodTextFormat(
        RelationshipResultSchema,
        "relationship-result"
    );