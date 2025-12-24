<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TEC | Titan Elite Commerce</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Cairo', sans-serif;
      background: linear-gradient(180deg, #0a0e2b 0%, #1a1f4d 50%, #0a0e2b 100%);
      color: white;
      overflow-x: hidden;
      min-height: 100vh;
    }
    
    #particleCanvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      opacity: 0.5;
      pointer-events: none;
    }
    
    .container {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      text-align: center;
      padding: 100px 20px 60px;
    }
    
    .logo {
      font-size: clamp(60px, 12vw, 120px);
      font-weight: 900;
      letter-spacing: 12px;
      background: linear-gradient(135deg, #00ff9d 0%, #00c6ff 50%, #0072ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 40px rgba(0, 198, 255, 0.6));
      animation: glow 3s ease-in-out infinite;
      margin-bottom: 10px;
    }
    
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 40px rgba(0, 198, 255, 0.6)); }
      50% { filter: drop-shadow(0 0 60px rgba(0, 255, 157, 0.8)); }
    }
    
    .subtitle {
      font-size: 22px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 30px;
    }
    
    .dynamic-word {
      font-size: clamp(32px, 6vw, 50px);
      font-weight: 900;
      background: linear-gradient(135deg, #00ff9d, #00c6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      min-height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.6s ease;
    }
    
    .description {
      max-width: 700px;
      margin: 20px auto;
      opacity: 0.8;
      font-size: 18px;
      line-height: 1.6;
    }
    
    .button-group {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 50px;
    }
    
    .btn {
      padding: 18px 45px;
      border-radius: 50px;
      font-weight: 900;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-pi {
      background: linear-gradient(135deg, #ff8c00, #ff5e00);
      box-shadow: 0 10px 40px rgba(255, 94, 0, 0.5);
    }
    
    .btn-pi:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 50px rgba(255, 94, 0, 0.7);
    }
    
    .btn-payment {
      background: linear-gradient(135deg, #0072ff, #00c6ff);
      box-shadow: 0 10px 40px rgba(0, 114, 255, 0.5);
    }
    
    .btn-payment:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 50px rgba(0, 198, 255, 0.7);
    }
    
    .categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin: 60px 0 100px;
    }
    
    .category-card {
      background: rgba(0, 198, 255, 0.12);
      border: 2px solid rgba(0, 198, 255, 0.4);
      border-radius: 26px;
      overflow: hidden;
      transition: all 0.5s ease;
    }
    
    .category-card:hover {
      border-color: rgba(0, 198, 255, 0.7);
      transform: translateY(-5px);
    }
    
    .category-header {
      background: linear-gradient(135deg, #0072ff, #00c6ff);
      padding: 24px;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
      position: relative;
      user-select: none;
    }
    
    .category-header::after {
      content: '▼';
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.3s ease;
    }
    
    .category-header.open::after {
      transform: translateY(-50%) rotate(180deg);
    }
    
    .category-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease;
    }
    
    .category-content.open {
      max-height: 1000px;
      padding: 24px;
    }
    
    .category-links {
      display: grid;
      gap: 12px;
    }
    
    .category-link {
      background: rgba(255, 255, 255, 0.08);
      padding: 18px;
      border-radius: 12px;
      text-align: center;
      font-weight: 700;
      border: 1px solid rgba(0, 198, 255, 0.2);
      text-decoration: none;
      color: white;
      display: block;
      transition: all 0.3s ease;
    }
    
    .category-link:hover {
      background: rgba(0, 198, 255, 0.4);
      transform: translateX(8px);
      border-color: rgba(0, 198, 255, 0.6);
    }
    
    footer {
      background: rgba(0, 198, 255, 0.05);
      border-top: 2px solid rgba(0, 198, 255, 0.3);
      padding: 80px 20px;
      text-align: center;
    }
    
    .footer-title {
      font-size: 32px;
      font-weight: 900;
      background: linear-gradient(135deg, #00ff9d, #00c6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 50px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto 60px;
    }
    
    .contact-item {
      background: rgba(0, 198, 255, 0.15);
      padding: 28px;
      border-radius: 20px;
      border: 1px solid rgba(0, 198, 255, 0.4);
      text-decoration: none;
      color: white;
      font-weight: 700;
      transition: all 0.3s ease;
      display: block;
    }
    
    .contact-item:hover {
      background: rgba(0, 198, 255, 0.3);
      border-color: rgba(0, 198, 255, 0.7);
      transform: translateY(-3px);
    }
    
    .copyright {
      opacity: 0.5;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .logo { font-size: 60px; letter-spacing: 6px; }
      .button-group { flex-direction: column; align-items: center; }
      .btn { width: 100%; max-width: 300px; }
      .categories { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>
  
  <header>
    <div class="logo">TEC</div>
    <div class="subtitle">Titan Elite Commerce</div>
    <div class="dynamic-word" id="dynamicWord">Elite</div>
    <p class="description">Official Luxury Commerce & Finance Ecosystem on Pi Network</p>
    
    <div class="button-group">
      <button class="btn btn-pi" onclick="handlePiLogin()">🔐 Login with Pi</button>
      <button class="btn btn-payment" onclick="handleTestPayment()">💎 Test Payment</button>
    </div>
  </header>
  
  <div class="container">
    <div class="categories" id="categories"></div>
  </div>
  
  <footer>
    <h3 class="footer-title">Contact Support</h3>
    <div class="contact-grid">
      <a href="mailto:info@tec.pi" class="contact-item">📧 Email: info@tec.pi</a>
      <a href="#" class="contact-item">💬 Telegram</a>
      <a href="#" class="contact-item">🎮 Discord</a>
    </div>
    <p class="copyright">© 2025 Titan Elite Commerce — Sovereign Digital Authority</p>
  </footer>

  <script>
    // Particle Animation
    const canvas = document.getElementById('particleCanvas');
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
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Dynamic Word Animation
    const words = ["Elite", "Titan", "Luxury", "Innovation", "Pi Ecosystem", "Future"];
    let wordIndex = 0;
    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      document.getElementById('dynamicWord').textContent = words[wordIndex];
    }, 2000);

    // Categories Data
    const categories = [
      { title: "Commerce & Finance", links: ["Commerce", "Ecommerce", "Assets", "Fundx", "Dx", "Analytics", "Nbf"] },
      { title: "Lifestyle & Elite", links: ["Life", "Estate", "VIP", "Elite", "Titan", "Legend", "Epic"] },
      { title: "Technology & Tools", links: ["Nx", "TEC", "Explorer", "System", "Alert", "Connection"] },
      { title: "Network & Partners", links: ["Nexus", "Brookfield", "Sab", "Zone", "Insure"] }
    ];

    // Render Categories
    const container = document.getElementById('categories');
    categories.forEach((cat, index) => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-header" onclick="toggleCategory(${index})" id="header-${index}">
          ${cat.title}
        </div>
        <div class="category-content" id="content-${index}">
          <div class="category-links">
            ${cat.links.map(link => `
              <a href="/${link.toLowerCase()}" class="category-link">${link}</a>
            `).join('')}
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    function toggleCategory(index) {
      const header = document.getElementById(`header-${index}`);
      const content = document.getElementById(`content-${index}`);
      
      header.classList.toggle('open');
      content.classList.toggle('open');
    }

    function handlePiLogin() {
      alert('Pi Network SDK Integration Required\n\nImplement: window.Pi.authenticate()');
    }

    function handleTestPayment() {
      alert('Pi Payment SDK Integration Required\n\nImplement: window.Pi.createPayment()');
    }
  </script>
</body>
</html>
