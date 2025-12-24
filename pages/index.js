import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const canvasRef = useRef(null);

  // Dynamic word animation
  useEffect(() => {
    const words = ["Elite", "Titan", "Luxury", "Innovation", "Pi Ecosystem", "Future"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8
    }));

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 198, 255, 0.5)";
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

  const categories = [
    { title: "Commerce & Finance", links: ["Commerce", "Ecommerce", "Assets", "Fundx", "Dx", "Analytics", "Nbf"] },
    { title: "Lifestyle & Elite", links: ["Life", "Estate", "VIP", "Elite", "Titan", "Legend", "Epic"] },
    { title: "Technology & Tools", links: ["Nx", "TEC", "Explorer", "System", "Alert", "Connection"] },
    { title: "Network & Partners", links: ["Nexus", "Brookfield", "Sab", "Zone", "Insure"] }
  ];

  const handlePiLogin = () => {
    alert('Pi Network SDK Integration Required\n\nImplement: window.Pi.authenticate()');
  };

  const handleTestPayment = () => {
    alert('Pi Payment SDK Integration Required\n\nImplement: window.Pi.createPayment()');
  };

  return (
    <>
      <Head>
        <title>TEC | Titan Elite Commerce</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.container}>
        <canvas ref={canvasRef} style={styles.canvas} />
        
        <header style={styles.header}>
          <div style={styles.logo}>TEC</div>
          <div style={styles.subtitle}>Titan Elite Commerce</div>
          <div style={styles.dynamicWord}>{dynamicWord}</div>
          <p style={styles.description}>
            Official Luxury Commerce & Finance Ecosystem on Pi Network
          </p>
          
          <div style={styles.buttonGroup}>
            <button style={{...styles.btn, ...styles.btnPi}} onClick={handlePiLogin}>
              🔐 Login with Pi
            </button>
            <button style={{...styles.btn, ...styles.btnPayment}} onClick={handleTestPayment}>
              💎 Test Payment
            </button>
          </div>
        </header>
        
        <main style={styles.main}>
          <div style={styles.categories}>
            {categories.map((cat, index) => (
              <div key={index} style={styles.categoryCard}>
                <div 
                  style={{
                    ...styles.categoryHeader,
                    ...(openCat === index ? styles.categoryHeaderOpen : {})
                  }}
                  onClick={() => setOpenCat(openCat === index ? null : index)}
                >
                  {cat.title}
                  <span style={styles.arrow}>
                    {openCat === index ? '▲' : '▼'}
                  </span>
                </div>
                <div style={{
                  ...styles.categoryContent,
                  maxHeight: openCat === index ? '1000px' : '0',
                  padding: openCat === index ? '24px' : '0'
                }}>
                  <div style={styles.categoryLinks}>
                    {cat.links.map((link) => (
                      <a 
                        key={link}
                        href={`/${link.toLowerCase()}`}
                        style={styles.categoryLink}
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <footer style={styles.footer}>
          <h3 style={styles.footerTitle}>Contact Support</h3>
          <div style={styles.contactGrid}>
            <a href="mailto:info@tec.pi" style={styles.contactItem}>
              📧 Email: info@tec.pi
            </a>
            <a href="#telegram" style={styles.contactItem}>
              💬 Telegram
            </a>
            <a href="#discord" style={styles.contactItem}>
              🎮 Discord
            </a>
          </div>
          <p style={styles.copyright}>
            © 2025 Titan Elite Commerce — Sovereign Digital Authority
          </p>
        </footer>
      </div>
    </>
  );
}

const styles = {
  container: {
    fontFamily: "'Cairo', sans-serif",
    background: 'linear-gradient(180deg, #0a0e2b 0%, #1a1f4d 50%, #0a0e2b 100%)',
    color: 'white',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative'
  },
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.5,
    pointerEvents: 'none'
  },
  header: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    padding: '100px 20px 60px'
  },
  logo: {
    fontSize: 'clamp(60px, 12vw, 120px)',
    fontWeight: 900,
    letterSpacing: '12px',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00c6ff 50%, #0072ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 40px rgba(0, 198, 255, 0.6))',
    marginBottom: '10px',
    animation: 'glow 3s ease-in-out infinite'
  },
  subtitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '30px'
  },
  dynamicWord: {
    fontSize: 'clamp(32px, 6vw, 50px)',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #00ff9d, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    minHeight: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.6s ease'
  },
  description: {
    maxWidth: '700px',
    margin: '20px auto',
    opacity: 0.8,
    fontSize: '18px',
    lineHeight: 1.6
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '50px'
  },
  btn: {
    padding: '18px 45px',
    borderRadius: '50px',
    fontWeight: 900,
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnPi: {
    background: 'linear-gradient(135deg, #ff8c00, #ff5e00)',
    boxShadow: '0 10px 40px rgba(255, 94, 0, 0.5)'
  },
  btnPayment: {
    background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
    boxShadow: '0 10px 40px rgba(0, 114, 255, 0.5)'
  },
  main: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    margin: '60px 0 100px'
  },
  categoryCard: {
    background: 'rgba(0, 198, 255, 0.12)',
    border: '2px solid rgba(0, 198, 255, 0.4)',
    borderRadius: '26px',
    overflow: 'hidden',
    transition: 'all 0.5s ease'
  },
  categoryHeader: {
    background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
    padding: '24px',
    fontSize: '20px',
    fontWeight: 700,
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    userSelect: 'none'
  },
  arrow: {
    position: 'absolute',
    right: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'transform 0.3s ease'
  },
  categoryContent: {
    overflow: 'hidden',
    transition: 'all 0.5s ease'
  },
  categoryLinks: {
    display: 'grid',
    gap: '12px'
  },
  categoryLink: {
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '18px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: 700,
    border: '1px solid rgba(0, 198, 255, 0.2)',
    textDecoration: 'none',
    color: 'white',
    display: 'block',
    transition: 'all 0.3s ease'
  },
  footer: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(0, 198, 255, 0.05)',
    borderTop: '2px solid rgba(0, 198, 255, 0.3)',
    padding: '80px 20px',
    textAlign: 'center'
  },
  footerTitle: {
    fontSize: '32px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #00ff9d, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '50px'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    maxWidth: '1100px',
    margin: '0 auto 60px'
  },
  contactItem: {
    background: 'rgba(0, 198, 255, 0.15)',
    padding: '28px',
    borderRadius: '20px',
    border: '1px solid rgba(0, 198, 255, 0.4)',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    display: 'block'
  },
  copyright: {
    opacity: 0.5,
    fontSize: '14px'
  }
};
