import { Router } from "express";
import { adminAuth } from "../lib/firebase/admin.js";
import { CreditService } from "../lib/credits/credit.service.js";

const authRouter = Router();

authRouter.post("/init", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Explicitly init user
    await CreditService.checkAndInitializeUser(decodedToken.uid, {
      email: decodedToken.email,
      name: decodedToken.name,
      photoURL: decodedToken.picture
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Auth init failed:", error);
    return res.status(401).json({ error: "Invalid token or init failed" });
  }
});

export default authRouter;
