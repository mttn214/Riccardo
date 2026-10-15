import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Trophy, Users, Sparkles, Check, Flame, ChevronRight, Volume2 } from 'lucide-react';

interface ShowcaseStep {
  id: string;
  number: string;
  pill: string;
  title: string;
  tagline: string;
  description: string;
  keyPoints: string[];
  watermarkText: string;
  statBadge: {
    value: string;
    label: string;
  };
  modelCutout: string;
  modelAlt: string;
  themeGlow: string;
}

const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    id: 'step-technique',
    number: '01',
    pill: 'Dynamika tepla & Ťah',
    title: 'Architektúra fúkanej.',
    tagline: '72-hodinový objem bez jedinej kvapky laku.',
    description:
      'Správna fúkaná nie je o náhode, ale o aerodynamike a ergonómii. Richard Čonka učí presný uhol nadvihnutia od vlasovej cibuľky, kontrolované napätie na okrúhlej termokefe a okamžité uzamknutie kutikuly studeným vzduchom.',
    keyPoints: [
      'Presný sklon kefy pre 3D nadýchanie pri korienkoch',
      'Fixácia studeným vzduchom pre 72-hodinovú trvácnosť',
      'Zrkadlový lesk bez prepálenia vlasového vlákna',
    ],
    watermarkText: 'ARCHITEKTÚRA',
    statBadge: {
      value: '72 HODÍN',
      label: 'Garantovaný objem',
    },
    modelCutout: '/images/riccardo/model_cutout_look1_isnet.webp',
    modelAlt: 'Richard Čonka — Umenie fúkanej, Žitná Symfónia',
    themeGlow: 'from-amber-500/25 via-orange-500/10 to-transparent',
  },
  {
    id: 'step-award',
    number: '02',
    pill: 'Remeslo overené v Prahe',
    title: 'Trofej z Fora Karlín.',
    tagline: 'Víťaz celonárodnej Ceny verejnosti SR na HDA.',
    description:
      'Na 17. ročníku najprestížnejšej kaderníckej súťaže v Česku a na Slovensku (Czech & Slovak Hairdressing Awards) získal Richard Čonka sošku víťaza celonárodného hlasovania za svoju autorskú 4-dielnu kolekciu.',
    keyPoints: [
      'Ocenenie tisíckami hlasov odbornej i laickej verejnosti',
      'Rovnaké postupy a tajomstvá odovzdávané na seminároch',
      'Dôkaz, že svetový styling vzniká aj v Lučenci',
    ],
    watermarkText: 'PRAHA VÍŤAZ',
    statBadge: {
      value: '1. MIESTO',
      label: 'Cena verejnosti SR',
    },
    modelCutout: '/images/riccardo/model_cutout_look1_isnet.webp',
    modelAlt: 'Richard Čonka s víťaznou kolekciou na HDA',
    themeGlow: 'from-amber-400/30 via-yellow-500/10 to-transparent',
  },
  {
    id: 'step-academy',
    number: '03',
    pill: 'Komorný formát (Max 6 miest)',
    title: 'Osobný mentoring 1-na-1.',
    tagline: 'Žiadna masovosť. Iba intenzívna prax.',
    description:
      'Zabudnite na prednášky pre 100 ľudí v sále, kde nič nevidíte. Riccardo Academy striktne obmedzuje kapacitu na 6 účastníkov. Richard stojí priamo pri vašom kresle a koriguje každý pohyb zápästia.',
    keyPoints: [
      'Intenzívna hands-on prax na reálnych modelkách',
      'Individuálna analýza chýb a nastavenie správnej ergonómie',
      'Termokefa Riccardo a skriptá v cene každého lístka',
    ],
    watermarkText: 'MAX 6 MIEST',
    statBadge: {
      value: '6 KADERNÍKOV',
      label: 'Prísny komorný limit',
    },
    modelCutout: '/images/riccardo/model_cutout_look2.webp',
    modelAlt: 'Avant-Garde styling Riccardo',
    themeGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  {
    id: 'step-results',
    number: '04',
    pill: 'Výsledok pre váš salón',
    title: 'Okamžitý rast cien.',
    tagline: 'Premeňte bežnú fúkanú na najžiadanejšiu VIP službu.',
    description:
      'Absolventi odchádzajú so zručnosťou, ktorú klientky okamžite spoznajú a za ktorú si rady priplatia. Fúkaná sa stane vašou najziskovejšou salónnou službou, pre ktorú sa budú vracať každý týždeň.',
    keyPoints: [
      'Klientky sa vracajú každý týždeň na expresný styling',
      'Fotogenické výsledky pripravené na váš Instagram',
      'Akreditovaný certifikát a členstvo v komunite absolventov',
    ],
    watermarkText: 'RICCARDO',
    statBadge: {
      value: '+150%',
      label: 'Hodnota služby v salóne',
    },
    modelCutout: '/images/riccardo/model_cutout_look2.webp',
    modelAlt: 'Dark Elegance Riccardo',
    themeGlow: 'from-zinc-400/25 via-zinc-600/10 to-transparent',
  },
];

interface AppleScrollShowcaseProps {
  onOpenBooking: () => void;
}

export const AppleScrollShowcase: React.FC<AppleScrollShowcaseProps> = ({ onOpenBooking }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Parallax Effect on 3D layers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable > 0) {
        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
        setScrollProgress(progress);

        // Map progress to steps [0, 1, 2, 3]
        const stepIndex = Math.min(
          SHOWCASE_STEPS.length - 1,
          Math.floor(progress * SHOWCASE_STEPS.length)
        );
        setActiveStep(stepIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const jumpToStep = (index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = window.scrollY + rect.top + (index / SHOWCASE_STEPS.length) * totalScrollable + 50;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const currentStep = SHOWCASE_STEPS[activeStep];

  // Dynamic 3D parallax shifts based on scroll
  const backgroundTextOffset = (scrollProgress * -250).toFixed(1);
  const cardFloatY = Math.sin(scrollProgress * Math.PI * 2) * 12;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-black text-white min-h-[320vh] border-t border-zinc-900 select-none overflow-clip"
      style={{ perspective: '1200px' }}
    >
      {/* STICKY FULLSCREEN 3D STAGE */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden z-10 px-4 sm:px-8 py-6 sm:py-10">
        
        {/* ========================================================================= */}
        {/* TOP LAYER (z-40): Apple Pills & Step Indicator */}
        {/* ========================================================================= */}
        <div className="relative z-40 max-w-6xl mx-auto w-full pt-16 sm:pt-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Header Badge */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
                3D SPATIAL SHOWCASE • KROK {currentStep.number} / 04
              </span>
            </div>

            {/* Apple Segmented Chapter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800 shadow-2xl">
              {SHOWCASE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    activeStep === idx
                      ? 'bg-white text-black font-semibold shadow-md scale-105'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="font-mono text-[10px]">{step.number}</span>
                  <span className="hidden md:inline">{step.pill}</span>
                </button>
              ))}
            </div>

            {/* Progress Gauge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500">
              <div className="w-20 h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span>{Math.round(scrollProgress * 100)}%</span>
            </div>

          </div>
        </div>


        {/* ========================================================================= */}
        {/* CENTER 3D COMPOSITION: Everything behind the woman + Woman in front */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center my-auto min-h-0">

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 0 (z-0): Volumetric Stage Glow (Behind everything) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-tr ${currentStep.themeGlow} blur-[160px] pointer-events-none transition-all duration-1000 opacity-80`}
          />

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 1 (z-10): Giant 3D Watermark Typography (Travels BEHIND the woman) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden"
            style={{
              transform: `translate3d(${mouseOffset.x * -25}px, ${mouseOffset.y * -25}px, 0)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="text-[14vw] sm:text-[18vw] lg:text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap text-transparent transition-all duration-700 leading-none"
              style={{
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.08)',
                transform: `translateX(${backgroundTextOffset}px)`,
              }}
            >
              {currentStep.watermarkText}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 2 (z-20): Floating 3D Narrative Cards (Positioned BEHIND the woman) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className="absolute inset-0 max-w-6xl mx-auto flex items-center justify-between pointer-events-none z-20 px-4"
            style={{
              transform: `translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 20 + cardFloatY}px, 0)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Left Narrative Glass Card */}
            <div className="w-full sm:max-w-md lg:max-w-lg pointer-events-auto">
              <div className="p-6 sm:p-9 rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-4 transition-all duration-700 ring-1 ring-white/5">
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Piliér {currentStep.number} / 04</span>
                  </div>
                  
                  <span className="font-mono text-xs text-zinc-500 font-semibold">
                    {currentStep.pill}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
                  {currentStep.title}
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 font-medium leading-snug">
                  {currentStep.tagline}
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {currentStep.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-zinc-850">
                  {currentStep.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right Floating Stat Badge (Floats in 3D depth behind her right side) */}
            <div className="hidden lg:flex flex-col items-end gap-4 pointer-events-auto">
              <div className="p-6 rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800 shadow-2xl text-right max-w-xs space-y-1.5 ring-1 ring-white/5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block font-semibold">
                  Výsledná metrika
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight block">
                  {currentStep.statBadge.value}
                </span>
                <span className="text-xs text-zinc-400 block">
                  {currentStep.statBadge.label}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-zinc-850/80 text-xs text-zinc-400 flex items-center gap-2.5 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atelier Riccardo • Lučenec</span>
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 3 (z-30): THE CUTOUT WOMAN IN FOREGROUND (Everything travels BEHIND HER) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className="relative z-30 pointer-events-none flex items-end justify-center h-[70vh] sm:h-[78vh] max-h-[820px] transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0) scale(${1 + scrollProgress * 0.04})`,
            }}
          >
            {/* The Cutout Woman with Realistic Depth Shadow */}
            <div className="relative h-full flex items-end justify-center">
              
              {/* Ground Shadow & Ambient Light Cast */}
              <div className="absolute bottom-0 w-3/4 h-12 bg-black/90 blur-2xl rounded-full" />
              
              <img
                src={currentStep.modelCutout}
                alt={currentStep.modelAlt}
                className="h-full w-auto object-contain object-bottom filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] transition-all duration-700 select-none"
                style={{
                  maxHeight: '100%',
                }}
              />

              {/* 3D Depth Indicator Tag pinned to the woman's shoulder/waist */}
              <div className="absolute top-1/4 -right-4 sm:-right-8 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-white shadow-2xl animate-bounce">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Autorský styling Riccardo</span>
              </div>

            </div>
          </div>

        </div>


        {/* ========================================================================= */}
        {/* BOTTOM CONTROLS & CTA (z-40) */}
        {/* ========================================================================= */}
        <div className="relative z-40 max-w-6xl mx-auto w-full pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-zinc-850 shadow-2xl">
            
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-white font-semibold block leading-tight">
                  Najbližší autorský masterclass v Lučenci
                </strong>
                <span className="text-[11px] text-zinc-400 block">
                  Komorná kapacita striktne 6 účastníkov • Termokefa v cene
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-mono hidden md:inline">
                Posúvajte nadol pre ďalší krok ↓
              </span>

              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-xl flex items-center gap-2"
              >
                <span>Rezervovať miesto</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
