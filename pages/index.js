import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BottomNav } from "../components/layout";
import ParticlesCanvas from "../components/ParticlesCanvas";
import PiAuthButton from "../components/PiAuthButton";
import { useLanguage } from "../hooks/useLanguage";

const domains = [
  { name: "FundX.pi", path: "/fundx", icon: "📊", desc: "Investment Strategies", color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  { name: "Assets.pi", path: "/assets", icon: "💼", desc: "Portfolio Management", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
  { name: "NBF.pi", path: "/nbf", icon: "🏦", desc: "Sovereign Banking", color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30" },
  { name: "Estate.pi", path: "/estate", icon: "🏠", desc: "Luxury Real Estate", color: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30" },
  { name: "Explorer.pi", path: "/explorer", icon: "✈️", desc: "Luxury Travel", color: "from-sky-500/20 to-cyan-500/20", border: "border-sky-500/30" },
  { name: "VIP.pi", path: "/vip", icon: "👑", desc: "Exclusive Access", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30" },
  { name: "Elite.pi", path: "/elite", icon: "⭐", desc: "Premium Consulting", color: "from-orange-500/20 to-red-500/20", border: "border-orange-500/30" },
  { name: "Nexus.pi", path: "/nexus", icon: "🔗", desc: "AI Integration", color: "from-teal-500/20 to-green-500/20", border: "border-teal-500/30" },
];

const features = [
  { icon: "🔒", title: "Private Marketplace", titleAr: "سوق خاص", desc: "Curated deals. No public catalogs.", descAr: "صفقات منتقاة. بدون كتالوجات عامة." },
  { icon: "💎", title: "Elite Focus", titleAr: "تركيز نخبوي", desc: "Exclusive opportunities for high-value members.", descAr: "فرص حصرية للأعضاء ذوي القيمة العالية." },
  { icon: "🌐", title: "Pi Powered", titleAr: "مدعوم بـ Pi", desc: "Sovereign settlements using Pi cryptocurrency.", descAr: "تسويات سيادية باستخدام عملة Pi." },
];

export default function Home() {
  const { isRTL, language } = useLanguage();
  const [piUser, setPiUser] = useState(null);

  return (
    <>
      <Head>
        <title>TEC - Titan Elite Commerce | 24 Elite Business Services</title>
        <meta
          name="description"
          content="Titan Elite Commerce - Private marketplace for elite opportunities across 24 business services powered by Pi Network"
        />
      </Head>

      <Header />

      <main className="relative min-h-screen bg-gray-900 text-white pb-16 md:pb-0" dir={isRTL ? "rtl" : "ltr"}>
        <ParticlesCanvas />

        {/* Hero */}
        <section className="relative z-10 container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tec-green/10 border border-tec-green/20 text-tec-green text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-tec-green animate-pulse" />
            24 Business Domains Live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-tec-green via-tec-blue to-tec-green bg-clip-text text-transparent bg-[length:200%] animate-[gradient_3s_ease_infinite]">
            TEC Ecosystem
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">
            Titan Elite Commerce
          </p>
          <p className="text-base text-gray-500 mb-10 max-w-xl mx-auto">
            {language === "ar"
              ? "24 وحدة أعمال فاخرة مستقلة | سوق خاص | مدعوم بشبكة Pi"
              : "24 Independent Luxury Business Units | Private Marketplace | Powered by Pi Network"}
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-12">
            <Link
              href="/ecosystem"
              className="bg-gradient-to-r from-tec-green to-tec-blue text-gray-900 px-7 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-tec-green/20 transition-all duration-300"
            >
              {language === "ar" ? "استكشف النطاقات" : "Explore Domains"}
            </Link>
            <Link
              href="/tec/ai-assistant"
              className="border border-tec-green/40 text-tec-green px-7 py-3 rounded-xl font-semibold hover:bg-tec-green/10 transition-all duration-300"
            >
              {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
            </Link>
          </div>

          {/* Pi Auth - compact */}
          <div className="max-w-sm mx-auto">
            <PiAuthButton
              onAuthSuccess={(user) => setPiUser(user)}
              onAuthError={(error) => console.error("Auth error:", error)}
            />
            {piUser && (
              <p className="mt-2 text-sm text-gray-500">
                Connected as @{piUser.username}
              </p>
            )}
          </div>
        </section>

        {/* Domain Cards */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {language === "ar" ? "خدمات الأعمال النخبوية" : "Elite Business Services"}
            </h2>
            <p className="text-gray-500">
              {language === "ar" ? "اختر النطاق المناسب لك" : "Choose the domain that fits your needs"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map((domain) => (
              <Link
                key={domain.name}
                href={domain.path}
                className={`group relative bg-gradient-to-br ${domain.color} border ${domain.border} rounded-2xl p-5 hover:scale-[1.03] hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-3xl mb-3">{domain.icon}</div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-tec-green transition-colors">
                  {domain.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{domain.desc}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-tec-green text-sm">
                  →
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/ecosystem"
              className="text-tec-green hover:text-tec-blue transition-colors text-sm font-medium"
            >
              {language === "ar" ? "عرض جميع الـ 24 نطاق ←" : "View all 24 domains →"}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="text-center bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 hover:border-tec-green/30 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">
                  {language === "ar" ? f.titleAr : f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {language === "ar" ? f.descAr : f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
