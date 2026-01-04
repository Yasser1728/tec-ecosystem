/**
 * Event Bus - Central Event Management System
 * 
 * This service provides a centralized event-driven architecture for
 * cross-domain communication within the TEC Ecosystem.
 * 
 * @module lib/eventBus
 */

const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
    this.subscribers = new Map();
    
    // Set max listeners to handle multiple domain subscriptions
    this.setMaxListeners(50);
  }

  /**
   * Publish an event to all subscribers
   * 
   * @param {string} eventType - Event type (e.g., 'fundx.investment.created')
   * @param {Object} eventData - Event payload
   * @param {Object} metadata - Optional metadata (userId, correlationId, etc.)
   * @returns {Object} Event publication result
   */
  publish(eventType, eventData, metadata = {}) {
    const event = {
      eventType,
      eventData,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        eventId: this.generateEventId(),
      },
    };

    // Store in history
    this.addToHistory(event);

    // Emit event
    this.emit(eventType, eventData, event.metadata);

    // Log event (in production, use proper logger)
    console.log(`[EventBus] Published: ${eventType}`, {
      eventId: event.metadata.eventId,
      timestamp: event.metadata.timestamp,
    });

    return {
      success: true,
      eventId: event.metadata.eventId,
      eventType,
    };
  }

  /**
   * Subscribe to event type
   * 
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Event handler function
   * @param {Object} options - Subscription options
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, handler, options = {}) {
    const { domain, description } = options;

    // Wrap handler to catch errors
    const wrappedHandler = async (eventData, metadata) => {
      try {
        await handler(eventData, metadata);
      } catch (error) {
        console.error(`[EventBus] Error in handler for ${eventType}:`, error);
        this.emit('error', {
          eventType,
          error: error.message,
          domain,
          metadata,
        });
      }
    };

    this.on(eventType, wrappedHandler);

    // Track subscriber
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push({
      handler: wrappedHandler,
      domain,
      description,
      subscribedAt: new Date().toISOString(),
    });

    console.log(`[EventBus] Subscribed: ${domain || 'Unknown'} to ${eventType}`);

    // Return unsubscribe function
    return () => {
      this.off(eventType, wrappedHandler);
      const subs = this.subscribers.get(eventType);
      if (subs) {
        const index = subs.findIndex(s => s.handler === wrappedHandler);
        if (index !== -1) {
          subs.splice(index, 1);
        }
      }
    };
  }

  /**
   * Get event history
   * 
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered event history
   */
  getHistory(filters = {}) {
    let history = [...this.eventHistory];

    if (filters.eventType) {
      history = history.filter(e => e.eventType === filters.eventType);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      history = history.filter(e => new Date(e.metadata.timestamp) >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      history = history.filter(e => new Date(e.metadata.timestamp) <= end);
    }

    if (filters.limit) {
      history = history.slice(-filters.limit);
    }

    return history;
  }

  /**
   * Get list of subscribers
   * 
   * @returns {Object} Subscribers by event type
   */
  getSubscribers() {
    const result = {};
    for (const [eventType, subs] of this.subscribers.entries()) {
      result[eventType] = subs.map(s => ({
        domain: s.domain,
        description: s.description,
        subscribedAt: s.subscribedAt,
      }));
    }
    return result;
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
  }

  /**
   * Generate unique event ID
   * 
   * @returns {string} Event ID
   */
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Add event to history
   * 
   * @param {Object} event - Event object
   */
  addToHistory(event) {
    this.eventHistory.push(event);
    
    // Maintain max history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Wait for specific event (for testing)
   * 
   * @param {string} eventType - Event type to wait for
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} Resolves with event data
   */
  waitFor(eventType, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.off(eventType, handler);
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeout);

      const handler = (eventData, metadata) => {
        clearTimeout(timer);
        this.off(eventType, handler);
        resolve({ eventData, metadata });
      };

      this.once(eventType, handler);
    });
  }
}

// Export singleton instance
const eventBus = new EventBus();

module.exports = eventBus;
module.exports.EventBus = EventBus;
