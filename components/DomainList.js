import { useState } from 'react';
import Link from 'next/link';

export default function DomainList({ domains, language }) {
  const [openCat, setOpenCat] = useState(null);

  return (
    <main className="max-w-[1100px] mx-auto px-10 py-10">
      {domains.map((d, i) => (
        <div
          key={i}
          className="border border-tec-green/30 rounded-[20px] mb-5"
        >
          <div
            className="p-5 bg-tec-green text-black font-black cursor-pointer rounded-t-[20px]"
            onClick={() => setOpenCat(openCat === i ? null : i)}
          >
            {language === 'en' ? d.tier : d.tierAr}
          </div>
          {openCat === i &&
            d.items.map((item, j) => (
              <Link
                key={j}
                href={`/${item.url}`}
                className="block p-4 text-white no-underline hover:bg-white/5 transition-colors"
              >
                <strong>{item.name}</strong>
                <span className="ml-2 text-gray-400">
                  {language === 'en' ? item.desc : item.descAr}
                </span>
              </Link>
            ))}
        </div>
      ))}
    </main>
  );
}
