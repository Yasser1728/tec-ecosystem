import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const [language, setLanguage] = useState("en");
  const canvasRef = useRef(null);

  const content = {
    en: {
      title: "Titan Elite Commerce",
      tagline: "Elite",
      description: "Private Luxury Marketplace on Pi Network",
      subtitle: "24 Sovereign Business Units | Curated Deals Only",
      loginBtn: "🔐 Login with Pi",
      paymentBtn: "💎 Sovereign Payment",
      contactTitle: "Elite Support",
      copyright: "© 2025 Titan Elite Commerce — Sovereign Digital Authority"
    },
    ar: {
      title: "تيتان إيليت كوميرس",
      tagline: "نخبوي",
      description: "سوق فاخر خاص على شبكة Pi",
      subtitle: "24 وحدة أعمال سيادية | صفقات منسقة فقط",
      loginBtn: "🔐 تسجيل دخول Pi",
      paymentBtn: "💎 دفع سيادي",
      contactTitle: "الدعم النخبوي",
      copyright: "© 2025 تيتان إيليت كوميرس — سلطة رقمية سيادية"
    }
  };

  const t = content[language];

  useEffect(() => {
    const words = language === "en" 
      ? ["Elite", "Titan", "Luxury", "Sovereign", "Legacy", "Authority"]
      : ["نخبوي", "تيتان", "فاخر", "سيادي", "إرث", "سلطة"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6
    }));

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, "rgba(255, 215, 0, 0.8)");
        gradient.addColorStop(1, "rgba(0, 198, 255, 0.4)");
        ctx.fillStyle = gradient;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animationId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const domains = [
    {
      tier: "Finance & Investment",
      tierAr: "المالية والاستثمار",
      items: [
        { name: "FundX", desc: "High-yield strategies", descAr: "استراتيجيات عوائد مرتفعة", url: "fundx" },
        { name: "Assets", desc: "Portfolio management", descAr: "إدارة المحفظة", url: "assets" },
        { name: "NBF", desc: "Sovereign banking", descAr: "المصرفية السيادية", url: "nbf" },
        { name: "Insure", desc: "Deal protection", descAr: "حماية الصفقات", url: "insure" }
      ]
    },
    {
      tier: "Lifestyle & Elite",
      tierAr: "النمط الحياتي النخبوي",
      items: [
        { name: "VIP", desc: "Exclusive access", descAr: "وصول حصري", url: "vip" },
        { name: "Life", desc: "Long-term growth", descAr: "النمو طويل الأمد", url: "life" },
        { name: "Elite", desc: "Premium insights", descAr: "رؤى مميزة", url: "elite" },
        { name: "Titan", desc: "Market authority", descAr: "سلطة السوق", url: "titan" }
      ]
    },
    {
      tier: "Commerce & Trade",
      tierAr: "التجارة والأعمال",
      items: [
        { name: "Commerce", desc: "B2B strategies", descAr: "استراتيجيات B2B", url: "commerce" },
        { name: "Ecommerce", desc: "Luxury goods", descAr: "سلع فاخرة", url: "ecommerce" },
        { name: "Connection", desc: "Partner network", descAr: "شبكة الشركاء", url: "connection" },
        { name: "Nexus", desc: "Elite networking", descAr: "التواصل النخبوي", url: "nexus" }
      ]
    },
    {
      tier: "Real Estate",
      tierAr: "العقارات الفاخرة",
      items: [
        { name: "Estate", desc: "Property deals", descAr: "صفقات عقارية", url: "estate" },
        { name: "Brookfield", desc: "Landmark projects", descAr: "مشاريع مميزة", url: "brookfield" },
        { name: "Explorer", desc: "Travel & residency", descAr: "السفر والإقامة", url: "explorer" },
        { name: "Zone", desc: "Prime locations", descAr: "مواقع رئيسية", url: "zone" }
      ]
    },
    {
      tier: "Technology",
      tierAr: "التكنولوجيا",
      items: [
        { name: "DX", desc: "Digital transformation", descAr: "التحول الرقمي", url: "dx" },
        { name: "NX", desc: "Next-gen insights", descAr: "رؤى الجيل القادم", url: "nx" },
        { name: "System", desc: "Operations", descAr: "العمليات", url: "system" },
        { name: "Analytics", desc: "Performance tracking", descAr: "تتبع الأداء", url: "analytics" }
      ]
    },
    {
      tier: "Legacy & Authority",
      tierAr: "الإرث والسلطة",
      items: [
        { name: "Epic", desc: "Legacy projects", descAr: "مشاريع الإرث", url: "epic" },
        { name: "Legend", desc: "Prestige status", descAr: "المكانة المرموقة", url: "legend" },
        { name: "Alert", desc: "Market updates", descAr: "تحديثات السوق", url: "alert" }
      ]
    }
  ];

  const handlePiLogin = () => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
    } else {
      alert('Pi Browser required / يتطلب متصفح Pi');
    }
  };

  const onIncompletePaymentFound = (payment) => {
    console.log('Incomplete payment:', payment);
  };

  const handleTestPayment = () => {
    alert('Sovereign Payment Protocol\n\nCurated deals only - Contact your TEC consultant\n\nبروتوكول الدفع السيادي\n\nصفقات منسقة فقط - اتصل باستشاري TEC');
  };

  return (
    <>
      <Head>
        <title>TEC | Titan Elite Commerce</title>
        <meta name="description" content="Private Luxury Marketplace on Pi Network - 24 Sovereign Business Units" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #__next {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #0a0e2b;
          }
          body {
            overflow-x: hidden;
          }
        `}</style>
      </Head>

      <div style={styles.container}>
        <canvas ref={canvasRef} style={styles.canvas} />
        
        {/* Language Toggle */}
        <div style={styles.langToggle}>
          <button 
            style={{...styles.langBtn, ...(language === 'en' ? styles.langBtnActive : {})}}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button 
            style={{...styles.langBtn, ...(language === 'ar' ? styles.langBtnActive : {})}}
            onClick={() => setLanguage('ar')}
          >
            ع
          </button>
        </div>

        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logoSymbol}>◆</div>
            <div style={styles.logo}>TEC</div>
            <div style={styles.logoSymbol}>◆</div>
          </div>
          <div style={styles.subtitle}>{t.title}</div>
          <div style={styles.dynamicWord}>{dynamicWord}</div>
          <p style={styles.description}>{t.description}</p>
          <p style={styles.protocol}>{t.subtitle}</p>
          
          <div style={styles.buttonGroup}>
            <button style={{...styles.btn, ...styles.btnPi}} onClick={handlePiLogin}>
              {t.loginBtn}
            </button>
            <button style={{...styles.btn, ...styles.btnPayment}} onClick={handleTestPayment}>
              {t.paymentBtn}
            </button>
          </div>
        </header>
        
        <main style={styles.main}>
          <div style={styles.categoriesGrid}>
            {domains.map((domain, idx) => (
              <div key={idx} style={styles.tierCard}>
                <div 
                  style={styles.tierHeader}
                  onClick={() => setOpenCat(openCat === idx ? null : idx)}
                >
                  <span>{language === 'en' ? domain.tier : domain.tierAr}</span>
                  <span style={styles.arrow}>{openCat === idx ? '▲' : '▼'}</span>
                </div>
                <div style={{
                  ...styles.tierContent,
                  maxHeight: openCat === idx ? '800px' : '0',
                  padding: openCat === idx ? '20px' : '0'
                }}>
                  {domain.items.map((item, i) => (
                    <a 
                      key={i}
                      href={`/${item.url}`}
                      style={styles.domainLink}
                    >
                      <div style={styles.domainName}>{item.name}</div>
                      <div style={styles.domainDesc}>
                        {language === 'en' ? item.desc : item.descAr}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <footer style={styles.footer}>
          <h3 style={styles.footerTitle}>{t.contactTitle}</h3>
          <div style={styles.contactGrid}>
            <a href="mailto:support@tec.pi" style={styles.contactItem}>
              📧 support@tec.pi
            </a>
            <a href="#telegram" style={styles.contactItem}>
              💬 Telegram Elite
            </a>
            <a href="#discord" style={styles.contactItem}>
              🎮 Discord Sovereign
            </a>
          </div>
          <p style={styles.copyright}>{t.copyright}</p>
        </footer>
      </div>
    </>
  );
}

const styles = {
  container: {
    fontFamily: "'Cairo', 'Playfair Display', serif",
    background: 'linear-gradient(180deg, #0a0e2b 0%, #1a1538 30%, #2a1f4d 60%, #0a0e2b 100%)',
    color: 'white',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    position: 'relative',
    margin: 0,
    padding: 0
  },
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.4,
    pointerEvents: 'none'
  },
  langToggle: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 100,
    display: 'flex',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '4px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)'
  },
  langBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '8px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    transition: 'all 0.3s ease'
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000'
  },
  header: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    padding: '80px 20px 50px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '15px'
  },
  logoSymbol: {
    fontSize: '40px',
    color: '#FFD700',
    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(70px, 15vw, 140px)',
    fontWeight: 900,
    letterSpacing: '18px',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 50px rgba(255, 215, 0, 0.6))',
    textShadow: '0 0 80px rgba(255, 215, 0, 0.4)'
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '25px',
    letterSpacing: '2px'
  },
  dynamicWord: {
    fontSize: 'clamp(36px, 7vw, 60px)',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #FFD700, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.6s ease',
    filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))'
  },
  description: {
    maxWidth: '700px',
    margin: '20px auto 10px',
    opacity: 0.9,
    fontSize: '20px',
    lineHeight: 1.6,
    fontWeight: 600
  },
  protocol: {
    fontSize: '14px',
    opacity: 0.7,
    fontStyle: 'italic',
    marginBottom: '40px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '40px'
  },
  btn: {
    padding: '20px 50px',
    borderRadius: '50px',
    fontWeight: 900,
    fontSize: '17px',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  btnPi: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000',
    boxShadow: '0 10px 40px rgba(255, 215, 0, 0.5)'
  },
  btnPayment: {
    background: 'linear-gradient(135deg, #1a1f4d, #2a1538)',
    color: '#FFD700',
    boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
  },
  main: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '80px'
  },
  tierCard: {
    background: 'rgba(255, 215, 0, 0.05)',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.5s ease',
    backdropFilter: 'blur(10px)'
  },
  tierHeader: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000',
    padding: '22px',
    fontSize: '18px',
    fontWeight: 900,
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    userSelect: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  arrow: {
    transition: 'transform 0.3s ease',
    fontSize: '14px'
  },
  tierContent: {
    overflow: 'hidden',
    transition: 'all 0.5s ease'
  },
  domainLink: {
    background: 'rgba(255, 215, 0, 0.08)',
    padding: '16px',
    marginBottom: '10px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'white',
    display: 'block',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    transition: 'all 0.3s ease'
  },
  domainName: {
    fontSize: '18px',
    fontWeight: 900,
    color: '#FFD700',
    marginBottom: '6px',
    letterSpacing: '1px'
  },
  domainDesc: {
    fontSize: '13px',
    opacity: 0.8,
    lineHeight: 1.4
  },
  footer: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(0, 0, 0, 0.4)',
    borderTop: '2px solid rgba(255, 215, 0, 0.3)',
    padding: '60px 20px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)'
  },
  footerTitle: {
    fontSize: '32px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '40px'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 50px'
  },
  contactItem: {
    background: 'rgba(255, 215, 0, 0.1)',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    display: 'block'
  },
  copyright: {
    opacity: 0.6,
    fontSize: '13px',
    marginTop: '20px'
  }
};
