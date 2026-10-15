import React, { useState } from 'react';
import { PortfolioItem } from '../data/content';
import { X, MoveHorizontal } from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          aria-label="Zavrieť"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Viewport: Before/After Slider or Full Photo */}
        <div className="relative w-full bg-black select-none overflow-hidden flex items-center justify-center">
          {item.hasBeforeAfter && item.beforeImage ? (
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] cursor-ew-resize overflow-hidden"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image */}
              <img
                src={item.image}
                alt={`${item.title} - Po premene`}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <span className="absolute top-4 right-14 px-3 py-1 text-[11px] font-medium bg-black/80 backdrop-blur-md text-white border border-white/10 rounded-full z-10">
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
                <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-medium bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 rounded-full z-10">
                  Pred
                </span>
              </div>

              {/* Minimal White Divider */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black shadow-xl flex items-center justify-center">
                  <MoveHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 pointer-events-none">
                Potiahnite pre porovnanie
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-zinc-950 flex items-center justify-center overflow-hidden">
              {/* Ambient atmospheric backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-top filter blur-3xl opacity-25 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/40 pointer-events-none z-10" />

              {/* Full photo with complete face and hairstyle */}
              <img
                src={item.image}
                alt={item.title}
                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5 font-medium">
              <span>{item.category}</span>
              <span>•</span>
              <span>{item.collection} ({item.year})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {item.title}
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {item.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium block mb-1">
                Technika & Postup
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {item.technique}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium block mb-1">
                Nástroje & Prípravky
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {item.toolsUsed}
              </p>
            </div>
          </div>

          {item.formula && (
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium block mb-1">
                Receptúra farbenia
              </span>
              <p className="text-xs font-mono text-zinc-200">
                {item.formula}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
          <span>Hair Salon Riccardo • Lučenec</span>
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
