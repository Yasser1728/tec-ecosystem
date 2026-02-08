/**
 * UI Translations Dictionary
 * TEC Ecosystem - Comprehensive bilingual support (EN/AR)
 * 
 * @module i18n/translations
 * @version 1.0.0
 */

export const translations = {
  en: {
    // Nexus - Service Router
    nexus: {
      title: "Nexus Control Center",
      subtitle: "Access all TEC domains from one place",
      search: "What are you looking for?",
      searchPlaceholder: "Search domains, services, or features...",
      filterAll: "All Domains",
      filterFinancial: "Financial",
      filterPremium: "Premium",
      filterCommerce: "Commerce",
      filterTechnology: "Technology",
      filterSpecialized: "Specialized",
      filterHub: "Hub",
      resultsCount: "domain(s) found",
      noResults: "No domains found",
      tryDifferent: "Try a different search term",
      intentTitle: "Tell us what you need",
      intentPlaceholder: "I want to buy property, invest in funds...",
      intentSuggestions: "Suggested domains:",
      intentGo: "Go",
      intentExamples: [
        "I want to invest in high-yield funds",
        "Looking for luxury real estate",
        "Need banking services",
        "Want to travel in luxury",
        "Shop premium products",
      ],
    },

    // Payment - Readiness & Status
    payment: {
      readiness: "Payment System Status",
      ready: "Mainnet Ready",
      readyDesc: "Pi payments are fully operational",
      sandbox: "Sandbox Mode",
      sandboxDesc: "Testing mode - Testnet Pi",
      offline: "Offline",
      offlineDesc: "Pi SDK not available",
      walletConnected: "Wallet Connected",
      walletDisconnected: "Wallet Not Connected",
      networkMainnet: "Mainnet",
      networkTestnet: "Testnet",
      piApiAvailable: "Pi API Available",
      piApiUnavailable: "Pi API Unavailable",
      connectWallet: "Connect Wallet",
      unavailable: "Pi payment is currently unavailable",
      unavailableDesc: "The payment system is temporarily down. Please try again later.",
      checkBackSoon: "Check back soon",
      estimatedReturn: "Estimated return time:",
      useAlternative: "Use alternative payment methods",
    },

    // TEC Assistant
    assistant: {
      title: "TEC Assistant",
      subtitle: "Your AI-powered guide",
      placeholder: "Ask me anything...",
      send: "Send",
      minimize: "Minimize",
      close: "Close",
      unavailable: "Assistant temporarily unavailable",
      unavailableDesc: "The TEC Assistant is currently offline. You can browse our FAQ below.",
      typing: "Assistant is typing...",
      error: "Failed to send message",
      retry: "Try Again",
      
      // Quick actions
      quickActions: "Quick Actions",
      browseDomains: "Browse Domains",
      checkWallet: "Check Wallet",
      payWithPi: "Pay with Pi",
      getHelp: "Get Help",
      
      // FAQ
      faqTitle: "Frequently Asked Questions",
      faq: [
        {
          q: "How do I pay with Pi?",
          a: "Connect your Pi wallet using the Pi Network app, then click any 'Pay with Pi' button. Follow the prompts in the Pi app to complete payment."
        },
        {
          q: "What domains does TEC offer?",
          a: "TEC offers 24 premium domains covering Financial Services, Premium Memberships, Commerce, Technology, and Specialized Services."
        },
        {
          q: "How do I upgrade my membership?",
          a: "Visit the Upgrade page from the menu, select your desired tier (Standard, Premium, or Admin), and complete payment with Pi."
        },
        {
          q: "Is my data secure?",
          a: "Yes. TEC uses sovereign data controls, zero-trust security, and complies with GDPR, SOC2, and other international standards."
        },
        {
          q: "How do I contact support?",
          a: "Use the TEC Assistant, email support@tec-ecosystem.com, or visit our Help Center in the dashboard."
        },
      ],
    },

    // Mobile UX
    mobile: {
      pullToRefresh: "Pull to refresh",
      releasing: "Release to refresh",
      refreshing: "Refreshing...",
      refresh: "Refresh",
      loading: "Loading...",
      tapToRetry: "Tap to retry",
    },

    // Fallback UI
    fallback: {
      serviceUnavailable: "Service Temporarily Unavailable",
      serviceUnavailableDesc: "This service is currently undergoing maintenance. Please try again later.",
      tryAgain: "Try Again",
      autoRetryIn: "Auto-retry in",
      seconds: "seconds",
      goHome: "Go to Home",
      browseOther: "Browse Other Services",
      checkStatus: "Check System Status",
      contactSupport: "Contact Support",
    },

    // Common UI strings
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      retry: "Try Again",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      more: "More",
      less: "Less",
      all: "All",
      none: "None",
      yes: "Yes",
      no: "No",
      ok: "OK",
      back: "Back",
      next: "Next",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      powered: "Powered by",
    },

    // Domain keywords for Intent Detector
    domainKeywords: {
      // Financial
      fundx: ["invest", "investment", "fund", "portfolio", "yield", "returns", "strategy", "wealth"],
      assets: ["asset", "portfolio", "management", "tracking", "optimization"],
      nbf: ["bank", "banking", "transfer", "payment", "account", "finance", "loan"],
      insure: ["insurance", "protect", "protection", "coverage", "risk", "policy"],
      
      // Premium
      vip: ["vip", "exclusive", "membership", "premium", "elite", "special"],
      elite: ["consulting", "advisor", "advisory", "strategy", "expert"],
      titan: ["enterprise", "business", "authority", "market"],
      epic: ["project", "signature", "experience", "legacy"],
      legend: ["heritage", "elite", "membership"],
      
      // Commerce
      commerce: ["marketplace", "trade", "business", "commerce"],
      ecommerce: ["shop", "shopping", "buy", "purchase", "store", "product", "order"],
      
      // Real Estate & Travel
      estate: ["property", "real estate", "villa", "apartment", "house", "home", "luxury real estate"],
      explorer: ["travel", "trip", "vacation", "hotel", "flight", "luxury travel", "tourism"],
      
      // Technology
      dx: ["developer", "development", "code", "api", "tech", "tools"],
      nx: ["infrastructure", "network", "system", "devops"],
      nexus: ["integration", "ai", "automation", "connect"],
      system: ["monitor", "control", "admin", "system"],
      analytics: ["data", "analytics", "insights", "metrics", "reports"],
      alert: ["notification", "alert", "warning", "monitor"],
      
      // Specialized
      life: ["life", "growth", "wellness", "health"],
      connection: ["connect", "network", "relationship", "community"],
      brookfield: ["brookfield", "institutional", "infrastructure"],
      zone: ["zone", "area", "location", "region"],
      tec: ["tec", "ecosystem", "platform", "all services"],
    },
  },

  ar: {
    // Nexus - Service Router
    nexus: {
      title: "مركز تحكم نيكسوس",
      subtitle: "الوصول إلى جميع نطاقات TEC من مكان واحد",
      search: "عن ماذا تبحث؟",
      searchPlaceholder: "ابحث عن النطاقات أو الخدمات أو المميزات...",
      filterAll: "جميع النطاقات",
      filterFinancial: "المالية",
      filterPremium: "المميزة",
      filterCommerce: "التجارة",
      filterTechnology: "التكنولوجيا",
      filterSpecialized: "المتخصصة",
      filterHub: "المحاور",
      resultsCount: "نطاق تم العثور عليه",
      noResults: "لم يتم العثور على نطاقات",
      tryDifferent: "جرب مصطلح بحث مختلف",
      intentTitle: "أخبرنا بما تحتاج",
      intentPlaceholder: "أريد شراء عقار، الاستثمار في الصناديق...",
      intentSuggestions: "النطاقات المقترحة:",
      intentGo: "اذهب",
      intentExamples: [
        "أريد الاستثمار في صناديق ذات عوائد مرتفعة",
        "أبحث عن عقارات فاخرة",
        "أحتاج خدمات مصرفية",
        "أريد السفر بأسلوب فاخر",
        "تسوق منتجات مميزة",
      ],
    },

    // Payment - Readiness & Status
    payment: {
      readiness: "حالة نظام الدفع",
      ready: "الشبكة الرئيسية جاهزة",
      readyDesc: "مدفوعات Pi تعمل بشكل كامل",
      sandbox: "وضع الاختبار",
      sandboxDesc: "وضع الاختبار - شبكة Pi التجريبية",
      offline: "غير متصل",
      offlineDesc: "Pi SDK غير متاح",
      walletConnected: "المحفظة متصلة",
      walletDisconnected: "المحفظة غير متصلة",
      networkMainnet: "الشبكة الرئيسية",
      networkTestnet: "الشبكة التجريبية",
      piApiAvailable: "Pi API متاح",
      piApiUnavailable: "Pi API غير متاح",
      connectWallet: "ربط المحفظة",
      unavailable: "دفع Pi غير متاح حالياً",
      unavailableDesc: "نظام الدفع معطل مؤقتاً. الرجاء المحاولة لاحقاً.",
      checkBackSoon: "تحقق مرة أخرى قريباً",
      estimatedReturn: "وقت العودة المتوقع:",
      useAlternative: "استخدم طرق دفع بديلة",
    },

    // TEC Assistant
    assistant: {
      title: "مساعد TEC",
      subtitle: "دليلك المدعوم بالذكاء الاصطناعي",
      placeholder: "اسألني أي شيء...",
      send: "إرسال",
      minimize: "تصغير",
      close: "إغلاق",
      unavailable: "المساعد غير متاح مؤقتاً",
      unavailableDesc: "مساعد TEC غير متصل حالياً. يمكنك تصفح الأسئلة الشائعة أدناه.",
      typing: "المساعد يكتب...",
      error: "فشل إرسال الرسالة",
      retry: "حاول مرة أخرى",
      
      // Quick actions
      quickActions: "إجراءات سريعة",
      browseDomains: "تصفح النطاقات",
      checkWallet: "فحص المحفظة",
      payWithPi: "الدفع بـ Pi",
      getHelp: "الحصول على مساعدة",
      
      // FAQ
      faqTitle: "الأسئلة الشائعة",
      faq: [
        {
          q: "كيف أدفع بـ Pi؟",
          a: "اربط محفظة Pi الخاصة بك باستخدام تطبيق Pi Network، ثم انقر على أي زر 'الدفع بـ Pi'. اتبع التعليمات في تطبيق Pi لإتمام الدفع."
        },
        {
          q: "ما هي النطاقات التي تقدمها TEC؟",
          a: "تقدم TEC 24 نطاقاً مميزاً تغطي الخدمات المالية، والعضويات المميزة، والتجارة، والتكنولوجيا، والخدمات المتخصصة."
        },
        {
          q: "كيف أرقي عضويتي؟",
          a: "قم بزيارة صفحة الترقية من القائمة، اختر المستوى المطلوب (عادي، مميز، أو إداري)، وأكمل الدفع بـ Pi."
        },
        {
          q: "هل بياناتي آمنة؟",
          a: "نعم. تستخدم TEC ضوابط بيانات سيادية، وأمان بدون ثقة، وتتوافق مع GDPR وSOC2 ومعايير دولية أخرى."
        },
        {
          q: "كيف أتواصل مع الدعم؟",
          a: "استخدم مساعد TEC، أو راسلنا على support@tec-ecosystem.com، أو قم بزيارة مركز المساعدة في لوحة التحكم."
        },
      ],
    },

    // Mobile UX
    mobile: {
      pullToRefresh: "اسحب للتحديث",
      releasing: "اترك للتحديث",
      refreshing: "جارٍ التحديث...",
      refresh: "تحديث",
      loading: "جارٍ التحميل...",
      tapToRetry: "انقر للمحاولة مرة أخرى",
    },

    // Fallback UI
    fallback: {
      serviceUnavailable: "الخدمة غير متاحة مؤقتاً",
      serviceUnavailableDesc: "هذه الخدمة قيد الصيانة حالياً. الرجاء المحاولة لاحقاً.",
      tryAgain: "حاول مرة أخرى",
      autoRetryIn: "محاولة تلقائية خلال",
      seconds: "ثانية",
      goHome: "اذهب إلى الصفحة الرئيسية",
      browseOther: "تصفح خدمات أخرى",
      checkStatus: "تحقق من حالة النظام",
      contactSupport: "اتصل بالدعم",
    },

    // Common UI strings
    common: {
      loading: "جارٍ التحميل...",
      error: "خطأ",
      success: "نجح",
      retry: "حاول مرة أخرى",
      cancel: "إلغاء",
      confirm: "تأكيد",
      close: "إغلاق",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      more: "المزيد",
      less: "أقل",
      all: "الكل",
      none: "لا شيء",
      yes: "نعم",
      no: "لا",
      ok: "موافق",
      back: "رجوع",
      next: "التالي",
      submit: "إرسال",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      powered: "مدعوم بواسطة",
    },

    // Domain keywords for Intent Detector (Arabic)
    domainKeywords: {
      // Financial
      fundx: ["استثمار", "صندوق", "محفظة", "عوائد", "استراتيجية", "ثروة"],
      assets: ["أصول", "محفظة", "إدارة", "تتبع", "تحسين"],
      nbf: ["بنك", "مصرف", "تحويل", "دفع", "حساب", "تمويل", "قرض"],
      insure: ["تأمين", "حماية", "تغطية", "مخاطر", "وثيقة"],
      
      // Premium
      vip: ["في آي بي", "حصري", "عضوية", "مميز", "نخبة", "خاص"],
      elite: ["استشارات", "مستشار", "استشاري", "استراتيجية", "خبير"],
      titan: ["مؤسسة", "أعمال", "سلطة", "سوق"],
      epic: ["مشروع", "مميز", "تجربة", "إرث"],
      legend: ["تراث", "نخبة", "عضوية"],
      
      // Commerce
      commerce: ["سوق", "تجارة", "أعمال"],
      ecommerce: ["تسوق", "شراء", "شراء", "متجر", "منتج", "طلب"],
      
      // Real Estate & Travel
      estate: ["عقار", "عقارات", "فيلا", "شقة", "منزل", "بيت", "عقارات فاخرة"],
      explorer: ["سفر", "رحلة", "إجازة", "فندق", "طيران", "سفر فاخر", "سياحة"],
      
      // Technology
      dx: ["مطور", "تطوير", "كود", "برمجة", "تقنية", "أدوات"],
      nx: ["بنية تحتية", "شبكة", "نظام"],
      nexus: ["تكامل", "ذكاء اصطناعي", "أتمتة", "ربط"],
      system: ["مراقبة", "تحكم", "إدارة", "نظام"],
      analytics: ["بيانات", "تحليلات", "رؤى", "مقاييس", "تقارير"],
      alert: ["إشعار", "تنبيه", "تحذير", "مراقبة"],
      
      // Specialized
      life: ["حياة", "نمو", "عافية", "صحة"],
      connection: ["اتصال", "شبكة", "علاقة", "مجتمع"],
      brookfield: ["بروكفيلد", "مؤسسي", "بنية تحتية"],
      zone: ["منطقة", "مساحة", "موقع", "إقليم"],
      tec: ["تي إي سي", "نظام", "منصة", "جميع الخدمات"],
    },
  },
};

/**
 * Get translation by key
 * @param {string} language - Language code (en/ar)
 * @param {string} path - Dot notation path (e.g., 'nexus.title')
 * @returns {any} Translation value
 */
export function getTranslation(language, path) {
  const keys = path.split('.');
  let value = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return path; // Fallback to path if not found
    }
  }
  
  return value || path;
}

/**
 * Translation hook helper
 * @param {string} language - Language code
 * @returns {function} Translation function
 */
export function createTranslator(language) {
  return (path) => getTranslation(language, path);
}
