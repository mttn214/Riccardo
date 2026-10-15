import React from 'react';
import { Seminar } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import { X, ArrowUpRight, Trophy, Flame, Users, Sparkles, ShieldCheck, Check, Clock, MapPin, Calendar, Bell, Lock } from 'lucide-react';

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

  const studioChairs = [
    { seat: '01', status: 'taken', name: 'Kaderníčka Zuzana', city: 'Bratislava', timeAgo: 'Pred 1 dňom' },
    { seat: '02', status: 'taken', name: 'Salón Michaela', city: 'Banská Bystrica', timeAgo: 'Pred 2 dňami' },
    { seat: '03', status: 'taken', name: 'Stylista Peter', city: 'Košice', timeAgo: 'Pred 3 dňami' },
    { seat: '04', status: 'taken', name: 'Štúdio Lenka', city: 'Brno (ČR)', timeAgo: 'Pred 4 dňami' },
    { seat: '05', status: 'free', name: 'VOĽNÉ KRESLO #5', city: 'Prebieha záujem', timeAgo: 'Posledná šanca' },
    { seat: '06', status: 'free', name: 'VOĽNÉ KRESLO #6', city: 'Prebieha záujem', timeAgo: 'Posledná šanca' },
  ];

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
        <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-amber-950 border-b border-amber-500/40 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <strong className="text-amber-300 font-bold tracking-wide uppercase">
              Prísna komornosť: Kapacita maximálne 6 kresiel
            </strong>
          </div>

          <div className="flex items-center gap-3 text-zinc-300 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Zostávajú posledné 2 voľné miesta
            </span>
            <span className="hidden md:inline text-zinc-600">•</span>
            <span className="hidden md:inline text-zinc-400">
              Predchádzajúce turnusy vypredané do 24–48 hodín
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
              <span>Striktný limit: 6 účastníkov</span>
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
          
          {/* ========================================================================= */}
          {/* 6-CHAIR STUDIO MAP: VISUAL PROOF OF HIGH-STAKES SCARCITY */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                    Stav obsadenosti ateliéru • 6 pracovných kresiel
                  </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-zinc-400">Obsadené: <strong className="text-white">4 / 6</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    Zostávajú 2 voľné
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Žiadna masovosť. V materskom ateliéri v Lučenci je pripravených <strong>iba 6 kresiel</strong>, aby Richard Čonka stál osobne pri každom z vás. 4 kreslá sú už potvrdené stylistami, zostávajú posledné 2 voľné miesta.
              </p>

              {/* Physical 6-Chair Studio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                {studioChairs.map((chair) => {
                  const isTaken = chair.status === 'taken';
                  return (
                    <div
                      key={chair.seat}
                      className={`p-3 rounded-2xl border flex flex-col justify-between transition-all text-left ${
                        isTaken
                          ? 'bg-zinc-950/80 border-zinc-850/90 text-zinc-500 opacity-80'
                          : 'bg-amber-950/40 border-2 border-amber-400 text-white shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:scale-105 cursor-pointer group'
                      }`}
                      onClick={() => {
                        if (!isTaken) {
                          onSelectTier(seminar, seminar.tiers[0].id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-400">
                          #{chair.seat}
                        </span>
                        {isTaken ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5 text-zinc-400" />
                            Obsadené
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-300 bg-amber-400/20 border border-amber-400/50 px-1.5 py-0.5 rounded font-bold animate-pulse">
                            <Flame className="w-2.5 h-2.5 fill-amber-400" />
                            VOĽNÉ
                          </span>
                        )}
                      </div>

                      <div>
                        <strong className={`block text-xs font-bold leading-tight ${isTaken ? 'text-zinc-400' : 'text-white'}`}>
                          {chair.name}
                        </strong>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {chair.city}
                        </span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-zinc-800/80 text-[9px] font-mono">
                        {isTaken ? (
                          <span className="text-zinc-400">{chair.timeAgo}</span>
                        ) : (
                          <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-0.5">
                            Bojovať o toto kreslo →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Fast-Action Callout */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-850">
                <div className="text-xs text-zinc-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span>Práve si tento termín prezerajú ďalší stylisti • Možnosť zaistenia zálohou 100 €</span>
                </div>

                <button
                  onClick={() => onSelectTier(seminar, seminar.tiers[0].id)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-xl active:scale-95 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Bojovať o voľné kreslo (Rezervovať)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Proposition & Philosophy */}
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
                  Zostávajú 2 voľné kreslá
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
                      Najžiadanejšie
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-base font-bold text-white tracking-tight">
                        {tier.name}
                      </h5>
                      <span className="text-xs text-zinc-400 block mt-0.5">
                        Kompletné 2 dni intenzívnej praxe
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
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
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
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Zapísať sa do Waitlistu</span>
              </button>
            )}
            <span className="text-zinc-700">|</span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Zatvoriť
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
