import React from 'react';
import { SEMINAR_GALLERY_PHOTOS } from '../data/galleryData';

export const AcademyGallerySection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">
              Autentické vzdelávanie
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
              Lučenec & Pódiové vystúpenia
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Život a edukácia v ateliéri.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Pohľad do zákulisia komorných masterclassov v Lučenci, živých ukážok na modelkách a osobných korekcií techniky priamo pod vedením Richarda Čonku.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SEMINAR_GALLERY_PHOTOS.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col justify-end p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-medium font-mono">
                  {item.subcategory}
                </span>
                <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-normal leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
