import React from 'react';

interface SeatsBadgeProps {
  availableSeats: number;
  totalSeats: number;
  className?: string;
}

const seatsWord = (n: number) => (n === 1 ? 'miesto' : n >= 2 && n <= 4 ? 'miesta' : 'miest');

export const SeatsBadge: React.FC<SeatsBadgeProps> = ({ availableSeats, totalSeats, className = '' }) => {
  const occupiedPct = totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0;
  const soldOut = availableSeats <= 0;
  const urgent = !soldOut && availableSeats <= 2;
  const hot = !soldOut && occupiedPct >= 80;

  const label = soldOut
    ? 'Termín vypredaný'
    : urgent
      ? `Zostávajú posledné ${availableSeats} ${seatsWord(availableSeats)} z ${totalSeats}`
      : `Voľné ${availableSeats} ${seatsWord(availableSeats)} z ${totalSeats}`;

  const tone = soldOut
    ? 'bg-zinc-800 text-zinc-400'
    : urgent
      ? 'bg-red-500/15 text-red-400'
      : 'bg-amber-500/15 text-amber-400';

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${tone}`}>
        {!soldOut && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${urgent ? 'bg-red-400' : 'bg-amber-400'}`} />}
        {label}
      </span>
      {hot && (
        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-zinc-200">
          Termín vypredaný na {occupiedPct} %
        </span>
      )}
    </span>
  );
};
