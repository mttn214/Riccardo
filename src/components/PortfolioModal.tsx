import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../data/content';
import { X, MoveHorizontal } from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onBookSeminar?: (seminar?: any, tierId?: string) => void;
  onOpenWaitlist?: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  item,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleSliderMove(e.clientX, rect);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 bg-black/50 backdrop-blur-md animate-fadeIn cursor-zoom-out select-none"
      onClick={onClose}
    >
      {/* Floating Top Close Button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 sm:top-7 sm:right-7 z-50 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-xl cursor-pointer"
        aria-label="Zatvoriť zväčšenú fotografiu"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Enlarged Photo Container */}
      {item.hasBeforeAfter && item.beforeImage ? (
        <div
          className="relative max-w-4xl w-full aspect-[4/3] sm:aspect-[16/10] max-h-[88vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-white/15 cursor-ew-resize"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After Image */}
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <span className="absolute top-4 right-4 px-3 py-1 text-[11px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/15 rounded-full z-10 shadow-lg">
            Po premene
          </span>

          {/* Before Image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={item.beforeImage}
              alt={`${item.title} - Pred premenou`}
              className="absolute inset-0 w-full h-full object-cover object-top max-w-none"
              style={{ width: '100%', minWidth: '100%' }}
            />
            <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-medium bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 rounded-full z-10 shadow">
              Pôvodný stav
            </span>
          </div>

          {/* Slider Divider */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] text-zinc-200 pointer-events-none shadow-xl flex items-center gap-1.5 font-medium">
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>Potiahnite pre porovnanie</span>
          </div>
        </div>
      ) : (
        <div
          className="relative max-h-[90vh] max-w-[92vw] flex items-center justify-center cursor-zoom-out"
          onClick={onClose}
        >
          {/* Full High-Resolution Photo */}
          <img
            src={item.image}
            alt={item.title}
            className="relative z-10 max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-white/15 transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>
      )}
    </div>
  );
};
