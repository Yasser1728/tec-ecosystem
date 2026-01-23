/**
 * Enhanced Language Detection System
 * TEC Ecosystem - Bilingual Support (English & Arabic)
 * 
 * Implements precise language detection with:
 * - Arabic Unicode range detection
 * - Pattern matching for common Arabic words
 * - Confidence scoring system
 * - Threshold-based language selection (>30% Arabic → Arabic response)
 * 
 * Core Principle: NO mixed-language responses
 * - English input → Executive English response ONLY
 * - Arabic input → Formal Arabic response ONLY
 */

/**
 * Arabic Unicode Ranges
 * U+0600-U+06FF: Arabic
 * U+0750-U+077F: Arabic Supplement
 * U+08A0-U+08FF: Arabic Extended-A
 * U+FB50-U+FDFF: Arabic Presentation Forms-A
 * U+FE70-U+FEFF: Arabic Presentation Forms-B
 */
const ARABIC_UNICODE_RANGES = [
  [0x0600, 0x06FF], // Arabic
  [0x0750, 0x077F], // Arabic Supplement
  [0x08A0, 0x08FF], // Arabic Extended-A
  [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
  [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
];

/**
 * Common Arabic words and patterns for enhanced detection
 */
const COMMON_ARABIC_PATTERNS = [
  'مرحبا',
  'شكرا',
  'من فضلك',
  'كيف',
  'ماذا',
  'أين',
  'متى',
  'لماذا',
  'هل',
  'نعم',
  'لا',
  'السلام عليكم',
];

/**
 * Language detection threshold
 * >30% Arabic characters → Respond in Arabic
 * ≤30% Arabic characters → Respond in English
 */
const ARABIC_THRESHOLD = 0.30;

/**
 * Check if a character is within Arabic Unicode ranges
 * @param {number} charCode - Character code to check
 * @returns {boolean} - True if character is Arabic
 */
function isArabicChar(charCode) {
  return ARABIC_UNICODE_RANGES.some(
    ([start, end]) => charCode >= start && charCode <= end
  );
}

/**
 * Count Arabic characters in text
 * @param {string} text - Text to analyze
 * @returns {number} - Count of Arabic characters
 */
function countArabicCharacters(text) {
  let arabicCount = 0;
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (isArabicChar(charCode)) {
      arabicCount++;
    }
  }
  
  return arabicCount;
}

/**
 * Count total meaningful characters (excluding spaces, punctuation)
 * @param {string} text - Text to analyze
 * @returns {number} - Count of meaningful characters
 */
function countMeaningfulCharacters(text) {
  // Remove spaces, numbers, and common punctuation
  const meaningfulText = text.replace(/[\s\d\p{P}]/gu, '');
  return meaningfulText.length;
}

/**
 * Check for common Arabic patterns
 * @param {string} text - Text to analyze
 * @returns {boolean} - True if common Arabic patterns found
 */
function hasCommonArabicPatterns(text) {
  const lowerText = text.toLowerCase();
  return COMMON_ARABIC_PATTERNS.some(pattern => 
    lowerText.includes(pattern.toLowerCase())
  );
}

/**
 * Detect language with confidence scoring
 * @param {string} text - Text to analyze
 * @returns {Object} - Detection result with language and confidence
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return {
      language: 'en',
      confidence: 1.0,
      arabicPercentage: 0,
      method: 'default'
    };
  }

  // Trim whitespace
  const trimmedText = text.trim();
  
  if (trimmedText.length === 0) {
    return {
      language: 'en',
      confidence: 1.0,
      arabicPercentage: 0,
      method: 'empty'
    };
  }

  // Count Arabic and meaningful characters
  const arabicCount = countArabicCharacters(trimmedText);
  const meaningfulCount = countMeaningfulCharacters(trimmedText);
  
  // Avoid division by zero
  if (meaningfulCount === 0) {
    return {
      language: 'en',
      confidence: 1.0,
      arabicPercentage: 0,
      method: 'no-meaningful-chars'
    };
  }

  // Calculate percentage
  const arabicPercentage = arabicCount / meaningfulCount;
  
  // Check for common patterns (boosts confidence)
  const hasPatterns = hasCommonArabicPatterns(trimmedText);
  
  // Determine language based on threshold
  let language = 'en';
  let confidence = 1.0;
  let method = 'threshold';
  
  if (arabicPercentage > ARABIC_THRESHOLD) {
    language = 'ar';
    // Higher confidence if patterns detected
    confidence = hasPatterns ? 0.95 : Math.min(arabicPercentage + 0.2, 1.0);
    method = hasPatterns ? 'threshold+patterns' : 'threshold';
  } else if (hasPatterns) {
    // Even low percentage with patterns suggests Arabic
    language = 'ar';
    confidence = 0.85;
    method = 'patterns';
  } else {
    // English
    confidence = Math.max(1.0 - arabicPercentage, 0.7);
    method = 'threshold';
  }

  return {
    language,
    confidence,
    arabicPercentage,
    arabicCount,
    meaningfulCount,
    hasPatterns,
    method
  };
}

/**
 * Get appropriate response language based on input
 * Core Principle: NO mixed-language responses
 * @param {string} userInput - User's input text
 * @returns {string} - Language code ('en' or 'ar')
 */
export function getResponseLanguage(userInput) {
  const detection = detectLanguage(userInput);
  return detection.language;
}

/**
 * Validate that response matches detected language
 * @param {string} userInput - Original user input
 * @param {string} response - AI response to validate
 * @returns {Object} - Validation result
 */
export function validateResponseLanguage(userInput, response) {
  const inputLanguage = detectLanguage(userInput).language;
  const responseLanguage = detectLanguage(response).language;
  
  const isValid = inputLanguage === responseLanguage;
  
  return {
    isValid,
    inputLanguage,
    responseLanguage,
    message: isValid 
      ? 'Response language matches input language' 
      : `Language mismatch: input=${inputLanguage}, response=${responseLanguage}`
  };
}

/**
 * Get language display name
 * @param {string} languageCode - Language code ('en' or 'ar')
 * @returns {string} - Display name
 */
export function getLanguageDisplayName(languageCode) {
  const names = {
    en: 'English',
    ar: 'العربية'
  };
  return names[languageCode] || 'English';
}

/**
 * Get RTL direction for language
 * @param {string} languageCode - Language code
 * @returns {string} - Direction ('ltr' or 'rtl')
 */
export function getLanguageDirection(languageCode) {
  return languageCode === 'ar' ? 'rtl' : 'ltr';
}

export default {
  detectLanguage,
  getResponseLanguage,
  validateResponseLanguage,
  getLanguageDisplayName,
  getLanguageDirection,
  ARABIC_THRESHOLD
};
