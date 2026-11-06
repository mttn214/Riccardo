import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GlassHeadlineLine } from './GlassHeadlineLine';

interface HeroProps {
  onExploreSeminars: () => void;
  onExplorePortfolio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreSeminars, onExplorePortfolio }) => {
  return (
    <section className="pt-24 pb-20 sm:pt-28 sm:pb-28 overflow-hidden text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid items-start gap-6 sm:gap-8 md:-mb-[38px] md:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
          <div className="md:self-start md:pt-[clamp(1.5rem,7svh,5rem)] md:pb-8">
            {/* Eyebrow Label */}
            <div className="mb-4">
              <span className="text-[12px] uppercase tracking-[0.25em] text-zinc-400 font-medium">
                Richard Čonka • Hair Salon Riccardo
              </span>
            </div>

            {/* Large Clean Headline (Apple / Birne style) */}
            <h1 className="text-[clamp(2rem,8vw,3.75rem)] md:text-[clamp(2.5rem,6.1vw,5.25rem)] font-semibold tracking-[-0.035em] leading-[1.05] max-w-4xl">
              <GlassHeadlineLine>Umenie stylingu.</GlassHeadlineLine>
              <GlassHeadlineLine className="text-zinc-500 font-normal">Precíznosť formy.</GlassHeadlineLine>
            </h1>

            <div className="mt-6">
              {/* Crisp Subtitle */}
              <p className="text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-6 lg:mb-10 tracking-tight">
                Praktické vzdelávanie a autorské masterclassy pre kaderníkov. V materskom salóne v Lučenci a na turné v Bratislave, Prahe a Košiciach.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={onExploreSeminars}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:text-black transition-all active:scale-95 shadow-sm"
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
            </div>
          </div>

          <div className="relative mx-auto h-auto w-full max-w-[21rem] md:max-w-none md:-translate-x-[38px] md:-translate-y-[38px] [clip-path:inset(0_-100px_0_0)]">
            <img
              src="/images/riccardo/hero-model-with-bread.png"
              fetchPriority="high"
              alt="Modelka s dlhým vrkočom, chlebom a klasmi"
              width={1024}
              height={1536}
              className="mx-auto block h-auto w-[85.5%] motion-safe:animate-[hero-model-fade_24s_infinite]"
            />
            <img
              src="/images/riccardo/hero-model-glamour.png"
              alt="Modelka s objemnými kučerami a čiernymi šatami"
              width={1024}
              height={1536}
              className="absolute inset-x-0 top-[2%] h-auto w-full origin-top translate-x-[28px] scale-110 opacity-0 motion-safe:animate-[hero-model-fade_24s_-16s_infinite] motion-reduce:hidden"
            />
            <img
              src="/images/riccardo/hero-model-sunburst.png"
              alt="Modelka so zlatohnedými kučerami a červeným topom"
              className="absolute bottom-0 left-1/2 h-[97%] w-[110%] max-w-none -translate-x-1/2 object-contain object-bottom opacity-0 motion-safe:animate-[hero-model-fade_24s_-8s_infinite] motion-reduce:hidden"
            />
          </div>
        </div>

        {/* Clean Stats Strip (Birne style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-zinc-800/80">
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
            <GlassHeadlineLine className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">Víťaz</GlassHeadlineLine>
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
