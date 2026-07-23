import "dotenv/config";
import express, {type NextFunction, type Request, type Response } from "express";
import { AppError } from "./schemas/appErrors.js";
import { RelationshipManager } from "./managers/relationshipManager.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/analyzeRelationship", async (req, res, next) => {
  const relationshipManager = new RelationshipManager();

  try {
    await relationshipManager.ask(req, res);
  } catch (error) {
    next(error);
  }
});

// Error-handling middleware must be last.
// It requires four parameters.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: err instanceof Error ? err.message : String(err)
  });
});

const server = app.listen(3001, () => {
  console.log("Family AI is running at http://localhost:3001");
  console.log("Server listening:", server.address());
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

server.on("close", () => {
  console.log("Server was closed.");
});