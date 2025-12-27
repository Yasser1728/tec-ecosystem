/**
 * LanguageToggle Component
 * 
 * A bilingual toggle button component allowing users to switch between English and Arabic.
 * Displays as a fixed overlay in the top-right corner of the page.
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Current language ('en' or 'ar')
 * @param {Function} props.setLanguage - Function to update the language state
 * @returns {JSX.Element} The rendered language toggle buttons
 * 
 * @example
 * ```jsx
 * import { useState } from 'react';
 * import LanguageToggle from '@/components/LanguageToggle';
 * 
 * function Page() {
 *   const [language, setLanguage] = useState('en');
 *   
 *   return (
 *     <>
 *       <LanguageToggle language={language} setLanguage={setLanguage} />
 *       <main>{language === 'en' ? 'Content' : 'المحتوى'}</main>
 *     </>
 *   );
 * }
 * ```
 */
export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
          language === 'en'
            ? 'bg-tec-green text-black'
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
          language === 'ar'
            ? 'bg-tec-green text-black'
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        ع
      </button>
    </div>
  );
}
