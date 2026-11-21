import { Router } from "express";
import { adminAuth } from "../lib/firebase/admin.js";
import { CreditService } from "../lib/credits/credit.service.js";
import { executeAiRequest } from "../lib/ai/gemini.client.js";
import { CreditFeature } from "../lib/credits/credit.types.js";
import { CREDIT_PRICING, CREDIT_MULTIPLIER } from "../lib/credits/credit.constants.js";

const aiRouter = Router();

// Middleware to verify Firebase ID Token
aiRouter.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

function getCostForFeature(feature: CreditFeature, payload?: any): number {
  let cost = CREDIT_PRICING[feature] || 0;
  
  if (feature === 'STUDY_HELP') {
    // Dynamic cost based on complexity? For now let's say 1.
    // If it's short, maybe 0.5. We can just use 1.
    cost = CREDIT_PRICING.STUDY_HELP_CHAT_NORMAL;
  }
  
  return cost * CREDIT_MULTIPLIER;
}

// Ensure user has their credits initialized
aiRouter.use(async (req, res, next) => {
  const uid = (req as any).user.uid;
  try {
    const fallbackData = { 
      email: (req as any).user.email,
      name: (req as any).user.name,
      photoURL: (req as any).user.picture
    };
    await CreditService.checkAndInitializeUser(uid, fallbackData);
    next();
  } catch (err) {
    console.error("Failed to initialize user credit:", err);
    return res.status(500).json({ error: "Internal Server Error during user init" });
  }
});

aiRouter.post("/generate", async (req, res) => {
  const uid = (req as any).user.uid;
  const { feature, contents, config } = req.body;

  if (!feature) {
    return res.status(400).json({ error: "feature is required" });
  }

  const costUnits = getCostForFeature(feature as CreditFeature);

  let requestId: string | null = null;
  let deducted = false;

  try {
    // 1. Deduct Credit Before Call
    if (costUnits > 0) {
      try {
        const result = await CreditService.deductForFeature(
          uid, 
          feature as CreditFeature, 
          costUnits, 
          process.env.VITE_GEMINI_MODEL || "gemini-2.5-flash", 
          "pending-key" // Will be updated
        );
        requestId = result.requestId;
        deducted = true;
      } catch (err: any) {
        if (err.message === 'INSUFFICIENT_CREDITS' || err.message === 'DAILY_LIMIT_EXCEEDED') {
          return res.status(403).json({ error: err.message });
        }
        throw err;
      }
    }

    // 2. Call Gemini
    const { result, apiKeyId } = await executeAiRequest(async (ai, model) => {
      // Compatibility with different call styles
      let reqContents = contents;
      if (typeof contents === 'string') {
        reqContents = [{ role: 'user', parts: [{ text: contents }] }];
      }

      const response = await ai.models.generateContent({
        model,
        contents: reqContents,
        config: config
      });
      return response.text;
    });

    // 3. Complete Transaction
    if (requestId) {
      await CreditService.completeRequest(requestId);
      // Wait, we can optionally update apiKeyId utilized, but it's okay for now.
    }

    return res.json({ text: result });
  } catch (error: any) {
    console.error(`AI Request failed for ${uid}:`, error.message);
    
    // 4. Refund on failure!
    if (deducted && requestId) {
      try {
        const errorMsg = error.message || String(error);
        await CreditService.refundRequest(requestId, errorMsg);
      } catch (refundErr) {
        console.error("CRITICAL: Failed to refund credit:", refundErr);
      }
    }

    if (error.message && error.message.includes("ALL_GEMINI_KEYS_FAILED")) {
      return res.status(503).json({
        success: false,
        error: "AI service is temporarily unavailable. Please try again later.",
        code: "ALL_GEMINI_KEYS_FAILED"
      });
    }

    return res.status(500).json({ error: "Failed to generate AI response: " + error.message });
  }
});

export default aiRouter;
