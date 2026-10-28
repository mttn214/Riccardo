import React, { useState } from 'react';
import { PortfolioItem } from '../data/content';
import { X, MoveHorizontal, Trophy, Sparkles } from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onBookSeminar?: (seminar?: any, tierId?: string) => void;
  onOpenWaitlist?: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  item,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  if (!item) return null;

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleSliderMove(e.clientX, rect);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn text-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800/90 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden my-4 flex flex-col max-h-[94vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/80 hover:bg-black text-zinc-400 hover:text-white border border-zinc-700/80 backdrop-blur-xl transition-all shadow-2xl cursor-pointer"
          aria-label="Zavrieť"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Viewport: Before/After Slider or Full High-End Photo */}
        <div className="relative w-full bg-black select-none overflow-hidden flex items-center justify-center">
          {item.hasBeforeAfter && item.beforeImage ? (
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] cursor-ew-resize overflow-hidden"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image */}
              <img
                src={item.image}
                alt={`${item.title} - Po premene`}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <span className="absolute top-4 right-14 px-3 py-1 text-[11px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/15 rounded-full z-10 shadow-lg">
                Po premene (Riccardo)
              </span>

              {/* Before Image (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={item.beforeImage}
                  alt={`${item.title} - Pred premenou`}
                  className="absolute inset-0 w-full h-full object-cover object-top max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-medium bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 rounded-full z-10 shadow">
                  Pôvodný stav
                </span>
              </div>

              {/* Minimal White Divider */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-2xl"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold">
                  <MoveHorizontal className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] text-zinc-200 pointer-events-none shadow-xl flex items-center gap-1.5 font-medium">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Potiahnite pre porovnanie premeny</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[54vh] sm:h-[64vh] bg-black flex items-center justify-center overflow-hidden p-3 sm:p-6">
              {/* Volumetric ambient glow */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-15 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* Full photo - uncropped, complete hairstyle and face visible */}
              <img
                src={item.image}
                alt={item.title}
                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              />

              {/* Top Luxury Prestige Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-amber-500/40 text-amber-300 text-[11px] font-semibold shadow-2xl">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cena verejnosti SR • Praha HDA</span>
                </span>
                
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 text-zinc-300 text-[11px] font-medium shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Autorská technika Richarda Čonku</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-9 overflow-y-auto space-y-7 flex-grow">
          
          {/* Header & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
              <span className="text-white font-semibold">{item.category}</span>
              <span>•</span>
              <span>{item.collection} ({item.year})</span>
              <span>•</span>
              <span className="text-amber-400 font-mono">Forum Karlín, Praha</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
              {item.title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mt-3 font-normal">
              {item.description}
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-850 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Technika & Postup
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {item.technique}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-850 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Nástroje & Prípravky
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {item.toolsUsed}
              </p>
            </div>
          </div>

          {/* Color Formula if available */}
          {item.formula && (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-850 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Receptúra farbenia
              </span>
              <p className="text-xs font-mono text-zinc-200">
                {item.formula}
              </p>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-300 font-medium">Hair Salon Riccardo • Atelier Lučenec</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors font-medium cursor-pointer"
          >
            Zatvoriť náhľad
          </button>
        </div>

      </div>
    </div>
  );
};
