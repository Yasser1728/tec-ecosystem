import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const canvasRef = useRef(null);

  // تأثير الكلمات المتغيرة
  useEffect(() => {
    const words = ["Elite", "Titan", "Luxury", "Innovation", "Pi Ecosystem", "Future"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // تأثير الجزيئات المتحركة (Background Particles)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 198, 255, 0.5)";
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const categories = [
    { title: "Commerce & Finance", links: ["Commerce", "Ecommerce", "Assets", "Fundx", "Dx", "Analytics", "Nbf"] },
    { title: "Lifestyle & Elite", links: ["Life", "Estate", "VIP", "Elite", "Titan", "Legend", "Epic"] },
    { title: "Technology & Tools", links: ["Nx", "TEC", "Explorer", "System", "Alert", "Connection"] },
    { title: "Network & Partners", links: ["Nexus", "Brookfield", "Sab", "Zone", "Insure"] }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0e2b] text-white font-['Cairo'] overflow-x-hidden">
      <Head>
        <title>TEC | Titan Elite Commerce</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-60 pointer-events-none" />

      <header className="relative z-10 text-center pt-24 pb-16 px-5">
        <div className="text-7xl md:text-[6.8rem] font-[900] tracking-[12px] bg-gradient-to-r from-[#00ff9d] via-[#00c6ff] to-[#0072ff] bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,198,255,0.6)] leading-tight mb-4">
          TEC
        </div>
        <h1 className="text-2xl font-bold opacity-90">Titan Elite Commerce</h1>
        <div className="text-4xl md:text-[2.5rem] font-[900] bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent h-[70px] mt-6">
          {dynamicWord}
        </div>
        <p className="max-w-2xl mx-auto opacity-70 mt-4">Official Luxury Commerce & Finance Ecosystem on Pi Network</p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button className="bg-gradient-to-r from-[#ff8c00] to-[#ff5e00] px-10 py-4 rounded-full font-black shadow-[0_8px_30px_rgba(255,94,0,0.5)] hover:-translate-y-1 transition-all">
            Login with Pi
          </button>
          <button className="bg-gradient-to-r from-[#0072ff] to-[#00c6ff] px-10 py-4 rounded-full font-black shadow-[0_8px_30px_rgba(0,114,255,0.5)] hover:-translate-y-1 transition-all">
            Test Payment
          </button>
        </div>
      </header>

      <section className="relative z-10 max-w-[1400px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {categories.map((cat, index) => (
          <div key={index} className="bg-[rgba(0,198,255,0.12)] border-2 border-[rgba(0,198,255,0.4)] rounded-[26px] overflow-hidden transition-all duration-500">
            <h3 
              onClick={() => setOpenCat(openCat === index ? null : index)}
              className="bg-gradient-to-r from-[#0072ff] to-[#00c6ff] p-6 text-xl font-bold text-center cursor-pointer relative"
            >
              {cat.title}
              <span className="absolute right-6 top-1/2 -translate-y-1/2">{openCat === index ? '▲' : '▼'}</span>
            </h3>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openCat === index ? 'max-h-[1000px] p-6' : 'max-h-0'}`}>
              <div className="grid gap-3">
                {cat.links.map((link) => (
                  <a key={link} href={`/${link.toLowerCase()}`} className="bg-[rgba(255,255,255,0.08)] p-4 rounded-xl text-center font-bold border border-[rgba(0,198,255,0.2)] hover:bg-[rgba(0,198,255,0.4)] hover:translate-x-2 transition-all">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <footer className="relative z-10 py-20 bg-[rgba(0,198,255,0.05)] border-t-2 border-[rgba(0,198,255,0.3)] text-center px-5">
        <h3 className="text-3xl font-black mb-12 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent uppercase tracking-wider">
          Contact Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          <a href="mailto:info@tec.pi" className="bg-[rgba(0,198,255,0.15)] p-6 rounded-2xl border border-[rgba(0,198,255,0.4)] hover:bg-[rgba(0,198,255,0.3)] transition-all">Email: info@tec.pi</a>
          <a href="#" className="bg-[rgba(0,198,255,0.15)] p-6 rounded-2xl border border-[rgba(0,198,255,0.4)] hover:bg-[rgba(0,198,255,0.3)] transition-all">Telegram</a>
          <a href="#" className="bg-[rgba(0,198,255,0.15)] p-6 rounded-2xl border border-[rgba(0,198,255,0.4)] hover:bg-[rgba(0,198,255,0.3)] transition-all">Discord</a>
        </div>
        <p className="mt-16 opacity-50 text-sm">© 2025 Titan Elite Commerce — Sovereign Digital Authority</p>
      </footer>
    </div>
  );
}
