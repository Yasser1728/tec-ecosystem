import { useState } from 'react';
import Link from 'next/link';

/**
 * DomainList Component
 * 
 * Displays a collapsible list of TEC ecosystem domains organized by tiers.
 * Supports bilingual display (English/Arabic) and allows users to expand/collapse
 * categories to view domain details.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.domains - Array of domain objects containing tier and items
 * @param {string} props.domains[].tier - English tier name
 * @param {string} props.domains[].tierAr - Arabic tier name
 * @param {Array<Object>} props.domains[].items - Array of domain items in this tier
 * @param {string} props.domains[].items[].name - Domain name
 * @param {string} props.domains[].items[].url - Domain URL path
 * @param {string} props.domains[].items[].desc - English description
 * @param {string} props.domains[].items[].descAr - Arabic description
 * @param {string} props.language - Current language ('en' or 'ar')
 * @returns {JSX.Element} The rendered domain list
 * 
 * @example
 * ```jsx
 * import DomainList from '@/components/DomainList';
 * 
 * function DomainsPage() {
 *   const domains = [
 *     {
 *       tier: "Tier 1",
 *       tierAr: "المستوى 1",
 *       items: [
 *         { name: "TEC", url: "tec", desc: "Main platform", descAr: "المنصة الرئيسية" }
 *       ]
 *     }
 *   ];
 *   
 *   return <DomainList domains={domains} language="en" />;
 * }
 * ```
 */
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
