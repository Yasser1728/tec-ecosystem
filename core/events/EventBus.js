/**
 * Event Bus - Real-time Event Streaming Engine
 * Part of Micro OS Sovereignty Architecture
 * 
 * Contact: yasserrr.fox17@gmail.com
 * Purpose: Enables real-time communication between micro-apps with sovereign monitoring
 */

const crypto = require('crypto');

class EventBus {
  constructor(forensicLogger) {
    this.contactEmail = 'yasserrr.fox17@gmail.com';
    this.forensicLogger = forensicLogger;
    this.subscribers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Subscribe to events
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Event handler function
   * @returns {string} Subscription ID
   */
  subscribe(eventType, handler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Map());
    }

    const subscriptionId = this.generateSubscriptionId();
    this.subscribers.get(eventType).set(subscriptionId, handler);

    // Log subscription
    this.forensicLogger.log({
      type: 'EVENT_SUBSCRIPTION',
      data: {
        eventType,
        subscriptionId
      },
      actor: 'SYSTEM'
    });

    return subscriptionId;
  }

  /**
   * Unsubscribe from events
   * @param {string} eventType - Event type
   * @param {string} subscriptionId - Subscription ID
   */
  unsubscribe(eventType, subscriptionId) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).delete(subscriptionId);
      
      // Log unsubscription
      this.forensicLogger.log({
        type: 'EVENT_UNSUBSCRIPTION',
        data: {
          eventType,
          subscriptionId
        },
        actor: 'SYSTEM'
      });
    }
  }

  /**
   * Publish event to all subscribers
   * @param {Object} event - Event to publish
   */
  async publish(event) {
    const eventData = {
      id: this.generateEventId(),
      type: event.type,
      data: event.data,
      source: event.source || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      sovereignContact: this.contactEmail
    };

    // Add to history
    this.addToHistory(eventData);

    // Log event
    this.forensicLogger.log({
      type: 'EVENT_PUBLISHED',
      data: {
        eventId: eventData.id,
        eventType: eventData.type,
        source: eventData.source
      },
      actor: eventData.source,
      critical: event.critical || false
    });

    // Notify subscribers
    if (this.subscribers.has(event.type)) {
      const handlers = this.subscribers.get(event.type);
      const promises = [];

      for (const [subscriptionId, handler] of handlers) {
        try {
          promises.push(handler(eventData));
        } catch (error) {
          // console.error(`Error in event handler ${subscriptionId}:`, error);
          
          // Log handler error
          this.forensicLogger.log({
            type: 'EVENT_HANDLER_ERROR',
            data: {
              eventId: eventData.id,
              subscriptionId,
              error: error.message
            },
            actor: 'SYSTEM',
            critical: true
          });
        }
      }

      await Promise.allSettled(promises);
    }

    // Notify sovereign contact for critical events
    if (event.critical) {
      await this.notifySovereignContact(eventData);
    }

    return eventData;
  }

  /**
   * Get event history
   * @param {Object} filter - Filter options
   * @returns {Array} Filtered events
   */
  getHistory(filter = {}) {
    let events = [...this.eventHistory];

    if (filter.type) {
      events = events.filter(e => e.type === filter.type);
    }

    if (filter.source) {
      events = events.filter(e => e.source === filter.source);
    }

    if (filter.since) {
      const sinceDate = new Date(filter.since);
      events = events.filter(e => new Date(e.timestamp) >= sinceDate);
    }

    if (filter.limit) {
      events = events.slice(-filter.limit);
    }

    return events;
  }

  /**
   * Add event to history with size management
   */
  addToHistory(event) {
    this.eventHistory.push(event);

    // Maintain max history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get statistics about event bus
   */
  getStatistics() {
    const stats = {
      totalEvents: this.eventHistory.length,
      totalSubscribers: 0,
      eventTypes: {},
      sources: {}
    };

    // Count subscribers
    for (const handlers of this.subscribers.values()) {
      stats.totalSubscribers += handlers.size;
    }

    // Analyze events
    for (const event of this.eventHistory) {
      stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
      stats.sources[event.source] = (stats.sources[event.source] || 0) + 1;
    }

    return stats;
  }

  /**
   * Generate unique event ID using cryptographically secure random
   */
  generateEventId() {
    const secureRandom = crypto.randomBytes(8).toString('hex');
    return `EVT-${Date.now()}-${secureRandom}`;
  }

  /**
   * Generate unique subscription ID using cryptographically secure random
   */
  generateSubscriptionId() {
    const secureRandom = crypto.randomBytes(8).toString('hex');
    return `SUB-${Date.now()}-${secureRandom}`;
  }

  /**
   * Notify sovereign contact for critical events
   * @param {Object} event - Critical event
   */
  async notifySovereignContact(event) {
    // In production, this would send real-time notification to yasserrr.fox17@gmail.com
    // console.log(`[CRITICAL EVENT] ${this.contactEmail}`);
    // console.log(`Event Type: ${event.type}`);
    // console.log(`Event ID: ${event.id}`);
    // console.log(`Source: ${event.source}`);
    // console.log(`Data:`, JSON.stringify(event.data, null, 2));

    return {
      notified: true,
      recipient: this.contactEmail,
      eventId: event.id,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = EventBus;
