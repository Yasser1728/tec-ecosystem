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
