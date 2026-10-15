import React, { useState } from 'react';
import { ACADEMY_FAQ_DATA, FAQItem } from '../data/content';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const AcademyFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');

  const categories = ['Všetky', 'Priebeh', 'Vybavenie', 'Certifikácia', 'Rezervácia'] as const;

  const filteredFaqs = ACADEMY_FAQ_DATA.filter((item) => {
    if (activeCategory === 'Všetky') return true;
    return item.category === activeCategory;
  });

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
            <span>Všetko o priebehu vzdelávania</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Často kladené otázky.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Dôležité informácie pre kaderníkov pred účasťou na majstrovskom seminári v Lučenci.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Minimalist Accordion */}
        <div className="divide-y divide-zinc-850 border-y border-zinc-850">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5 sm:py-6 group transition-colors">
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-white group-hover:text-zinc-300 transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-zinc-800 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-4 pr-6 sm:pr-12 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
