import Link from "next/link";

const footerLinks = [
  {
    title: "Ecosystem",
    links: [
      { href: "/ecosystem", label: "All Domains" },
      { href: "/fundx", label: "FundX" },
      { href: "/estate", label: "Estate" },
      { href: "/explorer", label: "Explorer" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/tec/ai-assistant", label: "AI Assistant" },
      { href: "/upgrade", label: "Upgrade" },
      { href: "/tec/dashboard", label: "Dashboard" },
      { href: "/tec/overview", label: "Overview" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tec-green to-tec-blue flex items-center justify-center">
                <span className="text-tec-dark font-black text-xs">T</span>
              </div>
              <span className="font-bold text-white">TEC Ecosystem</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              24 Luxury Business Domains
              <br />
              Powered by Pi Network
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-tec-green transition-colors"
                    >
                      {link.label}
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
