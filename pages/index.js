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
  const [piUser, setPiUser] = useState(null);

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
  const handlePiLogin = async () => {
    if (!window.Pi) return alert('Pi Browser required');
    try {
      const user = await window.Pi.authenticate(['username', 'payments']);
      setPiUser(user);
    } catch (err) {
      console.error('Pi authentication failed:', err);
      alert('Authentication failed.');
    }
  };

  const handlePayment = async () => {
    if (!window.Pi) return alert('Pi Browser required');
    if (!piUser) return alert('Please login with Pi first.');

    try {
      // 1. Create payment on backend
      const res = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1.0, // Example amount
          memo: "TEC Sovereign Access",
          domain: "TEC Ecosystem",
          userId: piUser.uid, // Use actual Pi User ID
          category: "access_fee"
        }),
      });

      const paymentData = await res.json();
      if (!paymentData.success) throw new Error(paymentData.error);

      // 2. Trigger Pi SDK Payment
      window.Pi.createPayment({
        amount: paymentData.payment.amount,
        memo: paymentData.payment.description,
        metadata: { internalId: paymentData.payment.id },
      }, {
        onReadyForServerApproval: (paymentId) => {
          fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, internalId: paymentData.payment.id })
          });
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, internalId: paymentData.payment.id })
          });
        },
        onCancel: (paymentId) => alert('Payment cancelled.'),
        onError: (error, payment) => alert('An error occurred during payment.'),
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment failed to start. See console for details.');
    }
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
