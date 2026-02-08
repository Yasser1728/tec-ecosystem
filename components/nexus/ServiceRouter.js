/**
 * Service Router Component
 * TEC Ecosystem - Smart service router for all 24 domains
 * 
 * @module components/nexus/ServiceRouter
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';
import { domainMapping } from '../../lib/domainMapping';

/**
 * Get domain icon based on category
 */
const getCategoryIcon = (category) => {
  const icons = {
    Financial: '💰',
    Premium: '⭐',
    Commerce: '🛍️',
    Technology: '🔧',
    Specialized: '🎯',
    Hub: '🌐',
  };
  return icons[category] || '📦';
};

/**
 * Service Router Component
 * Displays all 24 domains as searchable, filterable cards
 */
export default function ServiceRouter() {
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const t = translations[language].nexus;
  const tCommon = translations[language].common;

  // Convert domainMapping to array format
  const allDomains = useMemo(() => {
    return Object.entries(domainMapping).map(([domain, config]) => ({
      domain: domain.replace('.pi', ''),
      name: language === 'ar' ? config.nameAr : config.name,
      description: language === 'ar' ? config.descriptionAr : config.description,
      category: config.category,
      route: config.route,
      icon: getCategoryIcon(config.category),
      status: config.status,
      priority: config.priority,
    }));
  }, [language]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(allDomains.map(d => d.category))];
    return cats;
  }, [allDomains]);

  // Filter domains
  const filteredDomains = useMemo(() => {
    let domains = allDomains;

    // Filter by category
    if (selectedCategory !== 'all') {
      domains = domains.filter(d => d.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      domains = domains.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.domain.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
      );
    }

    return domains;
  }, [allDomains, selectedCategory, searchQuery]);

  // Get category label
  const getCategoryLabel = (cat) => {
    if (cat === 'all') return t.filterAll;
    const map = {
      Financial: t.filterFinancial,
      Premium: t.filterPremium,
      Commerce: t.filterCommerce,
      Technology: t.filterTechnology,
      Specialized: t.filterSpecialized,
      Hub: t.filterHub,
    };
    return map[cat] || cat;
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-[#00ff9d]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff9d] transition-colors"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${selectedCategory === cat
                ? 'bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-[#00ff9d]/50'
              }
            `}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-400 text-sm">
        {filteredDomains.length} {t.resultsCount}
      </div>

      {/* Domain Grid */}
      {filteredDomains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDomains.map((domain) => (
            <Link
              key={domain.domain}
              href={domain.route}
              className="group bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] hover:shadow-lg hover:shadow-[#00ff9d]/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{domain.icon}</div>

              {/* Domain Name */}
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#00ff9d] transition-colors">
                {domain.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">
                {domain.description}
              </p>

              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                  {domain.category}
                </span>

                {/* Status Indicator */}
                {domain.status === 'active' && (
                  <span className="text-green-400 text-xs">● Active</span>
                )}
              </div>

              {/* Hover Arrow */}
              <div className="mt-4 text-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                {isRTL ? '←' : '→'} {language === 'ar' ? 'زيارة' : 'Visit'}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* No Results */
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">{t.noResults}</h3>
          <p className="text-gray-400">{t.tryDifferent}</p>
        </div>
      )}
    </div>
  );
}
