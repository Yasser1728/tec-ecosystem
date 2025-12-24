import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import ParticlesCanvas from '../components/ParticlesCanvas';
import LanguageToggle from '../components/LanguageToggle';
import HomeHeader from '../components/HomeHeader';
import DomainList from '../components/DomainList';
import HomeFooter from '../components/HomeFooter';
import { domains, content, dynamicWords } from '../lib/config/domains';

export default function Home() {
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const [language, setLanguage] = useState("en");

  const t = content[language];

  /* =========================
     DYNAMIC WORDS (Optimized)
  ========================= */
  const words = useMemo(() => {
    return dynamicWords[language];
  }, [language]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [words]);

  /* =========================
     PI SDK LOAD
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0" });
      }
    };
    document.body.appendChild(script);
  }, []);

  /* =========================
     PI ACTIONS
  ========================= */
  const handlePiLogin = () => {
    if (window.Pi) {
      window.Pi.authenticate(['username', 'payments'], payment => {
        console.log('Incomplete payment', payment);
      });
    } else {
      alert('Pi Browser required');
    }
  };

  const handlePayment = () => {
    alert(
      "Sovereign Payment Protocol\nCurated Deals Only\n\nبروتوكول الدفع السيادي\nصفقات منسقة فقط"
    );
  };

  return (
    <>
      <Head>
        <title>TEC | Sovereign Gateway</title>
        <meta
          name="description"
          content="Private Luxury Marketplace on Pi Network"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-tec-dark text-white font-[Cairo,Playfair_Display,serif] relative">
        <ParticlesCanvas />
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <HomeHeader 
          t={t} 
          dynamicWord={dynamicWord} 
          handlePiLogin={handlePiLogin}
          handlePayment={handlePayment}
        />
        <DomainList domains={domains} language={language} />
        <HomeFooter t={t} />
      </div>
    </>
  );
}
