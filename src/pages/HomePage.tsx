import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SEMINARS_DATA, PORTFOLIO_DATA, STYLIST_PROFILE, TESTIMONIALS_DATA, TESTIMONIALS_STATS, PortfolioItem } from '../data/content';
import { formatPrice } from '../utils/currency';
import { ArrowUpRight, Check, Trophy, MoveHorizontal, Star, CheckCircle2, ChevronLeft, ChevronRight, Bell, MapPin, Building2 } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '../components/SocialIcons';
import { WaitlistModal } from '../components/WaitlistModal';
import { SeminarSpotlightPhoto } from '../components/SeminarSpotlightPhoto';

interface HomePageProps {
  onOpenBooking: (seminar?: Seminar) => void;
  onSelectPortfolioItem: (item: PortfolioItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking, onSelectPortfolioItem }) => {
  const navigate = useNavigate();
  const [activeTurnusIndex, setActiveTurnusIndex] = useState(0);
  const featuredSeminar = SEMINARS_DATA[activeTurnusIndex] || SEMINARS_DATA[0];
  const tickerPortfolio = PORTFOLIO_DATA.slice(0, 10);
  const marqueePortfolio = [...tickerPortfolio, ...tickerPortfolio];

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
        onExplorePortfolio={() => navigate('/tvorba')}
      />

      {/* SECTION: The Upcoming Exclusive Masterclass Drop */}
      <section id="featured-drop" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Najbližší autorský masterclass
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                Vzácnosť. Nie masovosť.
              </h2>
            </div>
            <Link
              to="/seminare"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white font-medium transition-colors"
            >
              <span>Všetky termíny a harmonogram</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Turnus Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTurnusIndex(0)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTurnusIndex === 0
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Turnus I: Architektúra objemu (16. – 17. Nov 2026)
            </button>
            <button
              onClick={() => setActiveTurnusIndex(1)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTurnusIndex === 1
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Turnus II: Biker Glamour & Kučery (17. – 18. Máj 2027)
            </button>
          </div>

          {/* Spotlight Card */}
          {featuredSeminar && (
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 relative">
                  <SeminarSpotlightPhoto
                    primaryImage={featuredSeminar.image}
                    secondaryImage={featuredSeminar.secondaryImage}
                    title={featuredSeminar.title}
                    availableSeats={featuredSeminar.availableSeats}
                    totalSeats={featuredSeminar.totalSeats}
                  />
                </div>

                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-2">
                      <span className="text-zinc-300">{featuredSeminar.dates}</span>
                      <span>•</span>
                      <span>{featuredSeminar.city} (Atelier)</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-3">
                      {featuredSeminar.title}
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                      {featuredSeminar.description}
                    </p>

                    <div className="space-y-2 py-4 text-xs sm:text-sm text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span>Prísna kapacita 6 kaderníkov pre garanciu osobnej spätnej väzby</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span>Hands-on prax na reálnych modelkách a cvičných hlavách</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span>Termokefa Riccardo, pracovné skriptá a certifikát v cene</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span>Záloha iba 100 € (doplatok 280 € na mieste) alebo plná úhrada online</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-850/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-500 block font-medium">
                        Cena kurzu
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
                          {formatPrice(featuredSeminar.tiers[0]?.priceEUR || 380)}
                        </span>
                        <span className="text-xs text-zinc-400 font-normal whitespace-nowrap">
                          (záloha 100 €)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        to="/seminare"
                        className="px-4 py-2.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Viac informácií
                      </Link>

                      {featuredSeminar.availableSeats > 0 ? (
                        <button
                          onClick={() => onOpenBooking(featuredSeminar)}
                          className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10 cursor-pointer whitespace-nowrap"
                        >
                          <span>Rezervovať miesto</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsWaitlistOpen(true)}
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
          )}
        </div>
      </section>

      {/* SECTION: Lookbook / Tvorba Moving Gallery */}
      <section className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Tvorba účesov
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                Čisté remeslo v pohybe.
              </h2>
            </div>
            <Link
              to="/tvorba"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white font-medium transition-colors"
            >
              <span>Otvoriť celú tvorbu</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Continuous Infinite Moving Ticker (from one side to the other) */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Subtle Left & Right edge blur masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

          {/* Marquee Track */}
          <div className="animate-hair-ticker flex items-stretch gap-6 px-4 select-none">
            {marqueePortfolio.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectPortfolioItem(item)}
                className="w-[260px] sm:w-[310px] shrink-0 group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 group-hover:border-zinc-700 transition-all mb-3 shadow-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {item.hasBeforeAfter && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-white border border-white/10">
                        Pred / Po
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 border-t border-zinc-900 pt-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Prejdite myšou pre pozastavenie pohybu a kliknite na detail účesu</span>
            </span>
            <Link
              to="/tvorba"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Všetky práce v ateliéri ({PORTFOLIO_DATA.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: Awards Highlight */}
      <section className="py-24 sm:py-32 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-zinc-950 overflow-hidden shadow-2xl">
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

              {/* Gala Ceremony Photo Gallery (Distinct from portfolio above) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  {
                    img: '/images/riccardo/hda_winners_group_hires.jpg',
                    title: 'Pódium víťazov CSHA',
                    subtitle: 'Richard Čonka s víťaznou soškou kaderníckych Oskarov'
                  },
                  {
                    img: '/images/riccardo/gallery/riccardo_art_12.jpg',
                    title: 'Červený koberec & Galavečer',
                    subtitle: 'Richard Čonka a prehliadkový tím s modelkami'
                  },
                  {
                    img: '/images/riccardo/gallery/riccardo_art_34.jpg',
                    title: 'Finále módnej galashow',
                    subtitle: 'Couture róby a autorský styling na javisku'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                      <span className="text-xs font-semibold text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 block truncate">
                        {item.subtitle}
                      </span>
                    </div>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 text-[11px] font-medium text-zinc-300 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Overené hodnotenia Google Maps & Facebook (Hodnotenie 5.0)</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                Dôvera klientov v číslach.
              </h2>
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'bg-zinc-900 hover:bg-white hover:text-black text-white shadow-md active:scale-95'
                      : 'bg-zinc-950 text-zinc-600 cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Posunúť doľava"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => slideReviews('right')}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    canScrollRight
                      ? 'bg-zinc-900 hover:bg-white hover:text-black text-white shadow-md active:scale-95'
                      : 'bg-zinc-950 text-zinc-600 cursor-not-allowed opacity-40'
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
                className="w-[300px] sm:w-[380px] md:w-[410px] flex-shrink-0 snap-start p-7 sm:p-8 rounded-3xl bg-zinc-950/70 hover:bg-zinc-900/60 flex flex-col justify-between transition-all hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-white">
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
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-zinc-900/80 text-[10px] text-zinc-400 font-medium mb-3">
                      {rev.service}
                    </span>
                  )}

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-6">
                    „{rev.quote}“
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
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

      {/* SECTION: Atelier Lučenec Callout with House Photo & Google Maps */}
      <section className="py-20 sm:py-28 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Atelier & Salón Lučenec
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
                J. Kármána 1727/30, 984 01 Lučenec
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Príjemné, komorné prostredie pre klientov i účastníkov vzdelávacích kurzov. Bezplatné a pohodlné parkovanie priamo pred salónom.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={STYLIST_PROFILE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-zinc-200 text-black transition-all active:scale-95 shadow-lg whitespace-nowrap cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Navigovať cez Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/salon"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all whitespace-nowrap"
              >
                <span>Viac o salóne</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* 2-Card Visual Showcase: House Photo + Google Maps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 1. House Photo Card */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 min-h-[300px] sm:min-h-[360px] group shadow-2xl flex flex-col justify-between">
              <img
                src="/images/riccardo/salon_house.jpg"
                alt="Hair Salon Riccardo - Ateliér a dom na J. Kármána 30 v Lučenci"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/riccardo/official_logo_square.png';
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />

              {/* Top Badges */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-zinc-300">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                  <span>Sídlo salónu & Akadémie</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-[11px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Parkovanie pred domom</span>
                </span>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 p-6 space-y-1">
                <div className="text-white font-semibold text-lg tracking-tight">
                  Hair Salon Riccardo Atelier
                </div>
                <p className="text-xs text-zinc-300">
                  Rodinný dom pod nadjazdom • J. Kármána 1727/30, Lučenec
                </p>
              </div>
            </div>

            {/* 2. Interactive Google Maps Card */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 min-h-[300px] sm:min-h-[360px] shadow-2xl flex flex-col">
              <iframe
                title="Hair Salon Riccardo Lučenec - Google Maps"
                src="https://maps.google.com/maps?q=Hair+Salon+Riccardo,+J.+K%C3%A1rm%C3%A1na+1727%2F30,+Lu%C4%8Denec&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[300px] sm:min-h-[360px] border-0 filter invert-[92%] hue-rotate-180 contrast-[105%]"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Floating Glassmorphism Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/85 backdrop-blur-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-200 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium truncate text-xs">J. Kármána 1727/30, 984 01 Lučenec</span>
                </div>
                <a
                  href={STYLIST_PROFILE.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-[11px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Trasa</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
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
