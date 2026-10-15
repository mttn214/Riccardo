import React from 'react';
import { Seminar } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import { X, ArrowUpRight } from 'lucide-react';

interface SeminarDetailModalProps {
  seminar: Seminar | null;
  currency: Currency;
  onClose: () => void;
  onSelectTier: (seminar: Seminar, tierId: string) => void;
}

export const SeminarDetailModal: React.FC<SeminarDetailModalProps> = ({
  seminar,
  currency,
  onClose,
  onSelectTier,
}) => {
  if (!seminar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn text-white">
      <div
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative aspect-[16/8] sm:aspect-[21/8] w-full bg-zinc-900 overflow-hidden flex-shrink-0">
          <img
            src={seminar.image}
            alt={seminar.title}
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            aria-label="Zavrieť"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
              {seminar.city} • {seminar.dates}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {seminar.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-grow">
          {/* Overview */}
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium block mb-1.5">
              Cieľ seminára
            </span>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {seminar.description}
            </p>
          </div>

          {/* Schedule */}
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium block mb-3">
              Program & Harmonogram
            </span>
            <div className="space-y-3">
              {seminar.schedule.map((dayItem, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    {dayItem.day}
                  </h4>
                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <p><strong className="text-zinc-200">Dopoludnia:</strong> {dayItem.morning}</p>
                    <p><strong className="text-zinc-200">Popoludní:</strong> {dayItem.afternoon}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Kit */}
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium block mb-2">
              V cene seminára
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {seminar.includedItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tiers */}
          <div className="pt-4 border-t border-zinc-900">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium block mb-4">
              Zvoľte variant účasti
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seminar.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-5 rounded-2xl border border-zinc-700 bg-zinc-900 flex flex-col justify-between transition-all"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {tier.name}
                    </h4>
                    <span className="text-2xl font-semibold text-white block mb-3">
                      {formatPrice(tier.priceEUR, currency)}
                    </span>
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTier(seminar, tier.id)}
                    className={`w-full py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                      tier.recommended
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    <span>Zvoliť</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
          <span>{seminar.venue}, {seminar.city}</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Zatvoriť
          </button>
        </div>
      </div>
    </div>
  );
};
