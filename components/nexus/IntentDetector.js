/**
 * Intent Detector Component
 * TEC Ecosystem - Natural language intent detection for domain routing
 * 
 * @module components/nexus/IntentDetector
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';
import { domainMapping } from '../../lib/domainMapping';

/**
 * Domain route mapping
 */
const domainRoutes = {
  fundx: '/fundx',
  assets: '/assets',
  nbf: '/nbf',
  insure: '/insure',
  vip: '/vip',
  elite: '/elite',
  titan: '/titan',
  epic: '/epic',
  legend: '/legend',
  commerce: '/commerce',
  ecommerce: '/ecommerce',
  estate: '/estate',
  explorer: '/explorer',
  dx: '/dx',
  nx: '/nx',
  nexus: '/nexus',
  system: '/system',
  analytics: '/analytics',
  alert: '/alert',
  life: '/life',
  connection: '/connection',
  brookfield: '/brookfield',
  zone: '/zone',
  tec: '/tec',
};

/**
 * Intent Detector Component
 * Detects user intent from natural language and suggests relevant domains
 */
export default function IntentDetector() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const t = translations[language].nexus;
  const keywords = translations[language].domainKeywords;

  /**
   * Detect intent from user input
   * Returns array of matching domain IDs sorted by relevance
   */
  const detectedDomains = useMemo(() => {
    if (!input.trim()) return [];

    const query = input.toLowerCase();
    const matches = [];

    // Check each domain's keywords
    Object.entries(keywords).forEach(([domainId, domainKeywords]) => {
      let score = 0;
      
      domainKeywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();
        if (query.includes(keywordLower)) {
          // Exact word match gets higher score
          const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
          if (regex.test(query)) {
            score += 10;
          } else {
            score += 5;
          }
        }
      });

      if (score > 0) {
        matches.push({ domainId, score });
      }
    });

    // Sort by score (highest first) and return top 3
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(m => m.domainId);
  }, [input, keywords]);

  /**
   * Get domain info for display
   */
  const getSuggestions = useMemo(() => {
    return detectedDomains.map((domainId) => {
      // Find domain in domainMapping
      const domainKey = `${domainId}.pi`;
      const domainInfo = domainMapping[domainKey];
      
      if (!domainInfo) return null;

      return {
        id: domainId,
        name: language === 'ar' ? domainInfo.nameAr : domainInfo.name,
        description: language === 'ar' ? domainInfo.descriptionAr : domainInfo.description,
        route: domainRoutes[domainId] || `/${domainId}`,
      };
    }).filter(Boolean);
  }, [detectedDomains, language]);

  /**
   * Handle navigation to suggested domain
   */
  const handleGoToDomain = (route) => {
    router.push(route);
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowSuggestions(e.target.value.trim().length > 3);
  };

  /**
   * Handle example click
   */
  const handleExampleClick = (example) => {
    setInput(example);
    setShowSuggestions(true);
  };

  return (
    <div className="w-full mb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
          {t.intentTitle}
        </h2>
      </div>

      {/* Input Box */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={t.intentPlaceholder}
            rows={3}
            className="w-full bg-gray-800 border border-[#00ff9d]/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff9d] focus:shadow-lg focus:shadow-[#00ff9d]/20 transition-all resize-none"
          />
          
          {/* AI Sparkle Icon */}
          <div className="absolute top-3 right-3 text-2xl">✨</div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && getSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-[#00ff9d]/50 rounded-lg shadow-lg shadow-[#00ff9d]/20 z-10 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-300 font-semibold">
                {t.intentSuggestions}
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {getSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleGoToDomain(suggestion.route)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-white group-hover:text-[#00ff9d] transition-colors">
                        {suggestion.name}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                    
                    <div className="ml-4 px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                      {t.intentGo} {isRTL ? '←' : '→'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Suggestions Message */}
        {showSuggestions && getSuggestions.length === 0 && input.trim().length > 3 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 z-10">
            <p className="text-gray-400 text-sm">
              {language === 'ar' 
                ? 'لم يتم العثور على نطاقات مطابقة. حاول استخدام كلمات مختلفة.'
                : 'No matching domains found. Try using different keywords.'}
            </p>
          </div>
        )}
      </div>

      {/* Example Queries */}
      <div className="mt-6 max-w-3xl mx-auto">
        <p className="text-sm text-gray-400 mb-3 text-center">
          {language === 'ar' ? 'أمثلة:' : 'Examples:'}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {t.intentExamples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:border-[#00ff9d]/50 hover:text-white transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
