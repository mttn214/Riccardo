import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS } from '../data/content';
import { ArrowLeft, ShieldCheck, RefreshCw, FileText, Building2, AlertCircle } from 'lucide-react';

export const RefundCancellationPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Späť na hlavnú stránku</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] uppercase tracking-widest text-zinc-400 font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Storno, reklamácie a garancia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Reklamačný poriadok a storno podmienky
          </h1>
          <p className="text-sm text-zinc-400">
            Pravidlá zrušenia rezervácie seminárov, uplatnenie reklamácií a vzorový formulár na odstúpenie od zmluvy podľa zákona č. 108/2024 Z. z.
          </p>
        </div>

        {/* Operator Identity */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 mb-10 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Prevádzkovateľ eshopu & akadémie:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-850 font-mono text-[11px]">
            <div><strong>Obchodné meno:</strong> {COMPANY_DETAILS.legalName}</div>
            <div><strong>IČO:</strong> {COMPANY_DETAILS.ico}</div>
            <div><strong>Sídlo:</strong> {COMPANY_DETAILS.registeredOffice}</div>
            <div><strong>DIČ:</strong> {COMPANY_DETAILS.dic}</div>
            <div><strong>Zápis:</strong> {COMPANY_DETAILS.courtRegistration}</div>
            <div><strong>Email pre reklamácie:</strong> {COMPANY_DETAILS.contactEmail}</div>
            <div><strong>Telefón:</strong> {COMPANY_DETAILS.phone}</div>
            <div><strong>Dozor:</strong> {COMPANY_DETAILS.supervisoryAuthority.name}</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">

          {/* Section 1: Storno */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              1. Storno podmienky vzdelávacích seminárov
            </h2>
            <p>
              Vzhľadom na prísne komorný formát akadémie (<strong>maximálna kapacita 6 kresiel</strong> na jeden turnus) a nutnosť vopred zabezpečiť cvičné modelky, spotrebný materiál a personálne kapacity, platia pre zrušenie rezervácie nasledovné pravidlá:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-emerald-400 font-bold block text-xs">Viac ako 14 dní vopred</span>
                <strong className="text-white block text-sm">100% Bezplatné storno</strong>
                <p className="text-[11px] text-zinc-400">Vrátime vám celú zaplatenú sumu alebo bezplatne presunieme účasť na iný termín.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-amber-400 font-bold block text-xs">14 až 7 dní vopred</span>
                <strong className="text-white block text-sm">50% Storno poplatok</strong>
                <p className="text-[11px] text-zinc-400">Alebo môžete za seba bezplatne poslať kolegu či náhradníka z vášho salónu.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-rose-400 font-bold block text-xs">Menej ako 7 dní vopred</span>
                <strong className="text-white block text-sm">100% Storno poplatok</strong>
                <p className="text-[11px] text-zinc-400">Miesto nie je možné na poslednú chvíľu obsadiť. Vstupenka je prenosná na náhradníka.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Záruka spokojnosti */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              2. 100% Garancia odborného posunu
            </h2>
            <p>
              Stojíme si za kvalitou odovzdávaného know-how Richarda Čonku. Ak po absolvovaní prvého dňa kurzu nadobudnete pocit, že školenie nesplnilo vopred deklarovaný obsah a neprinieslo vám žiadnu novú hodnotu, stačí to pred začiatkom druhého dňa oznámiť lektorovi a vrátime vám 100% ceny vstupenky.
            </p>
          </section>

          {/* Section 3: Postup pri reklamácii */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              3. Postup pri uplatnení reklamácie
            </h2>
            <p>
              3.1. Ak služby neboli poskytnuté v dohodnutom rozsahu, Kupujúci má právo uplatniť reklamáciu:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Písomne na email: <strong>{COMPANY_DETAILS.contactEmail}</strong></li>
              <li>Poštou na adresu sídla: <strong>ZETEREM s.r.o., Haličská cesta 942/3, 984 01 Lučenec</strong></li>
            </ul>
            <p>
              3.2. V reklamácii uveďte: meno a priezvisko, číslo rezervácie (kód vstupenky), dátum seminára a konkrétny popis vytýkanej vady.
            </p>
            <p>
              3.3. Reklamácia bude vybavená najneskôr do 30 dní odo dňa jej prijatia písomným potvrdením o spôsobe vybavenia.
            </p>
          </section>

          {/* Section 4: Formulár na odstúpenie */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              4. Vzorový formulár na odstúpenie od zmluvy
            </h2>
            <p className="text-zinc-400">
              (Vyplňte a zašlite tento formulár iba v prípade, že si želáte odstúpiť od zmluvy v zákonnej lehote 14 dní od online nákupu)
            </p>
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 font-mono text-xs text-zinc-300 space-y-2">
              <p><strong>Komu:</strong> ZETEREM s.r.o., Haličská cesta 942/3, 984 01 Lučenec, Email: {COMPANY_DETAILS.contactEmail}</p>
              <p>Týmto oznamujem/oznamujeme (*), že odstupujem/odstupujeme (*) od zmluvy na tento tovar / o poskytnutí tejto služby (*):</p>
              <p>— Názov seminára / služby: ................................................................</p>
              <p>— Kód vstupenky / Číslo objednávky: ................................................................</p>
              <p>— Dátum objednania / dátum úhrady (*): ................................................................</p>
              <p>— Meno a priezvisko spotrebiteľa/spotrebiteľov (*): ................................................................</p>
              <p>— Adresa spotrebiteľa/spotrebiteľov (*): ................................................................</p>
              <p>— Číslo bankového účtu (IBAN) pre vrátenie platby: ................................................................</p>
              <p>— Dátum a podpis spotrebiteľa (iba pri papierovom podaní): ................................................................</p>
              <p className="text-[10px] text-zinc-500 pt-2">(*) Nehodiace sa prečiarknite.</p>
            </div>
          </section>

          {/* Section 5: Orgán dozoru */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              5. Orgán dozoru a mimosúdne riešenie sporov
            </h2>
            <p>
              Dozor nad dodržiavaním povinností v oblasti ochrany spotrebiteľa vykonáva:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
              <strong className="text-white block font-semibold">{COMPANY_DETAILS.supervisoryAuthority.name}</strong>
              <p>{COMPANY_DETAILS.supervisoryAuthority.inspectorate}</p>
              <p>{COMPANY_DETAILS.supervisoryAuthority.address}</p>
              <p>{COMPANY_DETAILS.supervisoryAuthority.department}</p>
              <a href={COMPANY_DETAILS.supervisoryAuthority.web} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-block mt-1">
                www.soi.sk
              </a>
            </div>
          </section>

        </div>

        {/* Bottom Back Button */}
        <div className="pt-12 mt-12 border-t border-zinc-800 flex justify-between items-center">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md"
          >
            Späť na úvod
          </Link>
          <span className="text-xs text-zinc-500 font-mono">
            ZETEREM s.r.o. • IČO: 47 520 817
          </span>
        </div>

      </div>
    </div>
  );
};
