import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowUpRight, Trophy, Users, Sparkles, Check, Flame, ChevronRight, ShieldCheck, Star } from 'lucide-react';

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
    sublabel: string;
  };
  modelCutout: string;
  modelAlt: string;
  themeGlow: string;
  accentBorder: string;
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
    watermarkText: 'ARCHITEKTÚRA FÚKANEJ',
    statBadge: {
      value: '72 HODÍN',
      label: 'Garantovaný objem',
      sublabel: 'Bez zaťaženia lakom či penou',
    },
    modelCutout: '/images/riccardo/model_cutout_look1_isnet.webp',
    modelAlt: 'Richard Čonka — Umenie fúkanej, Žitná Symfónia',
    themeGlow: 'from-amber-500/30 via-orange-500/10 to-transparent',
    accentBorder: 'border-amber-500/40',
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
    watermarkText: 'PRAHA VÍŤAZ HDA',
    statBadge: {
      value: '1. MIESTO',
      label: 'Cena verejnosti SR',
      sublabel: 'Forum Karlín • HDA Gala večer',
    },
    modelCutout: '/images/riccardo/model_cutout_look2.webp',
    modelAlt: 'Richard Čonka s víťaznou kolekciou na HDA',
    themeGlow: 'from-amber-400/35 via-yellow-500/15 to-transparent',
    accentBorder: 'border-amber-400/50',
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
    watermarkText: 'STRIKTNE 6 MIEST',
    statBadge: {
      value: 'MAX 6',
      label: 'Kresiel v ateliéri',
      sublabel: 'Garancia 100% osobného dohľadu',
    },
    modelCutout: '/images/riccardo/model_cutout_look3.webp',
    modelAlt: 'Avant-Garde styling Riccardo',
    themeGlow: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    accentBorder: 'border-emerald-500/40',
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
    watermarkText: 'PREMENA SALÓNU',
    statBadge: {
      value: '+150%',
      label: 'Nárast hodnoty fúkanej',
      sublabel: 'Najžiadanejšia prémiová služba',
    },
    modelCutout: '/images/riccardo/model_cutout_look4.webp',
    modelAlt: 'Dark Elegance Riccardo',
    themeGlow: 'from-zinc-300/20 via-zinc-500/10 to-transparent',
    accentBorder: 'border-white/40',
  },
];

interface AppleScrollShowcaseProps {
  onOpenBooking: () => void;
}

export const AppleScrollShowcase: React.FC<AppleScrollShowcaseProps> = ({ onOpenBooking }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Parallax for spatial 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollable = rect.height - viewportHeight;

          if (totalScrollable > 0) {
            const scrolled = Math.max(0, -rect.top);
            const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous floating index from 0 to 3
  const continuousIndex = scrollProgress * (SHOWCASE_STEPS.length - 1);
  const activeStep = Math.min(
    SHOWCASE_STEPS.length - 1,
    Math.max(0, Math.round(continuousIndex))
  );

  const jumpToStep = (index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll =
      window.scrollY +
      rect.top +
      (index / (SHOWCASE_STEPS.length - 1)) * totalScrollable +
      10;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const currentStep = SHOWCASE_STEPS[activeStep];

  // Continuous travel offsets for the marquee ribbons BEHIND the woman
  // Ribbon 1 slides left by 1200px as user scrolls from 0% to 100%
  const ribbon1Offset = -scrollProgress * 1400;
  // Ribbon 2 slides right to left with different speed
  const ribbon2Offset = 600 - scrollProgress * 1200;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-black text-white min-h-[380vh] border-t border-zinc-900 select-none overflow-clip"
      style={{ perspective: '1400px' }}
    >
      {/* STICKY FULLSCREEN 3D STAGE */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden z-10 px-4 sm:px-8 py-4 sm:py-8">

        {/* ========================================================================= */}
        {/* TOP LAYER (z-40): Apple Chapter Navigation & Progress Bar */}
        {/* ========================================================================= */}
        <div className="relative z-40 max-w-6xl mx-auto w-full pt-14 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-300 font-semibold">
                3D SPATIAL SHOWCASE • KROK 0{activeStep + 1} / 04
              </span>
            </div>

            {/* Apple Segmented Chapter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 shadow-2xl">
              {SHOWCASE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => jumpToStep(idx)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-lg scale-105'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80 font-medium'
                    }`}
                  >
                    <span className="font-mono text-[10px]">{step.number}</span>
                    <span className="hidden md:inline">{step.pill}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Gauge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <div className="w-24 h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-150 rounded-full"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold">{Math.round(scrollProgress * 100)}%</span>
            </div>

          </div>
        </div>


        {/* ========================================================================= */}
        {/* CENTER 3D COMPOSITION: Everything travels physically BEHIND the woman */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center my-auto min-h-0 overflow-hidden">

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 0 (z-0): Volumetric Stage Glow (Behind everything) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[900px] h-[550px] sm:h-[900px] rounded-full bg-gradient-to-tr ${currentStep.themeGlow} blur-[180px] pointer-events-none transition-all duration-1000 opacity-90`}
          />

          {/* --------------------------------------------------------------------- */}
          {/* LAYER 1 (z-10): DUAL CONTINUOUS 3D MARQUEE RIBBONS (SLIDE BEHIND WOMAN) */}
          {/* Letters visibly slide behind her head, hair and torso, and emerge on the other side! */}
          {/* --------------------------------------------------------------------- */}
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none select-none z-10 overflow-hidden py-10 opacity-70">
            
            {/* Top Marquee Track: Behind her neck & shoulders */}
            <div
              className="whitespace-nowrap font-black tracking-tighter uppercase text-[11vw] sm:text-[13vw] lg:text-[14vw] leading-none transition-transform ease-out"
              style={{
                transform: `translate3d(${ribbon1Offset + mouseOffset.x * -35}px, ${mouseOffset.y * -15}px, 0)`,
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.18)',
                color: 'transparent',
                textShadow: '0 0 40px rgba(255,255,255,0.05)',
              }}
            >
              CZECH & SLOVAK HAIRDRESSING AWARDS • FORUM KARLÍN 2023 • UMENIE FÚKANEJ • ARCHITEKTÚRA ŤAHU • VÍŤAZ CENA VEREJNOSTI • 
            </div>

            {/* Bottom Marquee Track: Behind her waist & hips */}
            <div
              className="whitespace-nowrap font-black tracking-tighter uppercase text-[9vw] sm:text-[11vw] lg:text-[12vw] leading-none transition-transform ease-out"
              style={{
                transform: `translate3d(${ribbon2Offset + mouseOffset.x * 25}px, ${mouseOffset.y * 15}px, 0)`,
                WebkitTextStroke: '1.5px rgba(251, 191, 36, 0.22)',
                color: 'transparent',
                textShadow: '0 0 30px rgba(251, 191, 36, 0.08)',
              }}
            >
              STRIKTNE MAX 6 KRESIEL • 72-HODINOVÝ OBJEM • 100% PRAX NA MODELKÁCH • ATELIER RICCARDO • NÁRAST CIEN O +150% • 
            </div>

          </div>


          {/* --------------------------------------------------------------------- */}
          {/* LAYER 2 (z-20): 3D STORY CARDS & STAT BADGES (GLIDE IN DEPTH BEHIND HER) */}
          {/* Positioned so the right edge of cards slightly slips behind her silhouette */}
          {/* --------------------------------------------------------------------- */}
          <div className="absolute inset-0 max-w-6xl mx-auto flex items-center justify-between pointer-events-none z-20 px-4 sm:px-6">
            
            {/* Left Narrative Glass Cards Stack (Continuous smooth travel) */}
            <div className="relative w-full sm:max-w-md lg:max-w-lg h-[460px] flex items-center">
              {SHOWCASE_STEPS.map((step, idx) => {
                const delta = continuousIndex - idx;
                // Calculate smooth continuous interpolation
                // When delta = 0, card is centered, fully opaque
                // When delta moves away, card glides vertically and fades
                const distance = Math.abs(delta);
                const isVisible = distance < 1.1;
                const translateY = delta * -70; // Smooth vertical travel
                const scale = Math.max(0.85, 1 - distance * 0.08);
                const opacity = Math.max(0, Math.min(1, 1 - distance * 1.2));
                const blur = distance * 6;

                if (!isVisible) return null;

                return (
                  <div
                    key={step.id}
                    className="absolute inset-0 flex items-center pointer-events-auto transition-transform ease-out duration-150"
                    style={{
                      transform: `translate3d(${mouseOffset.x * 15}px, ${translateY + mouseOffset.y * 15}px, 0) scale(${scale})`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      zIndex: Math.round((1 - distance) * 10),
                    }}
                  >
                    <div
                      className={`w-full p-6 sm:p-8 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border ${step.accentBorder} shadow-[0_30px_90px_rgba(0,0,0,0.95)] space-y-4 ring-1 ring-white/10`}
                    >
                      {/* Card Header Strip */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Piliér 0{idx + 1} / 04</span>
                        </div>

                        <span className="font-mono text-xs text-zinc-400 font-semibold">
                          {step.pill}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-200 font-semibold leading-snug mt-1 text-amber-300/90">
                          {step.tagline}
                        </p>
                      </div>

                      {/* Narrative Description */}
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                        {step.description}
                      </p>

                      {/* Key Takeaways */}
                      <div className="space-y-2 pt-3 border-t border-zinc-850">
                        {step.keyPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className="leading-snug">{point}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Floating Stat Badge Stack (Floats in 3D depth behind her right side) */}
            <div className="hidden lg:relative lg:flex flex-col items-end w-72 h-[400px] justify-center">
              {SHOWCASE_STEPS.map((step, idx) => {
                const delta = continuousIndex - idx;
                const distance = Math.abs(delta);
                const isVisible = distance < 1.1;
                const translateY = delta * -50;
                const scale = Math.max(0.85, 1 - distance * 0.1);
                const opacity = Math.max(0, Math.min(1, 1 - distance * 1.3));

                if (!isVisible) return null;

                return (
                  <div
                    key={`stat-${step.id}`}
                    className="absolute inset-0 flex flex-col justify-center items-end pointer-events-auto transition-transform ease-out duration-150"
                    style={{
                      transform: `translate3d(${mouseOffset.x * 20}px, ${translateY + mouseOffset.y * 20}px, 0) scale(${scale})`,
                      opacity,
                    }}
                  >
                    <div className="p-6 rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-right w-full space-y-2 ring-1 ring-white/10">
                      <div className="flex items-center justify-end gap-1.5 text-amber-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-mono tracking-widest font-bold">
                          Výsledná metrika
                        </span>
                      </div>
                      
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight block">
                        {step.statBadge.value}
                      </span>
                      
                      <div className="border-t border-zinc-850 pt-2">
                        <strong className="text-xs text-zinc-200 block font-semibold">
                          {step.statBadge.label}
                        </strong>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          {step.statBadge.sublabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-zinc-850 text-xs text-zinc-400 flex items-center gap-2.5 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Atelier Riccardo • Lučenec</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>


          {/* --------------------------------------------------------------------- */}
          {/* LAYER 3 (z-30): FOREGROUND PINNED WOMAN CUTOUT (EVERYTHING GLIDES BEHIND HER) */}
          {/* --------------------------------------------------------------------- */}
          <div
            className="relative z-30 pointer-events-none flex items-end justify-center h-[72vh] sm:h-[80vh] max-h-[850px] transition-transform ease-out duration-200"
            style={{
              transform: `translate3d(${mouseOffset.x * 14}px, ${mouseOffset.y * 14}px, 0) scale(${1 + scrollProgress * 0.04})`,
            }}
          >
            {/* The Cutout Container with Realistic Ground Shadow */}
            <div className="relative h-full flex items-end justify-center">
              
              {/* Ground Shadow & Ambient Floor Reflection */}
              <div className="absolute -bottom-4 w-4/5 h-16 bg-black/95 blur-2xl rounded-full" />
              
              {/* Stack of all 4 Model Cutouts with Continuous Cross-Fade */}
              {SHOWCASE_STEPS.map((step, idx) => {
                const delta = continuousIndex - idx;
                const distance = Math.abs(delta);
                // Sharp cross-fade between the 4 models
                const modelOpacity = Math.max(0, Math.min(1, 1 - distance * 1.5));
                const isCurrent = distance < 0.9;

                if (!isCurrent) return null;

                return (
                  <img
                    key={`model-${step.id}`}
                    src={step.modelCutout}
                    alt={step.modelAlt}
                    className="absolute bottom-0 h-full w-auto object-contain object-bottom filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] select-none transition-opacity duration-300"
                    style={{
                      opacity: modelOpacity,
                      maxHeight: '100%',
                    }}
                  />
                );
              })}

              {/* 3D Depth Indicator Tag pinned in front of the model */}
              <div className="absolute top-1/3 -right-2 sm:-right-6 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-xl border border-white/20 text-[11px] font-bold text-white shadow-2xl animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Autorský model Riccardo • Kolekcia HDA</span>
              </div>

            </div>
          </div>

        </div>


        {/* ========================================================================= */}
        {/* BOTTOM CONTROLS & HIGH-STAKES CTA (z-40) */}
        {/* ========================================================================= */}
        <div className="relative z-40 max-w-6xl mx-auto w-full pb-2 sm:pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800 shadow-2xl">
            
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-white font-bold block leading-tight">
                  Najbližší autorský masterclass v Lučenci
                </strong>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  Komorná kapacita striktne 6 účastníkov • Zostávajú posledné 2 voľné miesta
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-mono hidden md:inline">
                Posúvajte nadol pre ďalšiu fázu ↓
              </span>

              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Bojovať o voľné miesto</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
