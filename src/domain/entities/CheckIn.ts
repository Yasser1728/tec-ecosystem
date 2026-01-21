/**
 * CheckIn Entity - TEC Assistant Domain
 * Daily check-in record for users
 */

import { SignalType } from "./Signal";

export interface CheckInProps {
  id: string;
  userId: string;
  date: Date;
  signal: SignalType;
  xpEarned: number;
  streakDay: number;
  createdAt: Date;
}

export class CheckIn {
  private props: CheckInProps;

  constructor(props: CheckInProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get date(): Date {
    return this.props.date;
  }

  get signal(): SignalType {
    return this.props.signal;
  }

  get xpEarned(): number {
    return this.props.xpEarned;
  }

  get streakDay(): number {
    return this.props.streakDay;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns a plain object representation
   */
  toObject(): CheckInProps {
    return { ...this.props };
  }
}
