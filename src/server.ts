import "dotenv/config";
import express, {type NextFunction, type Request, type Response } from "express";
import { analyzeRelationship } from "./ai-workers/relationshipWorker.js";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing from the .env file.");
}

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/ask", async (req, res, next) => {
  try {
    await analyzeRelationship(req, res);
    //res.json(result);
  } catch (error) {
    next(error);
  }
});

// Error-handling middleware must be last.
// It requires four parameters.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    error: err instanceof Error ? err.message : String(err)
  });
});

// app.listen(3001, () => {
//   console.log(`Family AI is running at http://localhost:${3001}`);
// });

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