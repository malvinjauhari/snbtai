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
    error instanceof Error ? error.message : error
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
    error instanceof Error ? error.message : error
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
    // message.includes("api key not valid") || // include all 400
    message.includes("permission denied") ||
    message.includes("api key not valid")
  );
}
