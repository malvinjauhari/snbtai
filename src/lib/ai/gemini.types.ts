export type ApiKeyState = {
  id: string;
  key: string;
  status: "active" | "cooldown" | "disabled";
  requestCount: number;
  errorCount: number;
  lastUsedAt?: number;
  cooldownUntil?: number;
};
