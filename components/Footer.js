import Link from "next/link";

const footerLinks = [
  {
    title: "Ecosystem",
    titleAr: "النظام البيئي",
    links: [
      { href: "/ecosystem", label: "All Domains", labelAr: "جميع النطاقات" },
      { href: "/fundx", label: "FundX", labelAr: "فندكس" },
      { href: "/estate", label: "Estate", labelAr: "العقارات" },
      { href: "/explorer", label: "Explorer", labelAr: "المستكشف" },
      { href: "/nbf", label: "NBF", labelAr: "البنك السيادي" },
      { href: "/vip", label: "VIP", labelAr: "كبار الشخصيات" },
    ],
  },
  {
    title: "Platform",
    titleAr: "المنصة",
    links: [
      { href: "/tec/ai-assistant", label: "AI Assistant", labelAr: "المساعد الذكي" },
      { href: "/upgrade", label: "Upgrade", labelAr: "ترقية" },
      { href: "/tec/dashboard", label: "Dashboard", labelAr: "لوحة التحكم" },
      { href: "/tec/overview", label: "Overview", labelAr: "نظرة عامة" },
      { href: "/domains", label: "Domain Portfolio", labelAr: "محفظة النطاقات" },
    ],
  },
  {
    title: "Resources",
    titleAr: "الموارد",
    links: [
      { href: "/pi-setup", label: "Pi Setup", labelAr: "إعداد Pi" },
      { href: "/membership", label: "Membership", labelAr: "العضوية" },
      { href: "/referral", label: "Referral", labelAr: "الإحالة" },
    ],
  },
  {
    title: "Legal",
    titleAr: "قانوني",
    links: [
      { href: "/privacy", label: "Privacy Policy", labelAr: "سياسة الخصوصية" },
      { href: "/terms", label: "Terms of Service", labelAr: "شروط الخدمة" },
    ],
  },
];

export default function Footer({ language = "en" }) {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tec-green to-tec-blue flex items-center justify-center">
                <span className="text-tec-dark font-black text-xs">T</span>
              </div>
              <span className="font-bold text-white">TEC Ecosystem</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              24 Luxury Business Domains
              <br />
              Powered by Pi Network
            </p>
            <p className="text-xs text-gray-600">
              {language === "ar"
                ? "تيتان إيليت كوميرس — 24 وحدة أعمال فاخرة"
                : "Titan Elite Commerce — Elite Business Services"}
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                {language === "ar" ? col.titleAr : col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-tec-green transition-colors"
                    >
                      {language === "ar" ? link.labelAr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} TEC Ecosystem &mdash; Titan Elite Commerce
          </p>
          <p className="text-xs text-gray-600">
            Built on Pi Network
          </p>
        </div>
      </div>
    </footer>
  );
}
