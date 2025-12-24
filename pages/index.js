import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const [language, setLanguage] = useState("en");
  const canvasRef = useRef(null);

  /* =========================
     CONTENT
  ========================= */
  const content = {
    en: {
      title: "Titan Elite Commerce",
      description: "Private Luxury Marketplace on Pi Network",
      subtitle: "24 Sovereign Business Units | Curated Deals Only",
      loginBtn: "Login with Pi",
      paymentBtn: "Sovereign Payment",
      contactTitle: "Elite Support",
      copyright:
        "© 2025 Titan Elite Commerce — Sovereign Digital Authority"
    },
    ar: {
      title: "تيتان إيليت كوميرس",
      description: "سوق فاخر خاص على شبكة Pi",
      subtitle: "24 وحدة أعمال سيادية | صفقات منسقة فقط",
      loginBtn: "تسجيل دخول Pi",
      paymentBtn: "دفع سيادي",
      contactTitle: "الدعم النخبوي",
      copyright:
        "© 2025 تيتان إيليت كوميرس — سلطة رقمية سيادية"
    }
  };

  const t = content[language];

  /* =========================
     DYNAMIC WORDS (Optimized)
  ========================= */
  const words = useMemo(() => {
    return language === "en"
      ? ["Elite", "Titan", "Luxury", "Sovereign", "Legacy", "Authority"]
      : ["نخبوي", "تيتان", "فاخر", "سيادي", "إرث", "سلطة"];
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
     CANVAS PARTICLES (Retina Safe)
  ========================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const particleCount = window.innerWidth < 768 ? 30 : 60;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));

    let animationId;

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, "rgba(255,215,0,0.8)");
        g.addColorStop(1, "rgba(0,198,255,0.4)");
        ctx.fillStyle = g;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
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

  /* =========================
     DOMAINS
  ========================= */
  const domains = [
    {
      tier: "Finance & Investment",
      tierAr: "المالية والاستثمار",
      items: [
        { name: "FundX", desc: "High-yield strategies", descAr: "عوائد مرتفعة", url: "fundx" },
        { name: "Assets", desc: "Portfolio management", descAr: "إدارة المحافظ", url: "assets" }
      ]
    },
    {
      tier: "Technology",
      tierAr: "التكنولوجيا",
      items: [
        { name: "DX", desc: "Digital transformation", descAr: "تحول رقمي", url: "dx" },
        { name: "NX", desc: "Next-gen systems", descAr: "أنظمة الجيل القادم", url: "nx" }
      ]
    }
  ];

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

      <div style={styles.container}>
        <canvas ref={canvasRef} style={styles.canvas} />

        {/* Language Toggle */}
        <div style={styles.langToggle}>
          <button
            onClick={() => setLanguage('en')}
            style={language === 'en' ? styles.langActive : styles.langBtn}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ar')}
            style={language === 'ar' ? styles.langActive : styles.langBtn}
          >
            ع
          </button>
        </div>

        {/* HEADER */}
        <header style={styles.header}>
          <h1 style={styles.logo}>TEC</h1>
          <h2>{t.title}</h2>
          <div style={styles.dynamic}>{dynamicWord}</div>
          <p>{t.description}</p>
          <small>{t.subtitle}</small>

          <div style={styles.actions}>
            <button onClick={handlePiLogin} style={styles.primary}>
              {t.loginBtn}
            </button>
            <button onClick={handlePayment} style={styles.secondary}>
              {t.paymentBtn}
            </button>
          </div>
        </header>

        {/* DOMAINS */}
        <main style={styles.main}>
          {domains.map((d, i) => (
            <div key={i} style={styles.card}>
              <div
                style={styles.cardHeader}
                onClick={() => setOpenCat(openCat === i ? null : i)}
              >
                {language === 'en' ? d.tier : d.tierAr}
              </div>
              {openCat === i &&
                d.items.map((item, j) => (
                  <Link key={j} href={`/${item.url}`} style={styles.link}>
                    <strong>{item.name}</strong>
                    <span>
                      {language === 'en' ? item.desc : item.descAr}
                    </span>
                  </Link>
                ))}
            </div>
          ))}
        </main>

        <footer style={styles.footer}>
          <h3>{t.contactTitle}</h3>
          <p>support@tec.pi</p>
          <p>{t.copyright}</p>
        </footer>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0e2b',
    color: '#fff',
    fontFamily: "'Cairo','Playfair Display',serif",
    position: 'relative'
  },
  canvas: {
    position: 'fixed',
    inset: 0,
    opacity: 0.4,
    pointerEvents: 'none'
  },
  langToggle: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 50,
    display: 'flex',
    gap: 8
  },
  langBtn: {
    background: 'transparent',
    color: '#aaa',
    border: 'none',
    cursor: 'pointer'
  },
  langActive: {
    background: '#FFD700',
    color: '#000',
    borderRadius: 20,
    padding: '6px 14px',
    border: 'none'
  },
  header: {
    textAlign: 'center',
    padding: '120px 20px'
  },
  logo: {
    fontSize: 96,
    fontWeight: 900,
    color: '#FFD700'
  },
  dynamic: {
    fontSize: 42,
    fontWeight: 900,
    color: '#00c6ff',
    margin: 20
  },
  actions: {
    marginTop: 40,
    display: 'flex',
    gap: 20,
    justifyContent: 'center'
  },
  primary: {
    background: '#FFD700',
    border: 'none',
    padding: '16px 40px',
    fontWeight: 900
  },
  secondary: {
    background: 'transparent',
    border: '2px solid #FFD700',
    color: '#FFD700',
    padding: '16px 40px'
  },
  main: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: 40
  },
  card: {
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: 20,
    marginBottom: 20
  },
  cardHeader: {
    padding: 20,
    background: '#FFD700',
    color: '#000',
    fontWeight: 900,
    cursor: 'pointer'
  },
  link: {
    display: 'block',
    padding: 16,
    textDecoration: 'none',
    color: '#fff'
  },
  footer: {
    textAlign: 'center',
    padding: 40,
    opacity: 0.7
  }
};
