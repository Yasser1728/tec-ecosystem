import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 py-16 px-6 bg-black/40 border-t border-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* شعار التميز التشغيلي */}
        <h3 className="text-3xl font-black bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent mb-10">
          TEC GLOBAL ECOSYSTEM
        </h3>

        {/* شبكة التواصل السيادية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
          <a href="mailto:info@tec.pi" className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00ff9d] transition-all group">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sovereign Email</span>
            <span className="text-sm font-bold group-hover:text-white transition-colors">info@tec.pi</span>
          </a>
          <a href="https://t.me/tec_support" target="_blank" className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00c6ff] transition-all group">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Telegram Support</span>
            <span className="text-sm font-bold group-hover:text-white transition-colors">@tec_support</span>
          </a>
          <a href="https://discord.gg/tec" target="_blank" className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#0072ff] transition-all group">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Elite Community</span>
            <span className="text-sm font-bold group-hover:text-white transition-colors">Discord Gateway</span>
          </a>
        </div>

        {/* الروابط القانونية والسيادية */}
        <div className="flex gap-8 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link href="/terms" className="hover:text-[#00ff9d] transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-[#00ff9d] transition-colors">Privacy Policy</Link>
          <Link href="/legal" className="hover:text-[#00ff9d] transition-colors">Sovereign Charter</Link>
        </div>

        {/* حقوق الملكية السيادية */}
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          © 2025 Titan Elite Commerce — Securing the Global Sovereign Legacy
        </p>
      </div>
    </footer>
  )
}
