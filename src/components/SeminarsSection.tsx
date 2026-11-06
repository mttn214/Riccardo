import React, { useState } from 'react';
import { SEMINARS_DATA, Seminar } from '../data/content';
import { adminStore } from '../services/adminStore';
import { ArrowUpRight, Check, Users, Clock, MapPin, Sparkles } from 'lucide-react';
import { sendFormNotification } from '../services/formService';
import { SeminarSpotlightCard } from './SeminarSpotlightCard';
import { SeatsBadge } from './SeatsBadge';

interface SeminarsSectionProps {
  onOpenWaitlist: () => void;
  onOpenDetail: (seminar: Seminar) => void;
  onBookSeminar: (seminar: Seminar) => void;
}

export const SeminarsSection: React.FC<SeminarsSectionProps> = ({
  onOpenWaitlist,
  onOpenDetail,
  onBookSeminar,
}) => {
  const [priorityEmail, setPriorityEmail] = useState('');
  const [prioritySubscribed, setPrioritySubscribed] = useState(false);

  // The primary imminent masterclasses with spotlight interactive photos
  const seminars = adminStore.getSeminars();
  const featuredIds = SEMINARS_DATA.slice(0, 2).map(({ id }) => id);
  const featuredSeminars = seminars.filter(({ id }) => featuredIds.includes(id));
  // Next exclusive dates in 2027
  const upcomingSeminars = seminars.filter(({ id }) => !featuredIds.includes(id));

  const handlePrioritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priorityEmail) {
      await sendFormNotification({
        formType: 'VIP Waitlist',
        name: 'Kaderník / Salónny záujemca',
        email: priorityEmail,
        'Zdroj': 'Prednostný prístup (Sekcia seminárov)'
      });
      setPrioritySubscribed(true);
      setTimeout(() => {
        setPriorityEmail('');
        setPrioritySubscribed(false);
      }, 5000);
    }
  };

  return (
    <section id="seminare" className="py-24 sm:py-36 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
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

        {/* FEATURED IMMINENT MASTERCLASSES (Editorial Spotlight Cards) */}
        <div className="space-y-12 mb-16">
          {featuredSeminars.map((seminar) => (
            <SeminarSpotlightCard key={seminar.id} seminar={seminar} onOpenDetail={onOpenDetail} onBook={onBookSeminar} onWaitlist={onOpenWaitlist} />
          ))}
        </div>

        {/* UPCOMING DATES SCHEDULE (Quiet Minimalist List) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2">
            <h4 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">
              Harmonogram nasledujúcich turnusov (2027)
            </h4>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Vždy max 6 miest
            </span>
          </div>

          <div className="space-y-3">
            {upcomingSeminars.map((seminar) => (
              <div
                key={seminar.id}
                className="p-5 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-colors"
              >
                {/* Date & Location */}
                <div className="md:w-1/4">
                  <span className="text-xs text-zinc-400 block mb-0.5">
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
                  <SeatsBadge availableSeats={seminar.availableSeats} totalSeats={seminar.totalSeats} />

                  <button
                    onClick={() => onBookSeminar(seminar)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-800 hover:bg-white hover:text-black text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Rezervovať (Záloha 100 €)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCARCITY WAITLIST / PRIORITY DROP ALERTS */}
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 shadow-xl">
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
