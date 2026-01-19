/**
 * Transaction Entity - TEC Assistant Domain
 * Pi Network payment transactions
 */

export enum TransactionType {
  UNLOCK_FEATURE = 'UNLOCK_FEATURE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TIP = 'TIP',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface TransactionProps {
  id: string;
  userId: string;
  piPaymentId: string;
  txHash?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  itemId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class Transaction {
  private props: TransactionProps;

  constructor(props: TransactionProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get piPaymentId(): string {
    return this.props.piPaymentId;
  }

  get txHash(): string | undefined {
    return this.props.txHash;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get itemId(): string | undefined {
    return this.props.itemId;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  /**
   * Mark transaction as completed
   */
  complete(txHash: string): void {
    this.props.status = TransactionStatus.COMPLETED;
    this.props.txHash = txHash;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Mark transaction as failed
   */
  fail(): void {
    this.props.status = TransactionStatus.FAILED;
    this.props.updatedAt = new Date();
  }

  /**
   * Cancel the transaction
   */
  cancel(): void {
    this.props.status = TransactionStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  /**
   * Refund the transaction
   */
  refund(): void {
    this.props.status = TransactionStatus.REFUNDED;
    this.props.updatedAt = new Date();
  }

  /**
   * Check if transaction is in a final state
   */
  isFinal(): boolean {
    return [
      TransactionStatus.COMPLETED,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELLED,
      TransactionStatus.REFUNDED,
    ].includes(this.props.status);
  }

  /**
   * Returns a plain object representation
   */
  toObject(): TransactionProps {
    return { ...this.props };
  }
}
