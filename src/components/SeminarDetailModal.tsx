import React from 'react';
import { Seminar } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import { X, ArrowUpRight, Trophy, Flame, Users, Sparkles, ShieldCheck, Check, Clock, MapPin, Calendar, Bell } from 'lucide-react';

interface SeminarDetailModalProps {
  seminar: Seminar | null;
  currency: Currency;
  onClose: () => void;
  onSelectTier: (seminar: Seminar, tierId: string) => void;
  onOpenWaitlist?: () => void;
}

export const SeminarDetailModal: React.FC<SeminarDetailModalProps> = ({
  seminar,
  currency,
  onClose,
  onSelectTier,
  onOpenWaitlist,
}) => {
  if (!seminar) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn text-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800/90 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden my-4 flex flex-col max-h-[94vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/80 hover:bg-black text-zinc-400 hover:text-white border border-zinc-700/80 backdrop-blur-xl transition-all shadow-2xl cursor-pointer"
          aria-label="Zavrieť"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* URGENCY TOP BAR: Live Scarcity & High-Stakes Banner */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-amber-950 border-b border-amber-500/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <strong className="text-amber-300 font-bold tracking-wide uppercase">
              Prísna komornosť: Kapacita maximálne 6 kresiel
            </strong>
          </div>

          <div className="flex items-center gap-3 text-zinc-300 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Zostávajú posledné {seminar.availableSeats} voľné miesta
            </span>
            <span className="hidden md:inline text-zinc-600">•</span>
            <span className="hidden md:inline text-zinc-400">
              Predchádzajúce turnusy boli vypredané do 48 hodín
            </span>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative aspect-[16/7] sm:aspect-[21/7] w-full bg-black overflow-hidden flex-shrink-0">
          <img
            src={seminar.image}
            alt={seminar.title}
            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute top-4 left-6 z-10 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-xl border border-amber-500/40 text-amber-300 text-[11px] font-semibold shadow-xl">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Víťaz Czech & Slovak Hairdressing Awards (Praha)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 text-white text-[11px] font-medium shadow-xl">
              <Users className="w-3.5 h-3.5 text-white" />
              <span>Limit: 6 účastníkov</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 z-10">
            <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1 font-mono">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {seminar.city} ({seminar.venue})</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-amber-400" /> {seminar.dates}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {seminar.duration}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {seminar.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-9 overflow-y-auto space-y-8 flex-grow">
          
          {/* Proposition & Scarcity Quote */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold block">
                Filozofia vzdelávania Riccardo
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                1 200+ vyškolených kaderníkov
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              „Vzácnosť. Nie masovosť. Know-how, pre ktoré sa cestuje do Lučenca.“
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {seminar.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-200 font-medium">
              {seminar.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold block">
                Harmonogram & Štruktúra tréningu
              </span>
              <span className="text-xs text-zinc-500 font-mono">2 dni intenzívnej praxe</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seminar.schedule.map((dayItem, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {dayItem.day}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Deň {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-300 pt-1">
                    <p className="leading-relaxed">
                      <strong className="text-white block mb-0.5 font-semibold">Dopoludnia:</strong>
                      {dayItem.morning}
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-white block mb-0.5 font-semibold">Popoludní:</strong>
                      {dayItem.afternoon}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Kit & Perks */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Čo získate v cene vstupenky
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">All-Inclusive balíček</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              {seminar.includedItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* TIER SELECTION CARDS — "BITKA O MIESTA" */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Výber variantu účasti
                </span>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  Zabezpečte si jedno z posledných voľných kresiel
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Zostávajú {seminar.availableSeats} miesta
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seminar.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    tier.recommended
                      ? 'border-2 border-white bg-zinc-900 shadow-2xl ring-1 ring-white/10'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute top-0 right-0 bg-white text-black px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider shadow">
                      Odporúčané
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-base font-bold text-white tracking-tight">
                        {tier.name}
                      </h5>
                      <span className="text-xs text-zinc-400 block mt-0.5">
                        Kompletné 2 dni
                      </span>
                    </div>

                    <div className="py-2 border-y border-zinc-800">
                      <span className="text-3xl font-black text-white tracking-tight block">
                        {formatPrice(tier.priceEUR, currency)}
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Možnosť platby zálohy 100 € (doplatok na mieste)
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                      {tier.description}
                    </p>

                    <div className="space-y-1.5 pt-1 text-xs text-zinc-300">
                      {tier.features.slice(0, 4).map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTier(seminar, tier.id)}
                    className={`w-full mt-6 py-3 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xl active:scale-95 cursor-pointer ${
                      tier.recommended
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    <span>Bojovať o miesto • Zvoliť</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-300 font-medium">Hair Salon Riccardo • Atelier Lučenec (zeterem s.r.o.)</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWaitlist && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWaitlist();
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 text-xs"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Zapísať sa do Waitlistu</span>
              </button>
            )}
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
