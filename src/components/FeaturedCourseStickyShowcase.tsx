import React from 'react';
import { Seminar } from '../data/content';
import { formatPrice } from '../utils/currency';
import { ArrowUpRight, Check, Flame, Trophy, Users, Sparkles, ShieldCheck, Clock, MapPin, Calendar, Bell, Lock } from 'lucide-react';

interface FeaturedCourseStickyShowcaseProps {
  seminar: Seminar;
  onOpenBooking: (seminar: Seminar, tierId?: string) => void;
  onOpenWaitlist: () => void;
}

export const FeaturedCourseStickyShowcase: React.FC<FeaturedCourseStickyShowcaseProps> = ({
  seminar,
  onOpenBooking,
  onOpenWaitlist,
}) => {
  const chairs = [
    { seat: '01', status: 'taken', name: 'Kaderníčka Zuzana', city: 'Bratislava' },
    { seat: '02', status: 'taken', name: 'Salón Michaela', city: 'Banská Bystrica' },
    { seat: '03', status: 'taken', name: 'Stylista Peter', city: 'Košice' },
    { seat: '04', status: 'taken', name: 'Štúdio Lenka', city: 'Brno (ČR)' },
    { seat: '05', status: 'free', name: 'VOĽNÉ KRESLO #5', city: 'Prebieha záujem' },
    { seat: '06', status: 'free', name: 'VOĽNÉ KRESLO #6', city: 'Posledná šanca' },
  ];

  return (
    <section id="featured-drop" className="py-20 sm:py-28 bg-black border-t border-zinc-900 text-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Najbližší autorský masterclass v Lučenci</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Vzácnosť. Nie masovosť.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Zostávajú 2 voľné kreslá z 6
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2-COLUMN APPLE STICKY SHOWCASE: Woman Freezes (Sticky) + Stream Scrolls */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

          {/* --------------------------------------------------------------------- */}
          {/* COLUMN 1: THE STICKY CUTOUT WOMAN ("TA ŽENA ZASTALA") */}
          {/* Sticks to viewport while right column cards scroll naturally past her */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 relative w-full">
            <div className="sticky top-20 sm:top-24 self-start h-[56vh] sm:h-[68vh] lg:h-[78vh] flex flex-col items-center justify-end overflow-visible select-none pointer-events-none">
              
              {/* Soft Ambient Rim Light Glow Behind Woman */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

              {/* Realistic Floor Shadow Underneath */}
              <div className="absolute bottom-0 w-3/4 h-12 bg-black/95 blur-xl rounded-full pointer-events-none" />

              {/* Cutout Woman Image: Sharp, Studio-Clean Transparent Cutout */}
              <img
                src="/images/riccardo/model_cutout_look2.webp"
                alt="Richard Čonka — Umenie fúkanej, Kolekcia HDA"
                className="relative z-10 h-full w-auto object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.98)] select-none"
                style={{ maxHeight: '100%' }}
              />

              {/* Floating Scarcity Badge Pinned to Her Silhouette */}
              <div className="absolute top-1/4 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-xl border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-2xl animate-pulse pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Posledné 2 miesta z 6</span>
              </div>

              {/* Sub-label */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800">
                  Autorský styling Riccardo • Praha HDA
                </span>
              </div>

            </div>
          </div>


          {/* --------------------------------------------------------------------- */}
          {/* COLUMN 2: THE MOVING STREAM OF CARDS ("VŠETKO OSTATNÉ SA HÝBE") */}
          {/* Scrolls smoothly past the pinned woman with zero lag */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 py-2">

            {/* CARD 1: Identity & 72-Hour Volume Guarantee */}
            <div className="p-6 sm:p-9 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl space-y-4 ring-1 ring-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {seminar.dates}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {seminar.city} (Atelier)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {seminar.duration}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {seminar.title}
                </h3>
                <p className="text-sm sm:text-base text-amber-300 font-semibold mt-1">
                  72-hodinový objem bez jedinej kvapky laku či krepatenia.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {seminar.description}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-zinc-400 border-t border-zinc-850">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Ocenené víťaznou soškou na HDA v Prahe</span>
                </div>
                <span>•</span>
                <span>100% autorské know-how</span>
              </div>
            </div>


            {/* CARD 2: Intensive Practice & Included Gear */}
            <div className="p-6 sm:p-9 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl space-y-4 ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Intenzívna hands-on prax</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">Mentoring 1-na-1</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Žiadne prednášky z diaľky. Tréning priamo pri vašom kresle.
              </h4>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Aerodynamika tepla & ťah:</strong> Správny uhol nadvihnutia od korienka a uzamknutie studeným vzduchom.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Prax na modelkách:</strong> Individuálna korekcia každého ťahu zápästia od Richarda Čonku.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Výbava v cene:</strong> Originálna termálna kefa Riccardo v hodnote 49 €, manuál a akreditovaný certifikát.</span>
                </div>
              </div>
            </div>


            {/* CARD 3: 6-Chair Studio Scarcity Map ("Bitka o miesta") */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                    Stav obsadenosti ateliéru • 6 pracovných kresiel
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  Zostávajú 2 voľné kreslá
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                V ateliéri v Lučenci je pripravených <strong>iba 6 fyzických kresiel</strong>. Štyri sú už rezervované stylistami zo Slovenska a Česka. Predchádzajúce turnusy boli vypredané do 48 hodín.
              </p>

              {/* 6 Chairs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {chairs.map((chair) => {
                  const isTaken = chair.status === 'taken';
                  return (
                    <div
                      key={chair.seat}
                      onClick={() => {
                        if (!isTaken) {
                          onOpenBooking(seminar, seminar.tiers[0].id);
                        }
                      }}
                      className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                        isTaken
                          ? 'bg-zinc-950/80 border-zinc-850/90 text-zinc-500 opacity-75'
                          : 'bg-amber-950/40 border-2 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:scale-105 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-zinc-400">
                          #{chair.seat}
                        </span>
                        {isTaken ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                            <Lock className="w-2.5 h-2.5" />
                            Obsadené
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-300 font-bold animate-pulse">
                            <Flame className="w-2.5 h-2.5 fill-amber-400" />
                            VOĽNÉ
                          </span>
                        )}
                      </div>

                      <strong className={`block text-xs font-bold leading-tight ${isTaken ? 'text-zinc-400' : 'text-white'}`}>
                        {chair.name}
                      </strong>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {chair.city}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* CARD 4: Price & Fast Direct Reservation */}
            <div className="p-6 sm:p-9 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5 ring-1 ring-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-850">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block font-semibold">
                    Plná účasť s praxou (All-Inclusive)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {formatPrice(seminar.tiers[0]?.priceEUR || 380)}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      (alebo záloha 100 €)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garancia vrátenia platby pri nespokojnosti</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenBooking(seminar, seminar.tiers[0].id)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Bojovať o posledné voľné miesto (Rezervovať)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenWaitlist}
                  className="py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIP Waitlist</span>
                </button>
              </div>

              <div className="pt-2 text-center sm:text-left text-[11px] text-zinc-500">
                <span>Okamžité vystavenie dokladu a potvrdenia s unikátnym QR kódom • Platba Apple Pay, Google Pay alebo kartou</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
