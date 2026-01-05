/**
 * AI Assistant Service - TEC Assistant Business Logic
 * 
 * This service handles the AI Assistant (TEC Concierge) functionality,
 * providing intelligent responses and guidance across the TEC ecosystem.
 * 
 * @module services/aiAssistantService
 */

class AiAssistantService {
  constructor() {
    // Mock conversation history storage
    this.conversations = new Map();
  }

  /**
   * Process a user message and generate response
   * 
   * @param {string} userId - User ID
   * @param {string} message - User message
   * @param {Object} context - Optional context data
   * @returns {Promise<Object>} Assistant response
   */
  async processMessage(userId, message, context = {}) {
    try {
      // Get or create conversation history
      if (!this.conversations.has(userId)) {
        this.conversations.set(userId, []);
      }

      const history = this.conversations.get(userId);
      
      // Add user message to history
      history.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

      // Generate response based on message content
      const response = await this.generateResponse(message, context);

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 20 messages in history
      if (history.length > 20) {
        this.conversations.set(userId, history.slice(-20));
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }

  /**
   * Generate response based on message content (mock implementation)
   * 
   * @param {string} message - User message
   * @param {Object} context - Context data
   * @returns {Promise<Object>} Generated response
   */
  async generateResponse(message, context) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerMessage = message.toLowerCase();

    // Pattern-based mock responses
    if (lowerMessage.includes('domain') || lowerMessage.includes('domains')) {
      return {
        content: 'The TEC Ecosystem consists of 24 sovereign business domains across financial services, premium services, commerce, and technology. Each domain operates independently while being seamlessly integrated. Would you like to explore a specific domain category?',
        suggestions: ['Financial Services', 'Premium Services', 'Commerce Domains', 'Technology Domains'],
        links: [
          { text: 'View All Domains', url: '/domains' },
        ],
      };
    }

    if (lowerMessage.includes('estate') || lowerMessage.includes('property')) {
      return {
        content: 'TEC Estate is our premium real estate marketplace offering villas, apartments, commercial properties, and land. You can browse properties, schedule viewings, and complete transactions using Pi Network payments.',
        suggestions: ['Browse Properties', 'How to Buy', 'Seller Information'],
        links: [
          { text: 'Visit TEC Estate', url: '/estate' },
        ],
      };
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pi') || lowerMessage.includes('crypto')) {
      return {
        content: 'All TEC ecosystem transactions are powered by Pi Network. You can pay for services, products, and subscriptions using Pi cryptocurrency. Your Pi wallet is integrated across all domains for seamless transactions.',
        suggestions: ['Payment Methods', 'Transaction History', 'Wallet Balance'],
        links: [
          { text: 'View Payment Info', url: '/payments' },
        ],
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('guide')) {
      return {
        content: 'I\'m here to help you navigate the TEC ecosystem! You can ask me about any of our 24 domains, how to make payments, subscription tiers, or general ecosystem features. What would you like to know more about?',
        suggestions: ['Getting Started', 'Available Services', 'Subscription Tiers', 'Contact Support'],
        links: [
          { text: 'Documentation', url: '/docs' },
        ],
      };
    }

    if (lowerMessage.includes('tier') || lowerMessage.includes('subscription') || lowerMessage.includes('upgrade')) {
      return {
        content: 'TEC offers multiple subscription tiers: GUEST (free, limited access), STANDARD (basic features), PREMIUM (full access), and ADMIN (complete control). Each tier unlocks different features across our 24 domains. Would you like to learn about upgrading?',
        suggestions: ['Compare Tiers', 'Upgrade Now', 'Tier Benefits'],
        links: [
          { text: 'View Pricing', url: '/upgrade' },
        ],
      };
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('assistant') || lowerMessage.includes('you')) {
      return {
        content: 'I\'m the TEC Assistant, your intelligent guide to the entire TEC ecosystem. I can help you discover domains, understand features, complete transactions, and navigate our services. I\'m powered by advanced AI to provide personalized assistance.',
        suggestions: ['Your Capabilities', 'Example Questions', 'Privacy Policy'],
      };
    }

    // Default response
    return {
      content: 'Thank you for your message! I\'m the TEC Assistant, here to help you navigate our ecosystem of 24 business domains. You can ask me about specific domains, payment methods, subscriptions, or how to get started. What would you like to know?',
      suggestions: ['Explore Domains', 'How to Pay', 'Getting Started', 'Contact Support'],
      links: [
        { text: 'TEC Dashboard', url: '/tec' },
        { text: 'All Domains', url: '/domains' },
      ],
    };
  }

  /**
   * Get conversation history for a user
   * 
   * @param {string} userId - User ID
   * @param {number} limit - Number of messages to return
   * @returns {Array} Conversation history
   */
  getConversationHistory(userId, limit = 10) {
    try {
      const history = this.conversations.get(userId) || [];
      return history.slice(-limit);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  /**
   * Clear conversation history for a user
   * 
   * @param {string} userId - User ID
   * @returns {boolean} Success status
   */
  clearConversationHistory(userId) {
    try {
      this.conversations.delete(userId);
      return true;
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      return false;
    }
  }

  /**
   * Get suggested prompts for the user
   * 
   * @param {Object} userContext - User context data
   * @returns {Array} Suggested prompts
   */
  getSuggestedPrompts(userContext = {}) {
    const prompts = [
      'What domains are available in the TEC ecosystem?',
      'How do I make payments with Pi Network?',
      'Tell me about TEC Estate',
      'What subscription tiers are available?',
      'How do I upgrade my account?',
      'Show me premium services',
    ];

    // Return random 4 prompts
    return prompts.sort(() => Math.random() - 0.5).slice(0, 4);
  }
}

// Export class for flexibility in testing and dependency injection
module.exports = AiAssistantService;

// Export singleton instance as default
module.exports.default = new AiAssistantService();
