import React, { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';

interface SeminarSpotlightPhotoProps {
  primaryImage: string;
  secondaryImage?: string;
  title: string;
  availableSeats: number;
  totalSeats: number;
}

export const SeminarSpotlightPhoto: React.FC<SeminarSpotlightPhotoProps> = ({
  primaryImage,
  secondaryImage,
  title,
  availableSeats,
  totalSeats,
}) => {
  const [activeTab, setActiveTab] = useState<'action' | 'atelier'>('action');
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate every 5 seconds when not hovered by user
  useEffect(() => {
    if (!secondaryImage) return;

    if (isHovered) {
      // When hovered, show the authentic atelier
      setActiveTab('atelier');
      return;
    } else {
      // When hover leaves, return to primary action photo
      setActiveTab('action');
    }

    timerRef.current = setInterval(() => {
      setActiveTab((prev) => (prev === 'action' ? 'atelier' : 'action'));
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, secondaryImage]);

  return (
    <div
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] bg-zinc-950 overflow-hidden group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Primary Action Image (Dynamika fúkanej) */}
      <img
        src={primaryImage}
        alt={`${title} - Technika fúkanej`}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
          activeTab === 'action' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
        }`}
      />

      {/* 2. Secondary Authentic Atelier Image (Lučenec akadémia) */}
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${title} - Ateliér a účastníci v Lučenci`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
            activeTab === 'atelier' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        />
      )}

      {/* Subtle vignette gradient for readable badges */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-20 pointer-events-none" />

      {/* Top Left: Urgency Seats Badge */}
      <div className="absolute top-4 left-4 z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-[11px] font-medium text-white shadow-xl border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Zostávajú posledné {availableSeats} miesta z {totalSeats}
        </span>
      </div>

      {/* Top Right: Current View Indicator Pill */}
      {secondaryImage && (
        <div className="absolute top-4 right-4 z-30">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono tracking-wider text-zinc-300 border border-white/10 shadow-lg">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>{activeTab === 'action' ? 'Technika fúkanej' : 'Ateliér Lučenec'}</span>
          </span>
        </div>
      )}

      {/* Bottom Floating Control Pills: Manual Switch & Hover Hint */}
      {secondaryImage && (
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between">
          <div className="inline-flex items-center p-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('action');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'action'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Technika v akcii
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('atelier');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'atelier'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ateliér Lučenec
            </button>
          </div>

          <span className="hidden sm:inline-block text-[10px] text-zinc-400 font-mono tracking-wide px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/5">
            Prejdite myšou pre náhľad
          </span>
        </div>
      )}
    </div>
  );
};
