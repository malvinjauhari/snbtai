import { GoogleGenAI } from "@google/genai";

export type GeminiKeyLabel = "KEY_1" | "KEY_2" | "KEY_3" | "KEY_DEFAULT";

export type GeminiApiKeyConfig = {
  label: GeminiKeyLabel;
  key: string;
  disabledUntil?: number | null;
  lastFailureReason?: string | null;
};

// Determine disable duration based on error type
export function getDisableDurationMs(error: unknown): number {
  const message = String(
    error instanceof Error ? error.message : JSON.stringify(error)
  ).toLowerCase();

  if (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  ) {
    return 60 * 1000;
  }

  if (
    message.includes("quota") ||
    message.includes("credit") ||
    message.includes("resource_exhausted")
  ) {
    return 10 * 60 * 1000; // 10 mins
  }

  if (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("api key not valid") ||
    message.includes("permission denied")
  ) {
    return 30 * 60 * 1000; // 30 mins
  }

  return 60 * 1000;
}

// Identify if the error requires a fallback
export function isQuotaOrAuthError(error: unknown): boolean {
  const message = String(
    error instanceof Error ? error.message : JSON.stringify(error)
  ).toLowerCase();

  return (
    message.includes("quota") ||
    message.includes("credit") ||
    message.includes("rate limit") ||
    message.includes("rate_limit") ||
    message.includes("resource_exhausted") ||
    message.includes("too many requests") ||
    message.includes("429") ||
    message.includes("403") ||
    message.includes("401") ||
    message.includes("permission denied") ||
    message.includes("api key not valid")
  );
}

const geminiApiKeys: GeminiApiKeyConfig[] = [
  {
    label: "KEY_1",
    key: process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || "",
    disabledUntil: null,
    lastFailureReason: null,
  },
  {
    label: "KEY_2",
    key: process.env.GEMINI_API_KEY_2 || "",
    disabledUntil: null,
    lastFailureReason: null,
  },
  {
    label: "KEY_3",
    key: process.env.GEMINI_API_KEY_3 || "",
    disabledUntil: null,
    lastFailureReason: null,
  },
];

function isKeyTemporarilyDisabled(keyConfig: GeminiApiKeyConfig) {
  return Boolean(
    keyConfig.disabledUntil && Date.now() < keyConfig.disabledUntil
  );
}

export async function executeAiRequest(
  method: (aiClient: any, model: string) => Promise<any>,
  modelName: string = process.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"
): Promise<{ result: any; apiKeyId: string }> {
  const errors: Array<{
    keyLabel: string;
    message: string;
  }> = [];

  for (const keyConfig of geminiApiKeys) {
    if (!keyConfig.key) {
      // Missing API key environment variable, ignore
      continue;
    }

    if (isKeyTemporarilyDisabled(keyConfig)) {
      errors.push({
        keyLabel: keyConfig.label,
        message: `Temporarily disabled until ${new Date(
          keyConfig.disabledUntil!
        ).toISOString()}`,
      });
      continue;
    }

    try {
      console.info(`[Gemini Router] Using ${keyConfig.label}`);
      
      const ai = new GoogleGenAI({ apiKey: keyConfig.key });
      const result = await method(ai, modelName);

      console.info(`[Gemini Router] Success with ${keyConfig.label}`);

      return { result, apiKeyId: keyConfig.label };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);

      errors.push({
        keyLabel: keyConfig.label,
        message: errorMessage,
      });

      console.warn(
        `[Gemini Router] ${keyConfig.label} failed: ${errorMessage}`
      );

      if (isQuotaOrAuthError(error) || error.status === 429 || error.status === 400 || error.status === 503) {
        keyConfig.disabledUntil = Date.now() + getDisableDurationMs(error);
        keyConfig.lastFailureReason = errorMessage;

        console.warn(
          `[Gemini Router] ${keyConfig.label} temporarily disabled. Trying next key.`
        );

        continue;
      }

      // If it's a non-quota error, throw it immediately without falling back
      throw error;
    }
  }

  throw new Error(
    `ALL_GEMINI_KEYS_FAILED: ${JSON.stringify(
      errors.map((item) => ({
        keyLabel: item.keyLabel,
        message: item.message,
      }))
    )}`
  );
}
