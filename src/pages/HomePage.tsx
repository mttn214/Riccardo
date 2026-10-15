import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SEMINARS_DATA, PORTFOLIO_DATA, STYLIST_PROFILE, TESTIMONIALS_DATA, TESTIMONIALS_STATS, PortfolioItem } from '../data/content';
import { formatPrice } from '../utils/currency';
import { ArrowUpRight, Check, Trophy, MoveHorizontal, Star, CheckCircle2, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '../components/SocialIcons';
import { WaitlistModal } from '../components/WaitlistModal';
import { FeaturedCourseStickyShowcase } from '../components/FeaturedCourseStickyShowcase';

interface HomePageProps {
  onOpenBooking: () => void;
  onSelectPortfolioItem: (item: PortfolioItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking, onSelectPortfolioItem }) => {
  const featuredSeminar = SEMINARS_DATA[0];
  const featuredPortfolio = PORTFOLIO_DATA.slice(0, 4);

  // Review Slider State & Drag
  const reviewsSliderRef = useRef<HTMLDivElement>(null);
  const [isReviewMouseDown, setIsReviewMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const checkReviewScroll = () => {
    if (!reviewsSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = reviewsSliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = reviewsSliderRef.current;
    if (!el) return;
    checkReviewScroll();
    el.addEventListener('scroll', checkReviewScroll, { passive: true });
    window.addEventListener('resize', checkReviewScroll);
    return () => {
      el.removeEventListener('scroll', checkReviewScroll);
      window.removeEventListener('resize', checkReviewScroll);
    };
  }, []);

  const slideReviews = (direction: 'left' | 'right') => {
    if (!reviewsSliderRef.current) return;
    const scrollAmount = reviewsSliderRef.current.clientWidth > 640 ? 420 : 310;
    reviewsSliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const onReviewMouseDown = (e: React.MouseEvent) => {
    if (!reviewsSliderRef.current) return;
    setIsReviewMouseDown(true);
    setStartX(e.pageX - reviewsSliderRef.current.offsetLeft);
    setScrollLeftState(reviewsSliderRef.current.scrollLeft);
  };

  const onReviewMouseMove = (e: React.MouseEvent) => {
    if (!isReviewMouseDown || !reviewsSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - reviewsSliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    reviewsSliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const onReviewMouseUpOrLeave = () => {
    setIsReviewMouseDown(false);
  };

  return (
    <div>
      {/* Editorial Hero */}
      <Hero
        onExploreSeminars={() => {
          const el = document.getElementById('featured-drop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onExplorePortfolio={() => {}}
      />

      {/* Featured Masterclass Apple Sticky Showcase (Woman Locks, Content Scrolls) */}
      {featuredSeminar && (
        <FeaturedCourseStickyShowcase
          seminar={featuredSeminar}
          onOpenBooking={() => onOpenBooking()}
          onOpenWaitlist={() => setIsWaitlistOpen(true)}
        />
      )}

      {/* SECTION: Lookbook Preview */}
      <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Portfólio účesov
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                Čisté remeslo v pohybe.
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white font-medium transition-colors"
            >
              <span>Otvoriť celé portfólio</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPortfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPortfolioItem(item)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 group-hover:border-zinc-700 transition-all mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-[0.92]"
                  />
                  {item.hasBeforeAfter && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/10">
                        Pred / Po
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-zinc-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs text-zinc-500 block mt-0.5">
                    {item.category} • {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Awards Highlight */}
      <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-zinc-950 border border-zinc-850 overflow-hidden shadow-2xl">
            <div className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
                <div className="max-w-2xl">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-2">
                    17. ročník Czech & Slovak Hairdressing Awards • Praha
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight mb-3">
                    Víťaz: Cena verejnosti SR
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal mb-6">
                    V pražskom Foru Karlín si Richard Čonka prevzal sošku víťaza celonárodného hlasovania verejnosti na najprestížnejšej kaderníckej súťaži v Česku a na Slovensku za svoju 4-dielnu autorskú kolekciu.
                  </p>
                  <Link
                    to="/ocenenia"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white hover:text-zinc-300 font-medium transition-colors"
                  >
                    <span>Prezrieť kompletnú víťaznú kolekciu</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex-shrink-0 text-left lg:text-right">
                  <span className="text-5xl sm:text-7xl font-bold tracking-tight text-white block">
                    2023
                  </span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block mt-1">
                    Forum Karlín, Praha
                  </span>
                </div>
              </div>

              {/* Real Photo Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-zinc-850">
                {[
                  { img: '/images/riccardo/richard_conka_hda_1.jpg', label: 'Žitná Symfónia • Look 1' },
                  { img: '/images/riccardo/richard_conka_hda_2.jpg', label: 'Avant-Garde • Look 2' },
                  { img: '/images/riccardo/richard_conka_hda_3.jpg', label: 'Dark Elegance • Look 3' },
                  { img: '/images/riccardo/richard_conka_hda_4.jpg', label: 'Pocta Tradícii • Look 4' },
                ].map((item, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-white truncate pr-2">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Verified Client Reviews Spotlight */}
      <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Overené hodnotenia Google Maps & Facebook (Hodnotenie 5.0)</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                Dôvera klientov v číslach.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Potiahnite do strany alebo použite šípky na prehliadanie recenzií.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/referencie"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white font-medium transition-colors mr-2"
              >
                <span>Všetkých {TESTIMONIALS_STATS.totalReviews} recenzií</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              
              {/* Slider Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => slideReviews('left')}
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
                  onClick={() => slideReviews('right')}
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
            </div>
          </div>

          {/* Horizontal Slider Track */}
          <div
            ref={reviewsSliderRef}
            onMouseDown={onReviewMouseDown}
            onMouseMove={onReviewMouseMove}
            onMouseUp={onReviewMouseUpOrLeave}
            onMouseLeave={onReviewMouseUpOrLeave}
            className={`flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 select-none scrollbar-none snap-x snap-mandatory ${
              isReviewMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {TESTIMONIALS_DATA.map((rev) => (
              <div
                key={rev.id}
                className="w-[300px] sm:w-[380px] md:w-[410px] flex-shrink-0 snap-start p-7 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between hover:border-zinc-700/80 transition-all hover:shadow-2xl"
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
                      <span className="text-[11px] font-medium text-zinc-400">
                        {rev.sourceLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.service && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium mb-3">
                      {rev.service}
                    </span>
                  )}

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-6">
                    „{rev.quote}“
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div>
                    <strong className="text-xs sm:text-sm text-white font-medium block">
                      {rev.name}
                    </strong>
                    <span className="text-[11px] text-zinc-500 block">
                      {rev.city || 'Lučenec'} • Overený klient
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {rev.relativeTime}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile footer link */}
          <div className="mt-4 sm:hidden text-center">
            <Link
              to="/referencie"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium"
            >
              <span>Zobraziť všetkých {TESTIMONIALS_STATS.totalReviews} recenzií</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: Atelier Lučenec Callout */}
      <section className="py-24 bg-black border-t border-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Atelier Lučenec
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
                J. Kármána 1727/30, 984 01 Lučenec
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Príjemné, komorné prostredie pre klientov i účastníkov vzdelávacích kurzov. Bezplatné parkovanie pred salónom.
              </p>
            </div>
            <Link
              to="/salon"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white transition-all whitespace-nowrap shadow-sm"
            >
              <span>Viac o salóne & Navigácia</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
};
