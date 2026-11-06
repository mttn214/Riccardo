import { GlassHeadlineLine } from '../components/GlassHeadlineLine';
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SEMINARS_DATA, PORTFOLIO_DATA, STYLIST_PROFILE, TESTIMONIALS_DATA, TESTIMONIALS_STATS, PortfolioItem, Seminar } from '../data/content';
import { adminStore } from '../services/adminStore';
import { SeminarSpotlightCard } from '../components/SeminarSpotlightCard';
import { ArrowUpRight, Check, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '../components/SocialIcons';
import { WaitlistModal } from '../components/WaitlistModal';
import { hasSpotlightCutout } from '../components/SeminarSpotlightPhoto';

interface HomePageProps {
  onOpenDetail: (seminar: Seminar) => void;
  onOpenBooking: (seminar?: Seminar) => void;
  onSelectPortfolioItem: (item: PortfolioItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenDetail, onOpenBooking, onSelectPortfolioItem, Seminar }) => {
  const navigate = useNavigate();
  const [activeTurnusIndex, setActiveTurnusIndex] = useState(0);
  const seminars = adminStore.getSeminars();
  const featuredSeminars = SEMINARS_DATA.slice(0, 2).flatMap(({ id }) => seminars.filter((seminar) => seminar.id === id));
  const featuredSeminar = featuredSeminars[activeTurnusIndex] ?? featuredSeminars[0];
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
    <div className="bg-[#101010]">
      {/* Editorial Hero */}
      <Hero
        onExploreSeminars={() => {
          const el = document.getElementById('featured-drop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onExplorePortfolio={() => navigate('/tvorba')}
      />

      {/* SECTION: The Upcoming Exclusive Masterclass Drop */}
      <section id="featured-drop" className="py-24 sm:py-32 border-t border-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
                Najbližší autorský masterclass
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight">
                <GlassHeadlineLine>Vzácnosť. Nie masovosť.</GlassHeadlineLine>
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
            {featuredSeminars.map((seminar, index) => (
              <button
                key={seminar.id}
                onClick={() => setActiveTurnusIndex(index)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  seminar.id === featuredSeminar?.id
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {seminar.title.split(":")[0]} ({seminar.dates})
              </button>
            ))}
          </div>

          {/* Spotlight Card */}
          {featuredSeminar && (
            <div className={hasSpotlightCutout(featuredSeminar.image) ? "lg:mt-[calc(7rem+20px)]" : undefined}>
              <SeminarSpotlightCard seminar={featuredSeminar} onOpenDetail={onOpenDetail} onBook={onOpenBooking} onWaitlist={() => setIsWaitlistOpen(true)} />
            </div>
          )}
        </div>
      </section>

      {/* SECTION: Lookbook / Tvorba Moving Gallery */}
      <section className="py-24 sm:py-32 border-t border-zinc-900 text-white overflow-hidden">
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
          <div className="mt-8 flex justify-end text-xs border-t border-zinc-900 pt-4">
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
      <section className="py-24 sm:py-32 text-white">
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

                <figure className="relative w-full overflow-hidden rounded-2xl border border-white/10 lg:w-[42%] lg:shrink-0">
                  <img
                    src="/images/riccardo/hda_winners_group_hires.jpg"
                    alt="Víťazi Czech & Slovak Hairdressing Awards 2023 s trofejami na pódiu"
                    className="aspect-[3/2] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-5 pb-4 pt-10 text-xs font-medium text-white">
                    Odovzdávanie cien · Forum Karlín, Praha · 2023
                  </figcaption>
                </figure>
              </div>

              {/* Gala Ceremony Photo Gallery (Distinct from portfolio above) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
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
      <section className="py-24 sm:py-32 border-t border-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                Čo hovoria naši klienti
              </h2>
              <Link to="/referencie" className="mt-3 inline-flex text-sm text-zinc-400 transition-colors hover:text-white">
                Všetkých {TESTIMONIALS_STATS.totalReviews} hodnotení z Googlu a Facebooku
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={STYLIST_PROFILE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-action inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-zinc-950">
                  <GoogleIcon className="h-4 w-4" />
                </span>
                <span className="space-y-1">
                  <span className="block text-sm font-semibold">Recenzie na Googli</span>
                  <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </a>

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
                  <span className="text-[10px] text-zinc-600">
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

      <section className="py-20 sm:py-28 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl md:grid-cols-2">
            <div className="self-center p-6 sm:p-10">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-300">Ateliér a akadémia · Lučenec</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hair Salon Riccardo</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                V našom ateliéri v Lučenci sa venujeme strihu, farbeniu a stylingu. Stretávame sa tu aj s kaderníkmi na praktických seminároch.
              </p>
              <p className="mt-5 flex items-start gap-2 text-sm text-zinc-200">
                <MapPin className="h-4 w-4 shrink-0 text-amber-300" />
                <span>J. Kármána 1727/30, 984 01 Lučenec<span className="mt-1 block text-xs text-zinc-400">Bezplatné parkovanie pred salónom</span></span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/salon" className="glass-action inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-black">
                  Viac o salóne <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href={STYLIST_PROFILE.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="glass-action inline-flex items-center gap-2 rounded-full bg-zinc-900/80 px-5 py-3 text-xs font-medium text-white">
                  Trasa v Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <iframe
              title="Hair Salon Riccardo – poloha na Google Maps"
              src="https://maps.google.com/maps?q=Hair+Salon+Riccardo,+J.+K%C3%A1rm%C3%A1na+1727%2F30,+Lu%C4%8Denec&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="block h-full min-h-[18rem] w-full border-0 md:min-h-[24rem]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
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
