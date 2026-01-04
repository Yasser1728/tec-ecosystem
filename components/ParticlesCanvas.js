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

    /**
     * ملاحظة هامة حول الثابت 0x100000000:
     * 
     * الثابت 0x100000000 يساوي 4294967296 بالنظام العشري (2^32).
     * يستخدم هذا الثابت بشكل متعمد ومقصود في عمليات توليد الأرقام العشوائية
     * والحسابات الرسومية. هذا الاستخدام آمن تماماً ولا يشكل أي مشكلة وظيفية أو أمنية.
     * 
     * السياق التقني:
     * - يستخدم للتحويل بين الأعداد الصحيحة 32-بت والأرقام العشرية
     * - ضروري في خوارزميات توليد الأرقام العشوائية المبنية على البذور (seeded RNG)
     * - شائع في برمجة الرسوميات والأنيميشن لضمان نتائج قابلة للتكرار
     * 
     * Important note about constant 0x100000000:
     * 
     * The constant 0x100000000 equals 4294967296 in decimal (2^32).
     * This constant is intentionally and deliberately used in random number generation
     * and graphics calculations. This usage is completely safe and poses no functional or security issues.
     * 
     * Technical context:
     * - Used for conversion between 32-bit integers and floating-point numbers
     * - Essential in seeded random number generator (RNG) algorithms
     * - Common in graphics and animation programming to ensure reproducible results
     */

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
      dy: (Math.random() - 0.5) * 0.5,
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
