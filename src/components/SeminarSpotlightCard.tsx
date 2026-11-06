import { ArrowUpRight, Bell } from 'lucide-react';
import { Seminar } from '../data/content';
import { formatPrice } from '../utils/currency';
import { GlassHeadlineLine } from './GlassHeadlineLine';
import { SeminarSpotlightPhoto, hasSpotlightCutout } from './SeminarSpotlightPhoto';

interface SeminarSpotlightCardProps {
  seminar: Seminar;
  onOpenDetail: (seminar: Seminar) => void;
  onBook: (seminar: Seminar) => void;
  onWaitlist: () => void;
}

export function SeminarSpotlightCard({ seminar, onOpenDetail, onBook, onWaitlist }: SeminarSpotlightCardProps) {
  return (
    <div className={`relative rounded-3xl overflow-hidden ${hasSpotlightCutout(seminar.image) ? "seminar-spotlight-cutout" : "bg-zinc-950 border border-zinc-800/80 shadow-2xl"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 relative">
          <SeminarSpotlightPhoto
            primaryImage={seminar.image}
            secondaryImage={seminar.secondaryImage}
            title={seminar.title}
            availableSeats={seminar.availableSeats}
            totalSeats={seminar.totalSeats}
          />
        </div>

        <div className="lg:col-span-7 p-8 sm:p-12 lg:pt-[4.5rem] lg:pb-2 flex flex-col justify-between space-y-6 lg:space-y-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-2">
              <span className="text-zinc-300">{seminar.dates}</span>
              <span>•</span>
              <span>{seminar.city} (Atelier)</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-3">
              <GlassHeadlineLine>{seminar.title}</GlassHeadlineLine>
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
              {seminar.description}
            </p>

            <div className="space-y-2 py-4 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Skupina najviac {seminar.totalSeats} účastníkov</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Praktický tréning na modelkách a cvičných hlavách</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>{seminar.includedItems?.[0] ?? "Podrobnosti v informáciách o kurze"}</span>
              </div>
            </div>
          </div>

          <div className="py-4 border-t border-zinc-850/60 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:justify-between">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 block font-medium">
                Cena kurzu
              </span>
              <div className="flex items-baseline gap-2 mt-0.5 sm:mt-0">
                <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
                  {seminar.tiers[0] ? formatPrice(seminar.tiers[0].priceEUR) : "Na vyžiadanie"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center sm:ml-auto sm:justify-end">
              <button
                type="button"
                onClick={() => onOpenDetail(seminar)}
                className="glass-action px-4 py-2.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
              >
                Viac informácií
              </button>

              {seminar.availableSeats > 0 && seminar.tiers.length > 0 ? (
                <button
                  onClick={() => onBook(seminar)}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10 cursor-pointer whitespace-nowrap"
                >
                  <span>Rezervovať miesto</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onWaitlist()}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Zapísať sa na Waitlist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
