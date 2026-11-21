import { CreditFeature } from './credit.types.js';

export class CreditService {
  static async checkAndInitializeUser(uid: string, fallbackData?: any) {
    // In AI Studio, adminDb lacks IAM permissions for user-provided Firebase projects.
    // Initialization is handled by the client-side AuthContext fallback.
    return true;
  }

  static async deductForFeature(uid: string, feature: CreditFeature, costUnits: number, model: string, apiKeyId: string): Promise<{ requestId: string }> {
    // Relying on frontend to handle the credit management
    return { requestId: 'req-' + Date.now() };
  }

  static async completeRequest(requestId: string) {
    // no-op
  }

  static async refundRequest(requestId: string, errorMessage: string) {
    // no-op
  }
}

