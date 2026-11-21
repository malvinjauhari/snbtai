import express from "express";

import aiRouter from "./aiRouter";
import authRouter from "./authRouter";

/**
 * Builds the Express app used both by the local dev server (server.ts)
 * and by the Vercel serverless functions (api/*).
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "SNBT AI Backend is running" });
  });

  app.use("/api/ai", aiRouter);
  app.use("/api/auth", authRouter);

  return app;
}

export default createApp;
