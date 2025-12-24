import Link from 'next/link'

export default function ServiceCard({ service }) {
  return (
    <Link href={service.url} className="group">
      <div className="relative p-8 bg-white/5 border border-white/10 rounded-3xl transition-all duration-500 hover:bg-white/10 hover:border-[#00ff9d]/50 hover:-translate-y-3 hover:shadow-[0_25px_60px_-15px_rgba(0,255,157,0.3)] overflow-hidden">
        
        {/* تأثير الإضاءة الخلفية المستمر */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#00c6ff]/10 blur-[60px] group-hover:bg-[#00ff9d]/20 transition-all duration-500"></div>

        <div className="relative z-10">
          {/* رأس البطاقة: الاسم والدومين */}
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-black text-white group-hover:text-[#00ff9d] transition-colors duration-300">
              {service.name}
            </h3>
            <span className="text-[10px] font-black py-1.5 px-3 bg-[#00c6ff]/10 text-[#00c6ff] rounded-lg border border-[#00c6ff]/20 uppercase tracking-widest">
              {service.domain}
            </span>
          </div>

          {/* وصف الخدمة النخبوي */}
          <p className="text-gray-400 text-sm leading-relaxed mb-8 group-hover:text-gray-200 transition-colors duration-300">
            {service.description}
          </p>

          {/* مؤشر التنفيذ الاستراتيجي */}
          <div className="flex items-center text-[#00ff9d] font-bold text-[10px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-all duration-500">
            Open Domain
            <span className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L17 6M17 6L12 11M17 6H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        {/* تأثير المسار السيادي السفلي */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] transition-all duration-500 group-hover:w-full"></div>
      </div>
    </Link>
  )
}
