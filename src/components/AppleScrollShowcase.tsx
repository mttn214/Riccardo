import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Trophy, Users, Sparkles, Check, Flame, Layers } from 'lucide-react';

interface ShowcaseStep {
  id: string;
  number: string;
  pill: string;
  title: string;
  tagline: string;
  description: string;
  keyPoints: string[];
  image: string;
  imageAlt: string;
  photoBadge: {
    icon: 'sparkles' | 'trophy' | 'users' | 'flame';
    label: string;
    sublabel: string;
  };
}

const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    id: 'step-technique',
    number: '01',
    pill: 'Dynamika tepla & Ťah',
    title: 'Architektúra fúkanej.',
    tagline: 'Objem, ktorý drží bez lakovania helmy.',
    description:
      'Správna fúkaná nie je o náhode, ale o geometrii a biomechanike. Richard Čonka učí presný uhol nadvihnutia od vlasovej cibuľky, kontrolované napätie na okrúhlej termokefe a uzamknutie kutikuly studeným vzduchom.',
    keyPoints: [
      'Presný sklon kefy pre 3D nadýchanie pri korienkoch',
      'Fixácia studeným vzduchom pre 72-hodinovú trvácnosť',
      'Zrkadlový lesk bez prepálenia vlasového vlákna',
    ],
    image: '/images/riccardo/richard_conka_hda_1.jpg',
    imageAlt: 'Richard Čonka — Umenie fúkanej, Look 1 Žitná Symfónia',
    photoBadge: {
      icon: 'sparkles',
      label: 'Aerodynamika & Tvar',
      sublabel: '72h trvácnosť bez krepovatenia',
    },
  },
  {
    id: 'step-award',
    number: '02',
    pill: 'Remeslo overené v Prahe',
    title: 'Trofej z Fora Karlín.',
    tagline: 'Víťaz Ceny verejnosti SR na HDA.',
    description:
      'Na 17. ročníku najprestížnejšej kaderníckej súťaže v Česku a na Slovensku (Czech & Slovak Hairdressing Awards) získal Richard Čonka sošku víťaza celonárodného hlasovania za svoju autorskú 4-dielnu kolekciu.',
    keyPoints: [
      'Ocenenie tisíckami hlasov odbornej i laickej verejnosti',
      'Rovnaké postupy a tajomstvá odovzdávané na seminároch',
      'Dôkaz, že svetový styling vzniká aj v srdci Novohradu',
    ],
    image: '/images/riccardo/richard_conka_stage_award.jpg',
    imageAlt: 'Richard Čonka preberá ocenenie Cena verejnosti SR v Prahe',
    photoBadge: {
      icon: 'trophy',
      label: 'Cena verejnosti SR',
      sublabel: 'Czech & Slovak Hairdressing Awards',
    },
  },
  {
    id: 'step-academy',
    number: '03',
    pill: 'Komorný formát (Max 6 miest)',
    title: 'Osobný mentoring 1-na-1.',
    tagline: 'Žiadna masovosť v sále.',
    description:
      'Zabudnite na prednášky pre 100 kaderníkov, kde nič nevidíte. Riccardo Academy striktne obmedzuje kapacitu na 6 účastníkov. Richard stojí priamo pri vašom kresle a opravuje každý pohyb zápästia.',
    keyPoints: [
      'Intenzívna hands-on prax na reálnych modelkách',
      'Individuálna analýza chýb a nastavenie správnej ergonómie',
      'Termokefa Riccardo a skriptá pre každého účastníka',
    ],
    image: '/images/riccardo/richard_conka_hda_2.jpg',
    imageAlt: 'Kolekcia Avant-Garde Richard Čonka',
    photoBadge: {
      icon: 'users',
      label: 'Limit: 6 kaderníkov',
      sublabel: 'Garantovaný osobný prístup',
    },
  },
  {
    id: 'step-results',
    number: '04',
    pill: 'Výsledok pre váš salón',
    title: 'Okamžitý rast cien.',
    tagline: 'Premeňte bežnú fúkanú na VIP zážitok.',
    description:
      'Absolventi odchádzajú so zručnosťou, ktorú klientky okamžite spoznajú a za ktorú si radi priplatia. Fúkaná sa stane vašou najziskovejšou a najvyhľadávanejšou salónnou službou.',
    keyPoints: [
      'Klientky sa vracajú každý týždeň na expresný styling',
      'Fotogenické výsledky pripravené na váš Instagram',
      'Akreditovaný certifikát a členstvo v komunite absolventov',
    ],
    image: '/images/riccardo/richard_conka_hda_3.jpg',
    imageAlt: 'Dark Elegance styling Riccardo',
    photoBadge: {
      icon: 'flame',
      label: 'VIP Salónny štandard',
      sublabel: 'Maximálna pridaná hodnota',
    },
  },
];

interface AppleScrollShowcaseProps {
  onOpenBooking: () => void;
}

export const AppleScrollShowcase: React.FC<AppleScrollShowcaseProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable > 0) {
        const scrolledInside = Math.max(0, -rect.top);
        const progress = Math.min(1, Math.max(0, scrolledInside / totalScrollable));
        setScrollProgress(progress);
      }

      // Check which step card is closest to the middle of the viewport
      const middleY = viewportHeight * 0.45;
      let bestIndex = 0;
      let minDistance = Infinity;

      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const stepRect = el.getBoundingClientRect();
        const stepCenter = stepRect.top + stepRect.height / 2;
        const distance = Math.abs(stepCenter - middleY);

        if (distance < minDistance) {
          minDistance = distance;
          bestIndex = index;
        }
      });

      setActiveStep(bestIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (index: number) => {
    const el = stepRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentStepData = SHOWCASE_STEPS[activeStep];

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white py-20 sm:py-32 border-t border-zinc-900"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-semibold tracking-widest uppercase text-zinc-300 mb-5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Anatómia majstrovského stylingu</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] leading-[1.08] mb-6">
            Ako vzniká fúkaná, <br />
            <span className="text-zinc-500 font-normal">ktorá dobyla pódium v Prahe.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            Prejdite si 4 kľúčové piliere techniky Richarda Čonku. Sledujte, ako sa každý detail pretavuje do nezameniteľného pohybu a lesku.
          </p>

          {/* Apple-style Interactive Navigation Pills */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {SHOWCASE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => scrollToStep(idx)}
                className={`group px-3 sm:px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border ${
                  activeStep === idx
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">{step.number}</span>
                <span className="hidden md:inline">{step.pill}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Apple-style Two-Column Sticky Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative">
          
          {/* LEFT: Pinned / Sticky Visual Stage (Sticky on Mobile and Desktop) */}
          <div className="sticky top-16 sm:top-20 lg:top-28 z-20 mb-6 lg:mb-0 lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl group">
              
              {/* Stacked Images with Apple Crossfade & Subtle Zoom */}
              {SHOWCASE_STEPS.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={step.id}
                    className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isCurrent
                        ? 'opacity-100 scale-100 filter brightness-[0.95]'
                        : 'opacity-0 scale-105 pointer-events-none filter brightness-50'
                    }`}
                  >
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Cinematic Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                  </div>
                );
              })}

              {/* Top Glass Badge Indicator */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/15 text-xs text-white shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="font-mono font-semibold tracking-wider text-[11px]">
                    KROK {currentStepData.number} / 04
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-zinc-300">
                  {Math.round(scrollProgress * 100)}% PRESKÚMANÉ
                </div>
              </div>

              {/* Bottom Floating Glass Card with Dynamic Metadata */}
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <div className="p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                      {currentStepData.photoBadge.icon === 'sparkles' && <Sparkles className="w-5 h-5 text-white" />}
                      {currentStepData.photoBadge.icon === 'trophy' && <Trophy className="w-5 h-5 text-amber-400" />}
                      {currentStepData.photoBadge.icon === 'users' && <Users className="w-5 h-5 text-white" />}
                      {currentStepData.photoBadge.icon === 'flame' && <Flame className="w-5 h-5 text-emerald-400" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white block truncate">
                        {currentStepData.photoBadge.label}
                      </span>
                      <span className="text-xs text-zinc-400 block truncate">
                        {currentStepData.photoBadge.sublabel}
                      </span>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                        Masterclass
                      </span>
                      <span className="text-xs text-zinc-300 font-medium">
                        Riccardo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thin Vertical Apple Progress Bar on Card Edge */}
              <div className="absolute right-2 top-20 bottom-24 w-1 bg-white/10 rounded-full overflow-hidden hidden sm:block z-10">
                <div
                  className="w-full bg-white transition-all duration-300 rounded-full"
                  style={{ height: `${Math.max(15, ((activeStep + 1) / SHOWCASE_STEPS.length) * 100)}%` }}
                />
              </div>

            </div>
          </div>

          {/* RIGHT: Scrolling Narrative Steps */}
          <div className="lg:col-span-6 space-y-24 sm:space-y-40 py-8 lg:py-16">
            {SHOWCASE_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.id}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  className={`transition-all duration-500 transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-35 translate-y-3 scale-[0.98]'
                  }`}
                >
                  <div className="p-7 sm:p-10 rounded-3xl bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700/80 transition-all shadow-xl">
                    
                    {/* Chapter Number & Pill */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-white">
                        {step.number}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                        {step.pill}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-300 font-normal mb-5 leading-snug">
                      {step.tagline}
                    </p>

                    {/* Body */}
                    <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                      {step.description}
                    </p>

                    {/* Bullet Points with Clean Checkmarks */}
                    <div className="space-y-2.5 pt-4 border-t border-zinc-850">
                      {step.keyPoints.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                          <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active Step Indicator Pill */}
                    {isActive && (
                      <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                        <span className="text-white font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Aktívne sledovaný krok
                        </span>
                        <button
                          onClick={onOpenBooking}
                          className="text-white hover:text-zinc-300 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Rezervovať účasť</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-center sm:text-left">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold block mb-1">
              Riccardo Academy • Lučenec & Turné
            </span>
            <h4 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Chcete ovládnuť rovnakú techniku fúkanej?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Kapacita je prísne limitovaná na 6 kaderníkov pre garanciu intenzívnej spätnej väzby.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10"
            >
              <span>Rezervovať miesto na seminári</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
