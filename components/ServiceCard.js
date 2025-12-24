
import Link from 'next/link'

export default function ServiceCard({ service }) {
  return (
    <Link href={service.url} className="group">
      <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-[#00c6ff]/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,198,255,0.2)]">
        
        {/* تصميم العنوان النخبوي */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black text-white group-hover:text-[#00ff9d] transition-colors">
            {service.name}
          </h3>
          <span className="text-[10px] font-bold py-1 px-2 bg-[#00c6ff]/20 text-[#00c6ff] rounded-full uppercase tracking-tighter">
            {service.domain}
          </span>
        </div>

        {/* وصف الخدمة */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-200">
          {service.description}
        </p>

        {/* سهم التوجيه الاستراتيجي */}
        <div className="flex items-center text-[#00c6ff] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Explore Domain 
          <span className="ml-2">→</span>
        </div>

        {/* تأثير إضاءة خلفي (Glow Effect) */}
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-[#0072ff]/0 to-[#00c6ff]/0 rounded-2xl group-hover:from-[#0072ff]/5 group-hover:to-[#00c6ff]/10 transition-all"></div>
      </div>
    </Link>
  )
}
