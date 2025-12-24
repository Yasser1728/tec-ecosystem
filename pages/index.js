import { useState, useEffect, useRef, memo } from 'react';

// Optimized Particle System
const ParticleCanvas = memo(() => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 198, 255, 0.4)";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    window.addEventListener('resize', setSize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setSize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 opacity-50" />;
});

// Category Card Component
const CategoryCard = memo(({ category, isOpen, onToggle }) => (
  <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 backdrop-blur-sm border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl hover:border-cyan-400/60 transition-all duration-500">
    <button
      onClick={onToggle}
      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-xl font-bold text-center relative hover:from-blue-500 hover:to-cyan-400 transition-all"
      aria-expanded={isOpen}
    >
      {category.title}
      <span className="absolute right-6 top-1/2 -translate-y-1/2 transition-transform duration-300" style={{ transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
        ▼
      </span>
    </button>
    <div 
      className="transition-all duration-500 ease-in-out overflow-hidden"
      style={{ maxHeight: isOpen ? '1000px' : '0' }}
    >
      <div className="p-6 grid gap-3">
        {category.links.map((link) => (
          <a 
            key={link}
            href={`/${link.toLowerCase()}`}
            className="bg-white/5 p-4 rounded-xl text-center font-bold border border-cyan-500/20 hover:bg-cyan-500/30 hover:translate-x-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  </div>
));

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const words = ["Elite", "Titan", "Luxury", "Innovation", "Pi Ecosystem", "Future"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 2000);
    return () => clearInterval(interval);
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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white font-sans overflow-x-hidden">
      {isClient && <ParticleCanvas />}
      
      <header className="relative z-10 text-center pt-20 pb-12 px-5">
        <div className="inline-block">
          <h1 className="text-7xl md:text-8xl font-black tracking-[0.2em] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl mb-2 animate-pulse">
            TEC
          </h1>
          <p className="text-xl font-semibold text-cyan-300/90 tracking-wider">
            Titan Elite Commerce
          </p>
        </div>
        
        <div className="mt-8 h-20 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {dynamicWord}
          </h2>
        </div>
        
        <p className="max-w-2xl mx-auto text-cyan-100/70 mt-6 text-lg leading-relaxed">
          Official Luxury Commerce & Finance Ecosystem on Pi Network
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button 
            onClick={handlePiLogin}
            className="group relative bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-4 rounded-full font-bold shadow-2xl shadow-orange-500/50 hover:shadow-orange-400/70 hover:-translate-y-1 transition-all overflow-hidden"
          >
            <span className="relative z-10">🔐 Login with Pi</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={handleTestPayment}
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 rounded-full font-bold shadow-2xl shadow-blue-500/50 hover:shadow-cyan-400/70 hover:-translate-y-1 transition-all overflow-hidden"
          >
            <span className="relative z-10">💎 Test Payment</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              category={cat}
              isOpen={openCat === index}
              onToggle={() => setOpenCat(openCat === index ? null : index)}
            />
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-16 bg-gradient-to-t from-slate-950 to-transparent border-t border-cyan-500/20 text-center px-5">
        <h3 className="text-3xl font-black mb-10 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
          Contact Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
          <a 
            href="mailto:info@tec.pi" 
            className="bg-cyan-500/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg"
          >
            📧 info@tec.pi
          </a>
          <a 
            href="#telegram" 
            className="bg-cyan-500/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg"
          >
            💬 Telegram
          </a>
          <a 
            href="#discord" 
            className="bg-cyan-500/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg"
          >
            🎮 Discord
          </a>
        </div>
        <p className="text-cyan-100/40 text-sm">
          © 2025 Titan Elite Commerce — Sovereign Digital Authority
        </p>
      </footer>
    </div>
  );
}
