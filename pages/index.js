import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [openCat, setOpenCat] = useState(null);
  const [dynamicWord, setDynamicWord] = useState("Elite");
  const words = ["Elite", "Titan", "Luxury", "Innovation", "Pi Ecosystem", "Future"];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setDynamicWord(words[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      title: "Commerce & Finance",
      links: ["Commerce", "Ecommerce", "Assets", "Fundx", "Dx", "Analytics", "Nbf"]
    },
    {
      title: "Lifestyle & Elite",
      links: ["Life", "Estate", "VIP", "Elite", "Titan", "Legend", "Epic"]
    },
    {
      title: "Technology & Tools",
      links: ["Nx", "TEC", "Explorer", "System", "Alert", "Connection"]
    },
    {
      title: "Network & Partners",
      links: ["Nexus", "Brookfield", "Sab", "Zone", "Insure"]
    }
  ];

  return (
    <div className="bg-[#0a0e2b] min-h-screen text-white font-['Cairo']">
      <Head>
        <title>TEC | Titan Elite Commerce</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <header className="text-center pt-32 pb-20 px-5">
        <div className="text-[6.8rem] font-[900] tracking-[12px] bg-gradient-to-r from-[#00ff9d] via-[#00c6ff] to-[#0072ff] bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(0,198,255,0.6)] cursor-pointer leading-tight">
          TEC
        </div>
        <h1 className="text-2xl mt-4">Titan Elite Commerce</h1>
        <div className="text-[2.5rem] font-[900] bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent h-[70px] mt-8">
          {dynamicWord}
        </div>
        <p className="opacity-80 mt-4">Official Luxury Commerce & Finance Ecosystem on Pi Network</p>
        
        <div className="mt-10 space-x-4">
          <button className="bg-gradient-to-r from-[#ff8c00] to-[#ff5e00] px-10 py-4 rounded-full font-bold shadow-[0_8px_30px_rgba(255,94,0,0.5)] hover:-translate-y-1 transition-all">
            Login with Pi
          </button>
          <button className="bg-gradient-to-r from-[#0072ff] to-[#00c6ff] px-10 py-4 rounded-full font-bold shadow-[0_8px_30px_rgba(0,114,255,0.5)] hover:-translate-y-1 transition-all">
            Test Payment
          </button>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {categories.map((cat, index) => (
          <div key={index} className="bg-[rgba(0,198,255,0.15)] border-2 border-[rgba(0,198,255,0.5)] rounded-[26px] overflow-hidden transition-all duration-500">
            <h3 
              onClick={() => setOpenCat(openCat === index ? null : index)}
              className={`bg-gradient-to-r from-[#0072ff] to-[#00c6ff] p-8 text-2xl text-center cursor-pointer relative transition-all ${openCat === index ? 'open' : ''}`}
            >
              {cat.title}
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm">
                {openCat === index ? '▲' : '▼'}
              </span>
            </h3>
            <div className={`transition-all duration-700 ease-in-out overflow-hidden ${openCat === index ? 'max-h-[1000px] p-8 bg-[rgba(0,114,255,0.08)]' : 'max-h-0'}`}>
              <div className="flex flex-col gap-4">
                {cat.links.map((link) => (
                  <a key={link} href={`/${link.toLowerCase()}`} className="bg-[rgba(255,255,255,0.1)] p-4 rounded-2xl text-center font-bold border border-[rgba(0,198,255,0.3)] hover:bg-[rgba(0,198,255,0.4)] hover:translate-x-2 transition-all">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <footer className="mt-20 py-20 bg-[rgba(0,198,255,0.1)] border-t-2 border-[rgba(0,198,255,0.4)] text-center">
        <h3 className="text-4xl mb-12 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent font-bold">
          Contact / Get in Touch
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto px-5">
          <a href="mailto:info@tec.pi" className="bg-[rgba(0,198,255,0.2)] p-7 rounded-3xl font-bold border border-[rgba(0,198,255,0.5)] hover:-translate-y-2 transition-all">Email: info@tec.pi</a>
          <a href="#" className="bg-[rgba(0,198,255,0.2)] p-7 rounded-3xl font-bold border border-[rgba(0,198,255,0.5)] hover:-translate-y-2 transition-all">Telegram Support</a>
          <a href="#" className="bg-[rgba(0,198,255,0.2)] p-7 rounded-3xl font-bold border border-[rgba(0,198,255,0.5)] hover:-translate-y-2 transition-all">Discord Community</a>
        </div>
        <p className="mt-20 opacity-60">© 2025 Titan Elite Commerce — All rights reserved.</p>
      </footer>
    </div>
  );
}
