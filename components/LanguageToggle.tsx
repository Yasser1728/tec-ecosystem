import React from 'react';
import type { LanguageToggleProps } from '@/types/components';

const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onToggle }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex gap-2">
      <button
        onClick={() => onToggle('en')}
        className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
          currentLang === 'en'
            ? 'bg-tec-green text-black'
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onToggle('ar')}
        className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
          currentLang === 'ar'
            ? 'bg-tec-green text-black'
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        ع
      </button>
    </div>
  );
};

export default LanguageToggle;
