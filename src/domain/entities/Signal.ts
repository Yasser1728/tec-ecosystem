/**
 * Signal Entity - TEC Assistant Domain
 * Daily signal for user guidance
 */

export enum SignalType {
  POSITIVE = "POSITIVE",
  NEUTRAL = "NEUTRAL",
  CAUTION = "CAUTION",
}

export interface SignalProps {
  id: string;
  date: Date;
  type: SignalType;
  confidence?: number;
  metadata?: Record<string, unknown>;
  generatedAt: Date;
}

export class Signal {
  private props: SignalProps;

  constructor(props: SignalProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get date(): Date {
    return this.props.date;
  }

  get type(): SignalType {
    return this.props.type;
  }

  get confidence(): number | undefined {
    return this.props.confidence;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  get generatedAt(): Date {
    return this.props.generatedAt;
  }

  /**
   * Returns a plain object representation
   */
  toObject(): SignalProps {
    return { ...this.props };
  }

  /**
   * Get signal display properties
   */
  getDisplayInfo(): { color: string; emoji: string; message: string } {
    switch (this.props.type) {
      case SignalType.POSITIVE:
        return {
          color: "green",
          emoji: "🟢",
          message: "Great day ahead! Opportunities are favorable.",
        };
      case SignalType.NEUTRAL:
        return {
          color: "blue",
          emoji: "🔵",
          message: "Balanced day. Proceed with normal activities.",
        };
      case SignalType.CAUTION:
        return {
          color: "yellow",
          emoji: "🟡",
          message: "Exercise caution. Review decisions carefully.",
        };
    }
  }
}
