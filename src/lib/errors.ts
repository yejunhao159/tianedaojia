export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AIServiceError extends AppError {
  constructor(message: string) {
    super(message, "AI_SERVICE_ERROR", 502);
    this.name = "AIServiceError";
  }
}
