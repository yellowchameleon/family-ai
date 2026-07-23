export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidQuestionError extends AppError {
  constructor() {
    super("The request must contain a non-empty question.", 400);
  }
}

export class RelationshipAnalysisError extends AppError {
  constructor() {
    super("Unable to analyze the relationship.", 400);
  }
}

export class StructuredResultError extends AppError {
  constructor() {
    super("The model did not return a structured result.", 502);
  }
}
