import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { STYLIST_PROFILE } from '../data/content';

interface HeroProps {
  onExploreSeminars: () => void;
  onExplorePortfolio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreSeminars, onExplorePortfolio }) => {
  return (
    <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Eyebrow Label */}
        <div className="mb-4">
          <span className="text-[12px] uppercase tracking-[0.25em] text-zinc-400 font-medium">
            Richard Čonka • Hair Salon Riccardo
          </span>
        </div>

        {/* Large Clean Headline (Apple / Birne style) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold tracking-[-0.035em] leading-[1.05] max-w-4xl mb-6">
          Umenie stylingu. <br />
          <span className="text-zinc-500 font-normal">Precíznosť formy.</span>
        </h1>

        {/* Crisp Subtitle */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10 tracking-tight">
          Praktické vzdelávanie a autorské masterclassy pre kaderníkov. V materskom salóne v Lučenci a na turné v Bratislave, Prahe a Košiciach.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mb-16">
          <button
            onClick={onExploreSeminars}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
          >
            <span>Vybrať termín seminára</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExplorePortfolio}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          >
            <span>Galéria účesov</span>
          </button>
        </div>

        {/* Editorial Photo Banner (Apple / Birne layout) */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/80 mb-16">
          <img
            src={STYLIST_PROFILE.heroImage}
            alt="Hair Salon Riccardo Lučenec"
            className="w-full h-full object-cover object-[center_20%] filter brightness-[0.75] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
                Najbližší autorský masterclass
              </span>
              <strong className="text-sm sm:text-base text-white font-medium">
                Architektúra stylingu — Lučenec (16.–17. Nov 2026)
              </strong>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white font-medium text-[11px]">
                Iba 3 voľné miesta
              </span>
            </div>
          </div>
        </div>

        {/* Clean Stats Strip (Birne style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-zinc-850">
          <div>
            <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">
              14+
            </span>
            <span className="text-xs text-zinc-400 tracking-tight">
              rokov salónnej praxe
            </span>
          </div>

          <div>
            <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">
              1 200+
            </span>
            <span className="text-xs text-zinc-400 tracking-tight">
              vyškolených kaderníkov
            </span>
          </div>

          <div>
            <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">
              Víťaz
            </span>
            <span className="text-xs text-zinc-400 tracking-tight">
              Czech & Slovak Hairdressing Awards (Praha)
            </span>
          </div>

          <div>
            <span className="block text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">
              Lučenec
            </span>
            <span className="text-xs text-zinc-400 tracking-tight">
              J. Kármána 1727/30
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
