import React, { useState } from 'react';
import { SEMINARS_DATA, Seminar } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import { ArrowUpRight, Check, Users, Clock, MapPin, Sparkles } from 'lucide-react';

interface SeminarsSectionProps {
  currency: Currency;
  onOpenDetail: (seminar: Seminar) => void;
  onBookSeminar: (seminar: Seminar) => void;
}

export const SeminarsSection: React.FC<SeminarsSectionProps> = ({
  currency,
  onOpenDetail,
  onBookSeminar,
}) => {
  const [priorityEmail, setPriorityEmail] = useState('');
  const [prioritySubscribed, setPrioritySubscribed] = useState(false);

  // The primary imminent masterclass is the first one
  const featuredSeminar = SEMINARS_DATA[0];
  // Next exclusive dates
  const upcomingSeminars = SEMINARS_DATA.slice(1);

  const handlePrioritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (priorityEmail) {
      setPrioritySubscribed(true);
      setTimeout(() => {
        setPriorityEmail('');
        setPrioritySubscribed(false);
      }, 5000);
    }
  };

  return (
    <section id="seminare" className="py-24 sm:py-36 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header: Rarity & Exclusivity */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] uppercase tracking-widest text-zinc-400 font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Iba 1× za 1–2 mesiace • Max 6 účastníkov</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] leading-[1.05] mb-4">
            Komorné masterclassy.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Žiadne masové prednáškové sály. Každý termín je prísne limitovaný na <strong className="text-white font-medium">maximálne 6 kaderníkov</strong> priamo v ateliéri v Lučenci, čo garantuje osobný dohľad Richarda Čonku pri každom ťahu nožníc či kief.
          </p>
        </div>

        {/* FEATURED IMMINENT MASTERCLASS (Editorial Spotlight Card) */}
        {featuredSeminar && (
          <div className="mb-16 rounded-3xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Photo Side (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-zinc-900 overflow-hidden">
                <img
                  src={featuredSeminar.image}
                  alt={featuredSeminar.title}
                  className="w-full h-full object-cover object-top filter brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:hidden" />
                
                {/* Live urgency chip */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Zostávajú posledné {featuredSeminar.availableSeats} miesta
                  </span>
                </div>
              </div>

              {/* Details Side (7 cols) */}
              <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-medium mb-2">
                    <span className="text-zinc-300">{featuredSeminar.dates}</span>
                    <span>•</span>
                    <span>{featuredSeminar.city} (Atelier)</span>
                    <span>•</span>
                    <span>{featuredSeminar.duration}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-3">
                    {featuredSeminar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                    {featuredSeminar.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2 py-4 border-y border-zinc-850 text-xs sm:text-sm text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                      <span><strong>Prísna kapacita:</strong> Iba 6 kaderníkov pre 100% individuálny prístup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                      <span><strong>Prax na modelkách:</strong> Osobné nastavenie napínania a uhlov od Richarda</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                      <span><strong>V cene:</strong> Originálna termálna kefa Riccardo, manuál a certifikát</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action row */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-medium">
                      Plná účasť s praxou (All-Inclusive)
                    </span>
                    <span className="text-2xl sm:text-3xl font-semibold text-white">
                      {formatPrice(featuredSeminar.tiers[0]?.priceEUR || 380, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => onOpenDetail(featuredSeminar)}
                      className="px-4 py-2.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                      Harmonogram
                    </button>

                    <button
                      onClick={() => onBookSeminar(featuredSeminar)}
                      className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10"
                    >
                      <span>Rezervovať miesto</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* UPCOMING DATES SCHEDULE (Quiet Minimalist List) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-850">
            <h4 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">
              Harmonogram nasledujúcich turnusov (2027)
            </h4>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Vždy max 6 miest
            </span>
          </div>

          <div className="divide-y divide-zinc-850 border-b border-zinc-850">
            {upcomingSeminars.map((seminar) => (
              <div
                key={seminar.id}
                className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Date & Location */}
                <div className="md:w-1/4">
                  <span className="text-xs font-mono text-zinc-400 block mb-0.5">
                    {seminar.dates}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {seminar.city} • Atelier
                  </span>
                </div>

                {/* Title & Scope */}
                <div className="md:w-2/4">
                  <h5 className="text-base font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {seminar.title}
                  </h5>
                  <span className="text-xs text-zinc-500 block mt-0.5">
                    {seminar.duration} • Limitované na 6 miest
                  </span>
                </div>

                {/* Status & CTA */}
                <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-3">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {seminar.availableSeats <= 1 ? 'Posledné 1 miesto' : `Zostávajú ${seminar.availableSeats} miesta`}
                  </span>

                  <button
                    onClick={() => onBookSeminar(seminar)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-850 hover:bg-white hover:text-black text-white transition-all active:scale-95 border border-zinc-750"
                  >
                    <span>Rezervovať</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCARCITY WAITLIST / PRIORITY DROP ALERTS */}
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-850">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium block mb-1">
                Prednostný prístup
              </span>
              <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-1">
                Nestihli ste voľné miesto?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Nové termíny zverejňujeme iba raz za 1–2 mesiace a spravidla sa obsadia v priebehu hodín. Zanechajte svoj email a pošleme vám nový termín 24 hodín pred verejným zverejnením.
              </p>
            </div>

            {prioritySubscribed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zaradené do prednostného zoznamu.</span>
              </div>
            ) : (
              <form onSubmit={handlePrioritySubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  placeholder="Váš kadernícky email"
                  value={priorityEmail}
                  onChange={(e) => setPriorityEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-full text-xs focus:outline-none focus:border-zinc-500 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all whitespace-nowrap active:scale-95 shadow-sm"
                >
                  Čakacia listina
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
