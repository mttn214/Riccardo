import React from 'react';
import { AWARDS_DATA, STYLIST_PROFILE } from '../data/content';

export const AwardsSection: React.FC = () => {
  return (
    <section id="ocenenia" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
            Uznania & Súťaže
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Ocenenia a súťažná tvorba.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Dôkaz remeselnej precíznosti, ktorú Richard Čonka odovzdáva účastníkom na svojich seminároch.
          </p>
        </div>

        {/* Featured Big Award Card (Apple Keynote Style) with Authentic Real Photos */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-850 overflow-hidden mb-16 shadow-2xl">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-2">
                  17. ročník • Forum Karlín, Praha
                </span>
                <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight mb-3">
                  Víťaz: Cena verejnosti Slovenskej republiky
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                  Na slávnostnom galavečere prestížnych Czech & Slovak Hairdressing Awards (kadernícke „Oskary“) v Prahe získal Richard Čonka sošku víťaza celonárodného hlasovania verejnosti za svoju ikonickú 4-dielnu autorskú kolekciu.
                </p>
              </div>

              <div className="flex-shrink-0 text-left lg:text-right">
                <span className="text-4xl sm:text-6xl font-bold tracking-tight text-white block">
                  2023
                </span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block mt-1">
                  Czech & Slovak Hairdressing Awards
                </span>
              </div>
            </div>

            {/* Stage Ceremony Real Photo */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-8">
              <img
                src="/images/riccardo/richard_conka_stage_award.jpg"
                alt="Galavečer Czech & Slovak Hairdressing Awards 2023, Forum Karlín Praha"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                <span className="font-medium text-white">
                  Slávnostný galavečer Forum Karlín, Praha • Craft The Future 2023
                </span>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white">
                  Oficiálny fotografický archív
                </span>
              </div>
            </div>

            {/* 4 Winning Collection Looks Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-medium">
                  Víťazná súťažná kolekcia Richarda Čonku (Hair Salon Riccardo)
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  4 diela • 100% autorská tvorba
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { img: '/images/riccardo/richard_conka_hda_1.jpg', title: 'Žitná Symfónia' },
                  { img: '/images/riccardo/richard_conka_hda_2.jpg', title: 'Avant-Garde Volumetry' },
                  { img: '/images/riccardo/richard_conka_hda_3.jpg', title: 'Dark Elegance' },
                  { img: '/images/riccardo/richard_conka_hda_4.jpg', title: 'Pocta Tradícii' },
                ].map((item, idx) => (
                  <div key={idx} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="text-[11px] font-semibold text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Look {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Accolades List (Birne.sk style) */}
        <div className="divide-y divide-zinc-850 border-y border-zinc-850">
          {AWARDS_DATA.map((award) => (
            <div
              key={award.id}
              className="py-6 sm:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 group"
            >
              <div className="md:w-1/4">
                <span className="text-sm font-mono text-zinc-500 font-medium">
                  {award.year}
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  {award.location}
                </span>
              </div>

              <div className="md:w-2/4">
                <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                  {award.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-1">
                  {award.citation}
                </p>
              </div>

              <div className="md:w-1/4 md:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {award.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Block (Understated, clean) */}
        <div className="mt-20 pt-12 border-t border-zinc-900 max-w-3xl">
          <p className="text-xl sm:text-2xl text-zinc-300 font-normal leading-relaxed tracking-tight">
            „{STYLIST_PROFILE.quote}“
          </p>
          <span className="text-xs uppercase tracking-widest text-zinc-500 block mt-4 font-medium">
            Richard Čonka • Hair Salon Riccardo
          </span>
        </div>

      </div>
    </section>
  );
};
