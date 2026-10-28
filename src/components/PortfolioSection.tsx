import React, { useState } from 'react';
import { PORTFOLIO_DATA, PortfolioItem } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

interface PortfolioSectionProps {
  onSelectItem: (item: PortfolioItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Všetky diela');

  const categories = [
    'Všetky diela',
    'Umenie Fúkanej & Styling',
    'Precízne Strihy',
    'Balayage & Farba'
  ];

  const filteredItems = PORTFOLIO_DATA.filter((item) => {
    return selectedCategory === 'Všetky diela' || item.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">
              Autentická Tvorba
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
              100% Autentické fotografie • Bez AI
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Tvorba
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Galéria účesov, premien a ocenených autorských kolekcií Richarda Čonku z Czech & Slovak Hairdressing Awards. Kliknutím na ktorýkoľvek účes zobrazíte jeho detail, stylingové postupy a použité techniky.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clean Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Photo Box */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 group-hover:border-zinc-700 transition-all mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {item.hasBeforeAfter && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/10">
                      Pred / Po
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Minimal Caption */}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-zinc-300 transition-colors">
                  {item.title}
                </h3>
                <span className="text-xs text-zinc-500 block mt-0.5">
                  {item.category} • {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
