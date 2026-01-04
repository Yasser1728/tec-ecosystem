import { useEffect, useRef } from "react";

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // Cryptographically secure random number generator
    function secureRandom() {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / (0xffffffff + 1);
    }

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
      x: secureRandom() * window.innerWidth,
      y: secureRandom() * window.innerHeight,
      r: secureRandom() * 2 + 0.8,
      dx: (secureRandom() - 0.5) * 0.5,
      dy: (secureRandom() - 0.5) * 0.5,
    }));

    let animationId;

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, "rgba(0, 255, 157, 0.8)");
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
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 opacity-40 pointer-events-none"
    />
  );
}
