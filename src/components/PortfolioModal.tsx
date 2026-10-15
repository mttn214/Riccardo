import React, { useState } from 'react';
import { PortfolioItem, SEMINARS_DATA } from '../data/content';
import { X, MoveHorizontal, ArrowUpRight, Trophy, Sparkles, Flame, Check, Bell, ShieldCheck, Users } from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onBookSeminar?: (seminar?: any, tierId?: string) => void;
  onOpenWaitlist?: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  item,
  onClose,
  onBookSeminar,
  onOpenWaitlist,
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

  // Find associated seminar for this styling category
  const matchingSeminar = SEMINARS_DATA[0];

  const handleDirectBooking = () => {
    if (onBookSeminar) {
      onBookSeminar(matchingSeminar, matchingSeminar?.tiers[0]?.id);
    } else {
      onClose();
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
            <div className="relative w-full h-[52vh] sm:h-[62vh] bg-black flex items-center justify-center overflow-hidden">
              {/* Volumetric ambient glow */}
              <div
                className="absolute inset-0 bg-cover bg-top filter blur-3xl opacity-20 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/60 pointer-events-none z-10" />

              {/* Full photo */}
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

          {/* ========================================================================= */}
          {/* VIP MASTERCLASS CONVERSION CARD — "BITKA O MIESTA" */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-amber-500/40 shadow-2xl relative overflow-hidden group">
            
            {/* Background luxury shimmer */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              
              {/* Scarcity Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Exkluzívny autorský masterclass v ateliéri
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Zostávajú posledné 2 miesta z 6
                </span>
              </div>

              {/* Proposition */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  Chcete ovládať rovnakú techniku fúkanej a stylingu vo svojom salóne?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-1.5">
                  Tento účes nie je len fotka na Instagrame. Je to presný systém ťahu kefou, práce s teplom a aerodynamiky, ktorý Richard Čonka odovzdáva <strong>v komornej skupine striktne 6 kaderníkov</strong> v materskom ateliéri v Lučenci. Predchádzajúce turnusy boli vypredané do 48 hodín od otvorenia prihlášok.
                </p>
              </div>

              {/* Scarcity Proof Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Striktný limit 6 kresiel</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% garancia asistencie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Termokefa Riccardo v cene</span>
                </div>
              </div>

              {/* Mini 6-Chairs Visual Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Stav kresiel v ateliéri:</span>
                  <span className="text-amber-300 font-bold">4 obsadené • 2 voľné</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-center text-[10px] font-mono text-zinc-500">
                    <span className="block font-bold">#01</span>
                    <span className="text-[9px]">Obsadené</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-center text-[10px] font-mono text-zinc-500">
                    <span className="block font-bold">#02</span>
                    <span className="text-[9px]">Obsadené</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-center text-[10px] font-mono text-zinc-500">
                    <span className="block font-bold">#03</span>
                    <span className="text-[9px]">Obsadené</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-center text-[10px] font-mono text-zinc-500">
                    <span className="block font-bold">#04</span>
                    <span className="text-[9px]">Obsadené</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-400 text-center text-[10px] font-mono text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-pulse">
                    <span className="block font-bold">#05</span>
                    <span className="text-[9px]">VOĽNÉ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-400 text-center text-[10px] font-mono text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-pulse">
                    <span className="block font-bold">#06</span>
                    <span className="text-[9px]">VOĽNÉ</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons ("Bojovať o miesto") */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleDirectBooking}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Bojovať o posledné voľné miesto (Rezervovať)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {onOpenWaitlist && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWaitlist();
                    }}
                    className="py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>VIP Waitlist</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-850 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Technika & Postup
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {item.technique}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-850 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block flex items-center gap-1.5">
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleDirectBooking}
              className="text-white hover:text-zinc-300 font-semibold transition-colors flex items-center gap-1 text-xs"
            >
              <span>Prihlásiť sa na seminár</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-zinc-700">|</span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Zatvoriť
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
