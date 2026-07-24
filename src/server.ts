import "dotenv/config";
import express, {type NextFunction, type Request, type Response } from "express";
import { AppError } from "./schemas/appErrors.js";
import { RelationshipManager } from "./managers/relationshipManager.js";
import { CheckSimilarityManager } from "./managers/checkSimilarityManager.js";
import { initializeFamilyDocumentIndex } from "./indexers/familyDocumentIndexer.js";
import type { Server } from "http";

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

app.post("/checkSimilarity", async (req, res, next) => {
  const checkSimilarityManager = new (CheckSimilarityManager)();

  try {
    await checkSimilarityManager.ask(req, res);
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


async function startServer(): Promise<Server> {
  try {
    await initializeFamilyDocumentIndex();

    const server = app.listen(3001, () => {
      console.log("Family AI is running at http://localhost:3001");
      console.log("Server listening:", server.address());
    });
    return server;
  } catch (error) {
    console.error("Application startup failed:",error);
    throw error;
  }
}

const server = await startServer();

server.on("error", (error) => {
  console.error("Server error:", error);
});

server.on("close", () => {
  console.log("Server was closed.");
});