/**
 * Unlock Entity - TEC Assistant Domain
 * Feature unlock records
 */

export interface UnlockProps {
  id: string;
  userId: string;
  featureKey: string;
  transactionId?: string;
  unlockedAt: Date;
  expiresAt?: Date;
}

export class Unlock {
  private props: UnlockProps;

  constructor(props: UnlockProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get featureKey(): string {
    return this.props.featureKey;
  }

  get transactionId(): string | undefined {
    return this.props.transactionId;
  }

  get unlockedAt(): Date {
    return this.props.unlockedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  /**
   * Check if unlock is still valid
   */
  isValid(): boolean {
    if (!this.props.expiresAt) {
      return true; // No expiration means permanent
    }
    return new Date() < this.props.expiresAt;
  }

  /**
   * Check if unlock has expired
   */
  isExpired(): boolean {
    return !this.isValid();
  }

  /**
   * Returns a plain object representation
   */
  toObject(): UnlockProps {
    return { ...this.props };
  }
}
