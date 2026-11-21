export type CreditFeature = 
  | "GENERATE_QUESTION_FROM_CHAT"
  | "PLAYLIST"
  | "STUDY_HELP"
  | "SIMILAR_QUESTION"
  | "OCR_TESSERACT"
  | "GENERATE_STUDIPATH";

export type TransactionType = "initial_grant" | "monthly_bonus" | "consume" | "refund";

export interface UserCreditData {
  uid: string;
  name?: string;
  email?: string;
  photoURL?: string;
  creditsUnits: number;
  monthlyBonusUnits: number;
  dailyUsedUnits: number;
  dailyLimitUnits: number;
  lastMonthlyBonusAt: string | null;
  lastDailyResetAt: string | null;
  role: "free" | "beta" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id?: string;
  userId: string;
  type: TransactionType;
  amountUnits: number;
  feature?: CreditFeature;
  reason: string;
  requestId?: string;
  balanceBeforeUnits: number;
  balanceAfterUnits: number;
  createdAt: string;
}

export interface AiRequestLog {
  id?: string;
  userId: string;
  feature: CreditFeature;
  model: string;
  apiKeyId: string;
  creditCostUnits: number;
  status: "pending" | "success" | "failed" | "refunded";
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
