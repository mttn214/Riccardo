import React from 'react';
import { PAST_SOLD_OUT_SEMINARS } from '../data/content';
import { Clock, Users, MapPin, CheckCircle, Bell } from 'lucide-react';

interface PastSeminarsSectionProps {
  onOpenWaitlist: () => void;
}

export const PastSeminarsSection: React.FC<PastSeminarsSectionProps> = ({ onOpenWaitlist }) => {
  return (
    <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading & Scarcity Callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-2">
              História Dropov • 100% Vypredanosť
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-3">
              Bitka o každé jedno miesto.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
              Pozrite si archív uplynulých masterclassov v Lučenci. Každý turnus bol vypredaný v priebehu niekoľkých hodín od otvorenia predpredaja.
            </p>
          </div>

          <button
            onClick={onOpenWaitlist}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all whitespace-nowrap shadow-xl"
          >
            <Bell className="w-4 h-4 text-black" />
            <span>Zapísať sa na VIP Waitlist</span>
          </button>
        </div>

        {/* 3 Past Sold-Out Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAST_SOLD_OUT_SEMINARS.map((seminar) => (
            <div
              key={seminar.id}
              className="rounded-3xl bg-zinc-950 border border-zinc-850 overflow-hidden flex flex-col justify-between hover:border-zinc-700/80 transition-all shadow-xl group"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                  <img
                    src={seminar.image}
                    alt={seminar.title}
                    className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  {/* Sold-out Stamp Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider text-red-200 backdrop-blur-md shadow-lg">
                      <Clock className="w-3 h-3 text-red-400" />
                      <span>{seminar.soldOutTime}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-mono text-zinc-400">{seminar.date}</span>
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-zinc-800 text-[11px] text-emerald-400 font-medium">
                      Obsadené 6 / 6
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-2">
                    {seminar.title}
                  </h3>

                  <div className="space-y-2 mt-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span>Účastníci pricestovali z:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {seminar.attendeesFrom.map((city, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-medium"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 border-t border-zinc-900/60 mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>100% spokojnosť</span>
                </span>
                <span className="font-mono text-zinc-400">{seminar.rating}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
