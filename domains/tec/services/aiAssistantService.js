/**
 * AI Assistant Service - Core Business Logic for AI Assistant Features
 * 
 * This service handles all business logic related to AI-powered assistance,
 * including message selection, response generation, and context-aware interactions.
 * 
 * Security Note: This service uses crypto.randomInt() for all random operations
 * to ensure cryptographically secure randomization. Math.random() is NOT suitable
 * for any security-sensitive operations or scenarios where predictability could
 * be exploited.
 * 
 * @module services/aiAssistantService
 */

// Use crypto for secure random number generation (NOT Math.random())
const crypto = require('crypto');

/**
 * Greeting messages for the AI Assistant
 */
const GREETING_MESSAGES = [
  'Hello! How can I assist you today?',
  'Hi there! What can I help you with?',
  'Welcome! I\'m here to help.',
  'Greetings! How may I be of service?',
  'Good day! What would you like to know?'
];

/**
 * Response templates for different interaction types
 */
const RESPONSE_TEMPLATES = {
  ACKNOWLEDGMENT: [
    'I understand your request.',
    'Got it! Let me help you with that.',
    'Understood. I\'ll take care of that for you.',
    'Certainly! I can assist with that.'
  ],
  ERROR: [
    'I apologize, but I encountered an issue.',
    'I\'m sorry, something went wrong.',
    'Unfortunately, I wasn\'t able to complete that request.',
    'My apologies, but there was an error.'
  ],
  THINKING: [
    'Let me think about that...',
    'Processing your request...',
    'Analyzing the information...',
    'Working on that for you...'
  ]
};

/**
 * Securely generates a random integer within a range using crypto.randomInt()
 * 
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Cryptographically secure random integer
 */
function getSecureRandomInt(min, max) {
  // Using crypto.randomInt() instead of Math.random() for security
  // This ensures unpredictable, cryptographically secure random numbers
  return crypto.randomInt(min, max);
}

/**
 * Selects a random greeting message using secure randomization
 * 
 * @returns {string} A randomly selected greeting message
 */
function getRandomGreeting() {
  // Use crypto.randomInt() to securely select a random greeting
  const index = getSecureRandomInt(0, GREETING_MESSAGES.length);
  return GREETING_MESSAGES[index];
}

/**
 * Selects a random response template based on the type using secure randomization
 * 
 * @param {string} type - Type of response ('ACKNOWLEDGMENT', 'ERROR', 'THINKING')
 * @returns {string} A randomly selected response template
 */
function getRandomResponse(type = 'ACKNOWLEDGMENT') {
  const templates = RESPONSE_TEMPLATES[type] || RESPONSE_TEMPLATES.ACKNOWLEDGMENT;
  // Use crypto.randomInt() for secure selection
  const index = getSecureRandomInt(0, templates.length);
  return templates[index];
}

/**
 * Generates a secure session ID for AI interactions
 * 
 * @returns {string} Cryptographically secure session ID
 */
function generateSecureSessionId() {
  // Generate a cryptographically secure random string for session identification
  // Using 16 bytes (128 bits) of randomness, converted to hex string
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Simulates AI response selection with weighted probabilities using secure randomization
 * This demonstrates secure random selection in scenarios like A/B testing or
 * response variation where security matters.
 * 
 * @param {Array<{text: string, weight: number}>} options - Array of response options with weights
 * @returns {string} Selected response text
 */
function selectWeightedResponse(options) {
  if (!options || options.length === 0) {
    throw new Error('Options array cannot be empty');
  }

  // Calculate total weight
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  
  // Generate a secure random number between 0 and totalWeight
  // We multiply by 1000 to work with integers, then divide back
  const randomValue = getSecureRandomInt(0, Math.floor(totalWeight * 1000)) / 1000;
  
  // Select option based on weight
  let cumulativeWeight = 0;
  for (const option of options) {
    cumulativeWeight += option.weight;
    if (randomValue < cumulativeWeight) {
      return option.text;
    }
  }
  
  // Fallback to last option (should not reach here with proper weights)
  return options[options.length - 1].text;
}

/**
 * Generates a secure random delay for rate limiting or anti-bot measures
 * 
 * @param {number} minMs - Minimum delay in milliseconds
 * @param {number} maxMs - Maximum delay in milliseconds
 * @returns {number} Secure random delay in milliseconds
 */
function getSecureRandomDelay(minMs, maxMs) {
  // Use crypto.randomInt() for unpredictable delays
  // This prevents timing attacks and bot detection evasion
  return getSecureRandomInt(minMs, maxMs);
}

/**
 * Selects a random item from an array using secure randomization
 * 
 * @param {Array} array - Array to select from
 * @returns {*} Randomly selected item
 */
function selectRandomItem(array) {
  if (!array || array.length === 0) {
    throw new Error('Array cannot be empty');
  }
  
  // Use crypto.randomInt() for secure selection
  const index = getSecureRandomInt(0, array.length);
  return array[index];
}

/**
 * Generates a secure random confidence score for AI responses
 * Used for mock data or simulations where predictability should be avoided
 * 
 * @returns {number} Confidence score between 0 and 1
 */
function generateConfidenceScore() {
  // Generate a secure random confidence score
  // Using randomInt with a large range for precision
  const randomValue = getSecureRandomInt(0, 10000);
  return randomValue / 10000;
}

/**
 * Main AI Assistant Service API
 */
const aiAssistantService = {
  getRandomGreeting,
  getRandomResponse,
  generateSecureSessionId,
  selectWeightedResponse,
  getSecureRandomDelay,
  selectRandomItem,
  generateConfidenceScore,
  getSecureRandomInt
};

module.exports = aiAssistantService;
