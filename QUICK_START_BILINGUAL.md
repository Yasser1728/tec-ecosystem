# Quick Start Guide - Bilingual UI/UX Components
## TEC Ecosystem Phase 1 Implementation

This guide shows you how to quickly integrate the new bilingual components into your TEC pages.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Wrap Your App with LanguageProvider

```javascript
// pages/_app.js
import { LanguageProvider } from '../contexts/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
```

### Step 2: Use Language in Any Component

```javascript
// components/MyComponent.jsx
import { useLanguage } from '../hooks/useLanguage';

export default function MyComponent() {
  const { language, t, isRTL, setLanguage } = useLanguage();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('welcome')}</h1>
      <p>{language === 'ar' ? 'مرحبا بك!' : 'Welcome!'}</p>
      <button onClick={() => setLanguage('ar')}>العربية</button>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

### Step 3: Add Language Toggle to Header

```javascript
// components/Header.jsx
import { LanguageToggle } from '../components/layout';

export default function Header() {
  return (
    <header>
      <nav>
        {/* Your nav items */}
        <LanguageToggle compact />
      </nav>
    </header>
  );
}
```

### Step 4: Add Bottom Navigation (Mobile)

```javascript
// components/Layout.jsx
import { BottomNav } from '../components/layout';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
```

---

## 💬 AI Chat Interface

### Basic Implementation

```javascript
// pages/chat.js
import { LanguageProvider } from '../contexts/LanguageContext';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { MessageBubble, TypingIndicator, InputArea } from '../components/ai-assistant/ChatInterface';

function ChatPage() {
  const {
    messages,
    isProcessing,
    sendMessage,
    initializeConversation
  } = useAIAssistant({
    apiEndpoint: '/api/tec/assistant'
  });
  
  useEffect(() => {
    initializeConversation('gold'); // Initialize with tier
  }, []);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isProcessing && <TypingIndicator />}
      </div>
      
      {/* Input */}
      <InputArea
        onSend={sendMessage}
        disabled={isProcessing}
      />
    </div>
  );
}

export default function ChatPageWithProvider() {
  return (
    <LanguageProvider>
      <ChatPage />
    </LanguageProvider>
  );
}
```

### With Suggestions

```javascript
import { SuggestionPills } from '../components/ai-assistant/ChatInterface';
import { useLanguage } from '../hooks/useLanguage';

function ChatInterface() {
  const { language } = useLanguage();
  
  const suggestions = language === 'ar' 
    ? ['ما هي الخدمات؟', 'كيف أبدأ؟', 'تواصل معنا']
    : ['What services?', 'How to start?', 'Contact us'];
  
  return (
    <div>
      {/* ... your chat interface ... */}
      
      <SuggestionPills
        suggestions={suggestions}
        onSuggestionClick={(text) => sendMessage(text)}
        label={language === 'ar' ? 'جرب السؤال:' : 'Try asking:'}
      />
    </div>
  );
}
```

---

## 🌍 Translation Examples

### Using Built-in Translations

```javascript
import { useLanguage } from '../hooks/useLanguage';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <button>{t('submit')}</button>      {/* إرسال / Submit */}
      <button>{t('cancel')}</button>      {/* إلغاء / Cancel */}
      <p>{t('loading')}</p>               {/* جاري التحميل... / Loading... */}
      <p>{t('error')}</p>                 {/* خطأ / Error */}
      <p>{t('thinking')}</p>              {/* جاري التفكير... / Thinking... */}
    </div>
  );
}
```

### Adding Custom Translations

```javascript
// hooks/useLanguage.js (add to translations object)
const translations = {
  en: {
    // ... existing translations
    myNewKey: 'My Custom Text',
    welcomeMessage: 'Welcome to TEC!'
  },
  ar: {
    // ... existing translations
    myNewKey: 'نصي المخصص',
    welcomeMessage: 'مرحبا بك في TEC!'
  }
};

// Usage
function MyComponent() {
  const { t } = useLanguage();
  return <h1>{t('welcomeMessage')}</h1>;
}
```

### Conditional Text

```javascript
function MyComponent() {
  const { language } = useLanguage();
  
  return (
    <p>
      {language === 'ar' 
        ? 'هذا نص عربي طويل ومخصص'
        : 'This is a long custom English text'
      }
    </p>
  );
}
```

---

## 📱 Responsive Design

### Mobile-First Approach

```javascript
function ResponsiveComponent() {
  const { isRTL } = useLanguage();
  
  return (
    <div className="
      px-4 py-2              /* Mobile: Small padding */
      md:px-6 md:py-4        /* Tablet: Medium padding */
      lg:px-8 lg:py-6        /* Desktop: Large padding */
    " dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Single column on mobile, 2 cols on tablet, 3 on desktop */}
      <div className="
        grid grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        gap-4
      ">
        {/* Your content */}
      </div>
    </div>
  );
}
```

### Conditional Rendering by Screen Size

```javascript
function AdaptiveComponent() {
  return (
    <>
      {/* Show on mobile only */}
      <div className="block md:hidden">
        <MobileView />
      </div>
      
      {/* Show on desktop only */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}
```

---

## 🎨 Styling with RTL Support

### Using Tailwind with RTL

```javascript
function StyledComponent() {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`
      ${isRTL ? 'text-right' : 'text-left'}
      p-4 rounded-lg
      bg-gradient-to-r from-tec-green to-tec-blue
    `}>
      {/* Content */}
    </div>
  );
}
```

### Direction-Aware Margins/Padding

```javascript
// Instead of ml-4 (margin-left), use margin-inline-start
<div className="ms-4">  {/* Adapts to RTL/LTR */}
  <p>Content</p>
</div>

// Or use conditional classes
<div className={isRTL ? 'mr-4' : 'ml-4'}>
  <p>Content</p>
</div>
```

### Icons with RTL Support

```javascript
function ArrowButton() {
  const { isRTL } = useLanguage();
  
  return (
    <button className="flex items-center gap-2">
      <span>Continue</span>
      <span className={isRTL ? 'rotate-180' : ''}>→</span>
    </button>
  );
}
```

---

## 🔍 Language Detection

### Auto-detect Language from Text

```javascript
import { useLanguage } from '../hooks/useLanguage';

function ChatInput() {
  const { autoDetect } = useLanguage();
  const [input, setInput] = useState('');
  
  const handleChange = (e) => {
    const text = e.target.value;
    setInput(text);
    
    // Auto-detect language
    const detection = autoDetect(text);
    console.log('Detected:', detection);
    // { language: 'ar', confidence: 0.95, arabicPercentage: 0.85 }
  };
  
  return (
    <input 
      value={input}
      onChange={handleChange}
      placeholder="Type message..."
    />
  );
}
```

### Get Response Language

```javascript
import { useLanguage } from '../hooks/useLanguage';

function AIChat() {
  const { getResponseLang } = useLanguage();
  
  const sendMessage = async (userInput) => {
    // Detect which language to respond in
    const responseLang = getResponseLang(userInput);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message: userInput,
        language: responseLang  // 'en' or 'ar'
      })
    });
  };
}
```

---

## 📅 Date/Time Formatting

### Format Dates

```javascript
function DateDisplay({ date }) {
  const { formatDate } = useLanguage();
  
  return <p>{formatDate(date)}</p>;
  // English: "January 23, 2026"
  // Arabic: "٢٣ يناير ٢٠٢٦"
}
```

### Format Time

```javascript
function TimeDisplay({ timestamp }) {
  const { formatTime } = useLanguage();
  
  return <span>{formatTime(timestamp)}</span>;
  // English: "3:45 PM"
  // Arabic: "٣:٤٥ م"
}
```

### Relative Time

```javascript
function RelativeTime({ date }) {
  const { formatRelativeTime } = useLanguage();
  
  return <span>{formatRelativeTime(date)}</span>;
  // English: "2 hours ago"
  // Arabic: "منذ ساعتين"
}
```

---

## 🎯 Tier-Based Welcome Messages

### Initialize AI Assistant with Tier

```javascript
import { useAIAssistant } from '../hooks/useAIAssistant';

function AIAssistantChat() {
  const { initializeConversation } = useAIAssistant();
  const [userTier] = useState('platinum'); // From user session
  
  useEffect(() => {
    // Initialize with tier-based welcome
    initializeConversation(userTier);
    // Platinum: "Distinguished Platinum Member, your exclusive 
    //            TEC Concierge is honored to serve..."
  }, [userTier]);
}
```

### Available Tiers

```javascript
const tiers = [
  'free',      // Basic welcome
  'bronze',    // "Welcome, Bronze Member!"
  'silver',    // "Greetings, Silver Elite!"
  'gold',      // "Welcome, Gold Patron!"
  'platinum',  // "Distinguished Platinum Member"
  'diamond'    // "Esteemed Diamond Elite"
];
```

---

## ⚠️ Error Handling

### Bilingual Error Messages

```javascript
function ErrorDisplay() {
  const { t, language } = useLanguage();
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
        <p className="text-red-200">
          {language === 'ar' 
            ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'
            : 'An error occurred. Please try again.'
          }
        </p>
        <button onClick={() => setError(null)}>
          {t('close')}
        </button>
      </div>
    );
  }
  
  return null;
}
```

---

## 🧪 Testing

### Test Language Detection

```javascript
import { detectLanguage } from '../lib/ai/languageDetection';

test('detects Arabic correctly', () => {
  const result = detectLanguage('مرحبا بك في TEC');
  expect(result.language).toBe('ar');
  expect(result.confidence).toBeGreaterThan(0.9);
});

test('detects English correctly', () => {
  const result = detectLanguage('Welcome to TEC');
  expect(result.language).toBe('en');
  expect(result.confidence).toBeGreaterThan(0.9);
});
```

### Test Components with Language

```javascript
import { render } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';

test('renders in Arabic', () => {
  const { getByText } = render(
    <LanguageProvider defaultLanguage="ar">
      <MyComponent />
    </LanguageProvider>
  );
  
  expect(getByText('مرحبا')).toBeInTheDocument();
});
```

---

## 🎨 Component Customization

### Custom Language Toggle

```javascript
import { useLanguage } from '../hooks/useLanguage';

function CustomLanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={language === 'ar' ? 'active' : ''}
      >
        العربية
      </button>
    </div>
  );
}
```

### Custom Message Bubble

```javascript
function CustomMessageBubble({ message }) {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`
      flex ${message.role === 'user' 
        ? (isRTL ? 'justify-start' : 'justify-end')
        : (isRTL ? 'justify-end' : 'justify-start')
      }
    `}>
      <div className={`
        p-4 rounded-lg
        ${message.role === 'user' 
          ? 'bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark'
          : 'bg-gray-800 text-gray-100'
        }
      `}>
        {message.content}
      </div>
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Custom Hook with Language Support

```javascript
import { useLanguage } from '../hooks/useLanguage';

function useCustomFeature() {
  const { language, t } = useLanguage();
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    const response = await fetch(`/api/data?lang=${language}`);
    const result = await response.json();
    setData(result);
  };
  
  return {
    data,
    fetchData,
    errorMessage: t('errorOccurred')
  };
}
```

### Dynamic Route with Language

```javascript
import { useRouter } from 'next/router';
import { useLanguage } from '../hooks/useLanguage';

function DynamicPage() {
  const router = useRouter();
  const { language } = useLanguage();
  
  const navigate = (path) => {
    router.push(`/${language}${path}`);
  };
  
  return (
    <button onClick={() => navigate('/about')}>
      {language === 'ar' ? 'عن TEC' : 'About TEC'}
    </button>
  );
}
```

---

## 📚 Common Patterns

### Loading State

```javascript
function LoadingComponent() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-tec-green border-t-transparent rounded-full" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }
  
  return <YourContent />;
}
```

### Success Message

```javascript
function SuccessMessage({ message }) {
  const { language } = useLanguage();
  
  return (
    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
      <p className="text-green-200">
        ✓ {message || (language === 'ar' ? 'تم بنجاح' : 'Success')}
      </p>
    </div>
  );
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't: Hardcode text without translation
```javascript
// Bad
<button>Submit</button>

// Good
<button>{t('submit')}</button>
```

### ❌ Don't: Ignore RTL direction
```javascript
// Bad
<div className="text-left">Content</div>

// Good
<div className={isRTL ? 'text-right' : 'text-left'}>Content</div>
```

### ❌ Don't: Use language-specific margins
```javascript
// Bad
<div className="ml-4">Content</div>

// Good
<div className={isRTL ? 'mr-4' : 'ml-4'}>Content</div>
// Or use: className="ms-4" (margin-inline-start)
```

---

## 📞 Need Help?

- Check `/PHASE1_UI_UX_IMPLEMENTATION.md` for detailed docs
- See `/ARCHITECTURE_DIAGRAM.md` for visual reference
- Review code examples in `/pages/tec/ai-assistant-enhanced.js`
- Open GitHub issue for bugs or questions

---

**Quick Start Complete!** 🎉

You now have everything you need to integrate bilingual support into your TEC pages.

For more advanced use cases, refer to the comprehensive documentation files.
