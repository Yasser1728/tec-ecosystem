import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { LanguageToggle } from "./layout";
import { useLanguage } from "../hooks/useLanguage";
import PiAuthButton from "./PiAuthButton";

const navLinks = [
  { href: "/domains", label: "Domains", labelAr: "النطاقات" },
  { href: "/ecosystem", label: "Ecosystem", labelAr: "النظام البيئي" },
  { href: "/tec/ai-assistant", label: "AI Assistant", labelAr: "المساعد الذكي" },
  { href: "/tec/dashboard", label: "Dashboard", labelAr: "لوحة التحكم" },
  { href: "/upgrade", label: "Upgrade", labelAr: "ترقية" },
];

export default function Header() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-tec-green/10">
      <div className="container mx-auto px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-tec-green to-tec-blue flex items-center justify-center">
              <span className="text-tec-dark font-black text-sm">T</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold bg-gradient-to-r from-tec-green to-tec-blue bg-clip-text text-transparent leading-tight">
                TEC
              </p>
              <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">
                Titan Elite Commerce
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-tec-green/10 text-tec-green"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {language === "ar" ? link.labelAr : link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — Auth + Language + Mobile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <PiAuthButton compact language={language} />
            </div>
            <LanguageToggle compact />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-800 mt-2 pt-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-tec-green/10 text-tec-green"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {language === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
              {/* Mobile Auth */}
              <div className="px-4 pt-3 border-t border-gray-800 mt-2">
                <PiAuthButton language={language} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
