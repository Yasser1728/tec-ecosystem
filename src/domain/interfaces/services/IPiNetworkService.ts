/**
 * Pi Network Service Interface - TEC Assistant Domain
 * Contract for Pi Network integration
 */

export interface PiAuthResult {
  uid: string;
  username: string;
  walletAddress?: string;
  accessToken: string;
}

export interface PiPaymentData {
  identifier: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiPaymentResult {
  identifier: string;
  userUid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  fromAddress: string;
  toAddress: string;
  direction: "user_to_app" | "app_to_user";
  network: "Pi Network" | "Pi Testnet";
  createdAt: string;
  txHash?: string;
  status: {
    developerApproved: boolean;
    transactionVerified: boolean;
    developerCompleted: boolean;
    cancelled: boolean;
    userCancelled: boolean;
  };
}

export interface IPiNetworkService {
  /**
   * Verify Pi Network authentication token
   */
  verifyAuth(accessToken: string): Promise<PiAuthResult>;

  /**
   * Create a Pi payment
   */
  createPayment(paymentData: PiPaymentData): Promise<string>;

  /**
   * Approve a Pi payment
   */
  approvePayment(paymentId: string): Promise<void>;

  /**
   * Complete a Pi payment
   */
  completePayment(paymentId: string, txHash: string): Promise<void>;

  /**
   * Cancel a Pi payment
   */
  cancelPayment(paymentId: string): Promise<void>;

  /**
   * Get payment details
   */
  getPayment(paymentId: string): Promise<PiPaymentResult>;
}
