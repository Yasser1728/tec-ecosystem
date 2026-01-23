/**
 * Enhanced Event-Driven Architecture
 * Implements event bus with advanced capabilities
 * 
 * Features:
 * - Event sourcing
 * - Event replay
 * - Dead letter queue
 * - Event versioning
 * - Event correlation
 * - Circuit breaker
 * 
 * @module events/enhanced-bus
 */

/**
 * Enhanced Event Bus
 * Advanced event-driven messaging system for TEC ecosystem
 */
export class EnhancedEventBus {
  constructor(config = {}) {
    this.config = {
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      deadLetterEnabled: config.deadLetterEnabled !== false,
      eventSourcingEnabled: config.eventSourcingEnabled !== false,
      circuitBreakerThreshold: config.circuitBreakerThreshold || 5,
      circuitBreakerTimeout: config.circuitBreakerTimeout || 60000,
      ...config
    };

    this.subscribers = new Map();
    this.eventStore = [];
    this.deadLetterQueue = [];
    this.circuitBreakers = new Map();
    this.correlationMap = new Map();
    this.eventMetrics = new Map();
  }

  /**
   * Publish event to all subscribers
   * 
   * @param {string} eventType - Event type
   * @param {Object} payload - Event payload
   * @param {Object} options - Publishing options
   * @returns {Promise<Object>} Publishing result
   */
  async publish(eventType, payload, options = {}) {
    const event = {
      id: this.generateEventId(),
      type: eventType,
      payload,
      timestamp: Date.now(),
      version: options.version || '1.0',
      correlationId: options.correlationId || this.generateCorrelationId(),
      causationId: options.causationId || null,
      metadata: options.metadata || {}
    };

    // Store event if event sourcing is enabled
    if (this.config.eventSourcingEnabled) {
      this.storeEvent(event);
    }

    // Track correlation
    if (event.correlationId) {
      this.trackCorrelation(event);
    }

    // Get subscribers for this event type
    const subscribers = this.getSubscribers(eventType);
    
    if (subscribers.length === 0) {
      console.warn(`No subscribers for event type: ${eventType}`);
      return {
        success: true,
        eventId: event.id,
        deliveredTo: 0
      };
    }

    // Deliver to all subscribers
    const results = await Promise.allSettled(
      subscribers.map(subscriber => 
        this.deliverToSubscriber(event, subscriber)
      )
    );

    // Track metrics
    this.recordMetric(eventType, {
      published: 1,
      delivered: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    });

    return {
      success: true,
      eventId: event.id,
      deliveredTo: results.filter(r => r.status === 'fulfilled').length,
      failures: results.filter(r => r.status === 'rejected').length
    };
  }

  /**
   * Subscribe to event type
   * 
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Event handler function
   * @param {Object} options - Subscription options
   * @returns {string} Subscription ID
   */
  subscribe(eventType, handler, options = {}) {
    const subscriptionId = this.generateSubscriptionId();
    const subscription = {
      id: subscriptionId,
      eventType,
      handler,
      options: {
        priority: options.priority || 5,
        filter: options.filter || null,
        transform: options.transform || null,
        retryOnFailure: options.retryOnFailure !== false,
        ...options
      },
      stats: {
        received: 0,
        processed: 0,
        failed: 0
      },
      createdAt: Date.now()
    };

    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    const subs = this.subscribers.get(eventType);
    subs.push(subscription);
    
    // Sort by priority (higher first)
    subs.sort((a, b) => b.options.priority - a.options.priority);

    return subscriptionId;
  }

  /**
   * Unsubscribe from event type
   * 
   * @param {string} subscriptionId - Subscription ID
   * @returns {boolean} Success status
   */
  unsubscribe(subscriptionId) {
    for (const [eventType, subs] of this.subscribers.entries()) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscribers.delete(eventType);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Deliver event to subscriber with retry logic
   * 
   * @param {Object} event - Event object
   * @param {Object} subscriber - Subscriber configuration
   * @returns {Promise<Object>} Delivery result
   */
  async deliverToSubscriber(event, subscriber) {
    const { handler, options, id: subscriberId } = subscriber;

    // Check circuit breaker
    if (this.isCircuitOpen(subscriberId)) {
      throw new Error(`Circuit breaker open for subscriber ${subscriberId}`);
    }

    // Apply filter if provided
    if (options.filter && !options.filter(event)) {
      return { skipped: true, reason: 'FILTERED' };
    }

    // Apply transformation if provided
    let processedEvent = event;
    if (options.transform) {
      processedEvent = options.transform(event);
    }

    subscriber.stats.received++;

    let lastError = null;
    const maxAttempts = options.retryOnFailure ? this.config.maxRetries : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await handler(processedEvent);
        
        subscriber.stats.processed++;
        this.recordCircuitSuccess(subscriberId);
        
        return {
          success: true,
          subscriberId,
          attempts: attempt
        };
      } catch (error) {
        lastError = error;
        subscriber.stats.failed++;
        this.recordCircuitFailure(subscriberId);

        if (attempt < maxAttempts) {
          // Wait before retry with exponential backoff
          await this.sleep(this.config.retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    // All retries failed - add to dead letter queue if enabled
    if (this.config.deadLetterEnabled) {
      this.addToDeadLetterQueue(event, subscriber, lastError);
    }

    throw lastError;
  }

  /**
   * Get subscribers for event type
   * 
   * @param {string} eventType - Event type
   * @returns {Array} List of subscribers
   */
  getSubscribers(eventType) {
    // Get exact matches
    const exact = this.subscribers.get(eventType) || [];
    
    // Get wildcard subscriptions
    const wildcards = [];
    for (const [pattern, subs] of this.subscribers.entries()) {
      if (pattern.includes('*') && this.matchesPattern(eventType, pattern)) {
        wildcards.push(...subs);
      }
    }

    return [...exact, ...wildcards];
  }

  /**
   * Match event type against pattern
   * 
   * @param {string} eventType - Event type
   * @param {string} pattern - Pattern with wildcards
   * @returns {boolean} Is match
   */
  matchesPattern(eventType, pattern) {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );
    return regex.test(eventType);
  }

  /**
   * Store event in event store
   * 
   * @param {Object} event - Event object
   */
  storeEvent(event) {
    this.eventStore.push(event);

    // Limit event store size
    if (this.eventStore.length > 10000) {
      this.eventStore.shift();
    }
  }

  /**
   * Replay events from event store
   * 
   * @param {Object} criteria - Replay criteria
   * @returns {Promise<Object>} Replay result
   */
  async replayEvents(criteria = {}) {
    const {
      startTime,
      endTime,
      eventTypes,
      correlationId
    } = criteria;

    let eventsToReplay = this.eventStore;

    // Apply filters
    if (startTime) {
      eventsToReplay = eventsToReplay.filter(e => e.timestamp >= startTime);
    }
    
    if (endTime) {
      eventsToReplay = eventsToReplay.filter(e => e.timestamp <= endTime);
    }

    if (eventTypes && eventTypes.length > 0) {
      eventsToReplay = eventsToReplay.filter(e => eventTypes.includes(e.type));
    }

    if (correlationId) {
      eventsToReplay = eventsToReplay.filter(e => e.correlationId === correlationId);
    }

    // Replay events in order
    let replayed = 0;
    let failed = 0;

    for (const event of eventsToReplay) {
      try {
        await this.publish(event.type, event.payload, {
          correlationId: event.correlationId + '_replay',
          metadata: { ...event.metadata, replayed: true }
        });
        replayed++;
      } catch (error) {
        failed++;
        console.error(`Failed to replay event ${event.id}:`, error);
      }
    }

    return {
      total: eventsToReplay.length,
      replayed,
      failed
    };
  }

  /**
   * Track event correlation
   * 
   * @param {Object} event - Event object
   */
  trackCorrelation(event) {
    const { correlationId } = event;
    
    if (!this.correlationMap.has(correlationId)) {
      this.correlationMap.set(correlationId, {
        id: correlationId,
        events: [],
        startedAt: Date.now()
      });
    }

    const correlation = this.correlationMap.get(correlationId);
    correlation.events.push({
      eventId: event.id,
      eventType: event.type,
      timestamp: event.timestamp
    });

    // Limit correlation size
    if (this.correlationMap.size > 1000) {
      const firstKey = this.correlationMap.keys().next().value;
      this.correlationMap.delete(firstKey);
    }
  }

  /**
   * Get correlation chain for an event
   * 
   * @param {string} correlationId - Correlation ID
   * @returns {Object|null} Correlation data
   */
  getCorrelation(correlationId) {
    return this.correlationMap.get(correlationId) || null;
  }

  /**
   * Add event to dead letter queue
   * 
   * @param {Object} event - Event object
   * @param {Object} subscriber - Subscriber that failed
   * @param {Error} error - Error that occurred
   */
  addToDeadLetterQueue(event, subscriber, error) {
    this.deadLetterQueue.push({
      event,
      subscriber: {
        id: subscriber.id,
        eventType: subscriber.eventType
      },
      error: {
        message: error.message,
        stack: error.stack
      },
      failedAt: Date.now()
    });

    // Limit dead letter queue size
    if (this.deadLetterQueue.length > 1000) {
      this.deadLetterQueue.shift();
    }
  }

  /**
   * Get dead letter queue
   * 
   * @returns {Array} Dead letter queue entries
   */
  getDeadLetterQueue() {
    return this.deadLetterQueue;
  }

  /**
   * Retry dead letter queue entry
   * 
   * @param {number} index - Entry index
   * @returns {Promise<Object>} Retry result
   */
  async retryDeadLetter(index) {
    const entry = this.deadLetterQueue[index];
    if (!entry) {
      return { success: false, error: 'ENTRY_NOT_FOUND' };
    }

    try {
      await this.publish(
        entry.event.type,
        entry.event.payload,
        {
          correlationId: entry.event.correlationId + '_retry',
          metadata: { ...entry.event.metadata, retried: true }
        }
      );

      // Remove from dead letter queue
      this.deadLetterQueue.splice(index, 1);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Record circuit breaker failure
   * 
   * @param {string} subscriberId - Subscriber ID
   */
  recordCircuitFailure(subscriberId) {
    if (!this.circuitBreakers.has(subscriberId)) {
      this.circuitBreakers.set(subscriberId, {
        failures: 0,
        lastFailure: null,
        state: 'CLOSED',
        openedAt: null
      });
    }

    const breaker = this.circuitBreakers.get(subscriberId);
    breaker.failures++;
    breaker.lastFailure = Date.now();

    if (breaker.failures >= this.config.circuitBreakerThreshold) {
      breaker.state = 'OPEN';
      breaker.openedAt = Date.now();
      console.warn(`Circuit breaker OPENED for subscriber ${subscriberId}`);
    }
  }

  /**
   * Record circuit breaker success
   * 
   * @param {string} subscriberId - Subscriber ID
   */
  recordCircuitSuccess(subscriberId) {
    const breaker = this.circuitBreakers.get(subscriberId);
    if (breaker) {
      breaker.failures = Math.max(0, breaker.failures - 1);
      
      if (breaker.state === 'HALF_OPEN' && breaker.failures === 0) {
        breaker.state = 'CLOSED';
        breaker.openedAt = null;
        console.info(`Circuit breaker CLOSED for subscriber ${subscriberId}`);
      }
    }
  }

  /**
   * Check if circuit breaker is open
   * 
   * @param {string} subscriberId - Subscriber ID
   * @returns {boolean} Is open
   */
  isCircuitOpen(subscriberId) {
    const breaker = this.circuitBreakers.get(subscriberId);
    if (!breaker || breaker.state === 'CLOSED') {
      return false;
    }

    // Check if timeout has passed for OPEN circuit
    if (breaker.state === 'OPEN') {
      const timeSinceOpen = Date.now() - breaker.openedAt;
      if (timeSinceOpen >= this.config.circuitBreakerTimeout) {
        breaker.state = 'HALF_OPEN';
        console.info(`Circuit breaker HALF_OPEN for subscriber ${subscriberId}`);
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Record event metric
   * 
   * @param {string} eventType - Event type
   * @param {Object} metric - Metric data
   */
  recordMetric(eventType, metric) {
    if (!this.eventMetrics.has(eventType)) {
      this.eventMetrics.set(eventType, {
        published: 0,
        delivered: 0,
        failed: 0
      });
    }

    const metrics = this.eventMetrics.get(eventType);
    metrics.published += metric.published || 0;
    metrics.delivered += metric.delivered || 0;
    metrics.failed += metric.failed || 0;
  }

  /**
   * Generate unique event ID
   * 
   * @returns {string} Event ID
   */
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate correlation ID
   * 
   * @returns {string} Correlation ID
   */
  generateCorrelationId() {
    return `cor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate subscription ID
   * 
   * @returns {string} Subscription ID
   */
  generateSubscriptionId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   * 
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get event bus statistics
   * 
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      subscribers: Array.from(this.subscribers.values()).reduce((sum, subs) => sum + subs.length, 0),
      eventTypes: this.subscribers.size,
      eventStore: this.eventStore.length,
      deadLetterQueue: this.deadLetterQueue.length,
      correlations: this.correlationMap.size,
      circuitBreakers: {
        total: this.circuitBreakers.size,
        open: Array.from(this.circuitBreakers.values()).filter(b => b.state === 'OPEN').length,
        halfOpen: Array.from(this.circuitBreakers.values()).filter(b => b.state === 'HALF_OPEN').length
      },
      metrics: Object.fromEntries(this.eventMetrics)
    };
  }
}

// Export singleton instance
export const enhancedEventBus = new EnhancedEventBus({
  maxRetries: 3,
  retryDelay: 1000,
  deadLetterEnabled: true,
  eventSourcingEnabled: true,
  circuitBreakerThreshold: 5,
  circuitBreakerTimeout: 60000
});

export default EnhancedEventBus;
