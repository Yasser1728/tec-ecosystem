import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function DomainPage() {
  const router = useRouter();
  const { domain } = router.query;
  const [language, setLanguage] = useState("en");

  // بيانات الوحدات - يمكن نقلها لاحقاً إلى قاعدة البيانات (Prisma)
  const domainData = {
    fundx: { en: "High-yield investment strategies", ar: "استراتيجيات الاستثمار عالية العائد", icon: "📈" },
    vip: { en: "Exclusive elite access & concierge", ar: "وصول حصري للنخبة وخدمات خاصة", icon: "👑" },
    assets: { en: "Sovereign asset management", ar: "إدارة الأصول السيادية", icon: "🏛️" },
    // سيقوم النظام بالتعرف على البقية تلقائياً...
  };

  const currentData = domainData[domain] || { 
    en: "Exclusive Sovereign Business Unit", 
    ar: "وحدة أعمال سيادية حصرية",
    icon: "◆"
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>{domain?.toUpperCase()} | TEC Sovereign</title>
      </Head>

      <div style={styles.glassCard}>
        <div style={styles.icon}>{currentData.icon}</div>
        <h1 style={styles.title}>{domain?.toUpperCase()}</h1>
        <div style={styles.divider}></div>
        <p style={styles.desc}>
          {language === "en" ? currentData.en : currentData.ar}
        </p>
        
        <div style={styles.status}>
          <span style={styles.pulse}></span>
          {language === "en" ? "Protocol Active" : "البروتوكول نشط"}
        </div>

        <button style={styles.backBtn} onClick={() => router.push('/')}>
          {language === "en" ? "← Back to Nexus" : "← العودة للمركز"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0e2b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Cairo', sans-serif",
    padding: '20px'
  },
  glassCard: {
    background: 'rgba(255, 215, 0, 0.05)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '30px',
    padding: '60px 40px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },
  icon: { fontSize: '60px', marginBottom: '20px', filter: 'drop-shadow(0 0 15px #FFD700)' },
  title: { 
    fontSize: '40px', 
    fontWeight: '900', 
    color: '#FFD700', 
    letterSpacing: '5px',
    marginBottom: '10px'
  },
  divider: {
    height: '2px',
    width: '50px',
    background: '#FFD700',
    margin: '20px auto'
  },
  desc: { color: 'white', fontSize: '18px', opacity: 0.9, lineHeight: '1.6' },
  status: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#00ff9d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },
  pulse: {
    width: '8px',
    height: '8px',
    background: '#00ff9d',
    borderRadius: '50%',
    boxShadow: '0 0 10px #00ff9d',
    animation: 'pulse 1.5s infinite'
  },
  backBtn: {
    marginTop: '40px',
    background: 'transparent',
    border: '1px solid rgba(255, 215, 0, 0.5)',
    color: '#FFD700',
    padding: '12px 25px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  }
};
