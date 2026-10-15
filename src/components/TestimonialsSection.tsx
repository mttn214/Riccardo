import React, { useState, useRef, useEffect } from 'react';
import { TESTIMONIALS_DATA, TESTIMONIALS_STATS, STYLIST_PROFILE } from '../data/content';
import { GoogleIcon, FacebookIcon } from './SocialIcons';
import { Star, CheckCircle2, ArrowUpRight, ShieldCheck, ChevronLeft, ChevronRight, LayoutGrid, Sliders } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [filterSource, setFilterSource] = useState<'Všetky' | 'Google' | 'Facebook'>('Všetky');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  
  // Slider ref & drag states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filteredReviews = TESTIMONIALS_DATA.filter((item) => {
    if (filterSource === 'Všetky') return true;
    return item.source === filterSource;
  });

  const checkScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [filteredReviews, viewMode]);

  // Reset scroll on filter change
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filterSource]);

  const slide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth > 640 ? 440 : 320;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse Drag to Slide
  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-zinc-800 text-zinc-200 border-zinc-700',
      'bg-stone-850 text-stone-200 border-stone-700',
      'bg-neutral-850 text-neutral-200 border-neutral-700',
      'bg-zinc-900 text-white border-zinc-700',
    ];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <section id="referencie" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Nezávislé & Overené hodnotenia</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Čo hovoria reálni klienti.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Transparentné skúsenosti z verejných profilov Hair Salon Riccardo na Google Maps a Facebooku. Potiahnite do strany alebo použite šípky na prehliadanie.
          </p>
        </div>

        {/* Minimalist Verified Score Banner (Apple / Google style) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-850 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Score & Stars (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
                  {TESTIMONIALS_STATS.averageRating}
                </span>
                <span className="text-zinc-500 text-lg font-medium">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-zinc-400">
                Na základe <strong>{TESTIMONIALS_STATS.totalReviews} overených recenzií</strong>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100 % pozitívnych odporúčaní</span>
              </div>
            </div>

            {/* Distribution Bars (4 cols) */}
            <div className="lg:col-span-4 space-y-1.5 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-zinc-850 lg:px-8">
              {TESTIMONIALS_STATS.distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-6 text-right font-mono text-zinc-400 flex items-center justify-end gap-0.5">
                    {d.stars}
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-zinc-500 text-[11px]">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct External Links (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Overiť na oficiálnych profiloch
              </span>
              
              <a
                href={STYLIST_PROFILE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <GoogleIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <strong className="block font-medium">Google Maps Recenzie</strong>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      44+ recenzií • 5.0 <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href={STYLIST_PROFILE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <FacebookIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <strong className="block font-medium">Facebook Odporúčania</strong>
                    <span className="text-[11px] text-zinc-400">18+ odporúčaní • 100 %</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>

          </div>
        </div>

        {/* Toolbar: Filters + View Mode Switcher + Slider Arrows */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-zinc-850">
          
          {/* Source Filter Pills */}
          <div className="flex items-center gap-2">
            {(['Všetky', 'Google', 'Facebook'] as const).map((source) => {
              const count = source === 'Všetky'
                ? TESTIMONIALS_DATA.length
                : TESTIMONIALS_DATA.filter((i) => i.source === source).length;

              return (
                <button
                  key={source}
                  onClick={() => setFilterSource(source)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
                    filterSource === source
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <span>{source === 'Všetky' ? 'Všetky' : source}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterSource === source ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: View Switcher + Slider Arrows */}
          <div className="flex items-center gap-3">
            
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-full bg-zinc-900 border border-zinc-800 p-0.5">
              <button
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  viewMode === 'slider' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Posuvník (Slider)"
              >
                <Sliders className="w-3 h-3" />
                <span>Posuvník</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Mriežka (Grid)"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Mriežka</span>
              </button>
            </div>

            {/* Slider Navigation Arrows (Active in slider mode) */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => slide('left')}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? 'bg-zinc-900 hover:bg-white hover:text-black border-zinc-750 text-white shadow-md active:scale-95'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600 cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Posunúť doľava"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => slide('right')}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? 'bg-zinc-900 hover:bg-white hover:text-black border-zinc-750 text-white shadow-md active:scale-95'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600 cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Posunúť doprava"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* VIEW 1: HORIZONTAL SIDE-TO-SIDE SLIDER (Apple Style) */}
        {viewMode === 'slider' ? (
          <div>
            <div
              ref={sliderRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
              className={`flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 select-none scrollbar-none snap-x snap-mandatory ${
                isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="w-[300px] sm:w-[380px] md:w-[410px] flex-shrink-0 snap-start p-7 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between hover:border-zinc-700/90 transition-all hover:shadow-2xl"
                >
                  <div>
                    {/* Header: Platform & Time */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                          {rev.source === 'Google' ? (
                            <GoogleIcon className="w-3 h-3 text-white" />
                          ) : (
                            <FacebookIcon className="w-3 h-3 text-white" />
                          )}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-400 tracking-tight">
                          {rev.sourceLabel}
                        </span>
                      </div>

                      <span className="text-[10px] text-zinc-500 font-mono">
                        {rev.relativeTime}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Service Tag */}
                    {rev.service && (
                      <div className="mb-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-medium truncate max-w-full">
                          {rev.service}
                        </span>
                      </div>
                    )}

                    {/* Quote Text */}
                    <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-8">
                      „{rev.quote}“
                    </p>
                  </div>

                  {/* Author footer */}
                  <div className="pt-5 border-t border-zinc-900 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border ${getAvatarBg(rev.name)} flex-shrink-0`}>
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      </h4>
                      <span className="text-[11px] text-zinc-500 block">
                        {rev.city || 'Lučenec'} • Overený klient
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Scroll Progress Bar & Helper Prompt */}
            <div className="flex items-center justify-between gap-4 pt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                <span>Posúvajte potiahnutím myšou, dotykom prsta alebo šípkami</span>
              </span>

              {/* Minimal Progress Track */}
              <div className="w-24 sm:w-36 h-1 rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className="h-full bg-zinc-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(15, scrollProgress)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: FULL GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-7 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between hover:border-zinc-700/80 transition-all hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                        {rev.source === 'Google' ? (
                          <GoogleIcon className="w-3 h-3 text-white" />
                        ) : (
                          <FacebookIcon className="w-3 h-3 text-white" />
                        )}
                      </span>
                      <span className="text-[11px] font-medium text-zinc-400 tracking-tight">
                        {rev.sourceLabel}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono">
                      {rev.relativeTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {rev.service && (
                    <div className="mb-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-medium">
                        {rev.service}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-8">
                    „{rev.quote}“
                  </p>
                </div>

                <div className="pt-5 border-t border-zinc-900 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border ${getAvatarBg(rev.name)} flex-shrink-0`}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    </h4>
                    <span className="text-[11px] text-zinc-500 block">
                      {rev.city || 'Lučenec'} • Overený klient
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges Footer */}
        <div className="mt-16 pt-10 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="w-5 h-5 text-white flex-shrink-0" />
            <span>100% transparentný zber recenzií cez Google Maps a Facebook</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
            <span>Najlepšie hodnotený salón v regióne Lučenca a Novohradu</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Držiteľ ocenenia Zlatá Firma za kvalitu služieb</span>
          </div>
        </div>

      </div>
    </section>
  );
};
