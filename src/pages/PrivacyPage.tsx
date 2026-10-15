import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS } from '../data/content';
import { ArrowLeft, ShieldCheck, Lock, Building2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
            <Lock className="w-3.5 h-3.5 text-white" />
            <span>Ochrana súkromia podľa GDPR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Zásady ochrany osobných údajov
          </h1>
          <p className="text-sm text-zinc-400">
            Informácie o spracúvaní osobných údajov v zmysle Nariadenia Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov.
          </p>
        </div>

        {/* Controller Box */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 mb-10 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Prevádzkovateľ informačného systému:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-850 font-mono text-[11px]">
            <div><strong>Prevádzkovateľ:</strong> {COMPANY_DETAILS.legalName}</div>
            <div><strong>IČO:</strong> {COMPANY_DETAILS.ico}</div>
            <div><strong>Sídlo:</strong> {COMPANY_DETAILS.registeredOffice}</div>
            <div><strong>DIČ:</strong> {COMPANY_DETAILS.dic}</div>
            <div><strong>Zápis:</strong> {COMPANY_DETAILS.courtRegistration}</div>
            <div><strong>Zodpovedná osoba:</strong> {COMPANY_DETAILS.managingDirector}</div>
            <div><strong>Email pre GDPR dotazy:</strong> {COMPANY_DETAILS.contactEmail}</div>
            <div><strong>Telefón:</strong> {COMPANY_DETAILS.phone}</div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              1. Aké údaje spracúvame a na aký účel?
            </h2>
            <p>
              Prevádzkovateľ spracúva osobné údaje, ktoré mu dobrovoľne poskytnete prostredníctvom rezervačného formulára, kontaktného formulára alebo prihlásenia do VIP Waitlistu:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>
                <strong>Vybavenie rezervácie a plnenie zmluvy:</strong> Meno, priezvisko, email, telefónne číslo, fakturačné údaje (názov salónu, IČO, DIČ, sídlo v prípade podnikateľov), údaje o zvolenom seminári a platbe. <em>Právny základ:</em> Plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).
              </li>
              <li>
                <strong>Vedenie účtovníctva a daňové povinnosti:</strong> Fakturačné a platobné údaje v súlade so zákonom o účtovníctve. <em>Právny základ:</em> Plnenie zákonnej povinnosti (čl. 6 ods. 1 písm. c) GDPR).
              </li>
              <li>
                <strong>Vybavenie dopytov a kontaktný formulár:</strong> Meno, email, telefón, predmet a text správy. <em>Právny základ:</em> Oprávnený záujem prevádzkovateľa zodpovedať dopyty klientov (čl. 6 ods. 1 písm. f) GDPR).
              </li>
              <li>
                <strong>VIP Waitlist & Upozornenia na termíny:</strong> Emailová adresa a meno za účelom zaslania informácie o uvoľnení miesta na seminári. <em>Právny základ:</em> Súhlas dotknutej osoby (čl. 6 ods. 1 písm. a) GDPR).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              2. Kto má prístup k vašim osobným údajom? (Sprostredkovatelia)
            </h2>
            <p>
              Vaše osobné údaje neposkytujeme tretím stranám na marketingové účely. K údajom majú prístup výhradne overení zmluvní sprostredkovatelia nevyhnutní pre zabezpečenie technického a finančného chodu:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong>Stripe Inc.</strong> (poskytovateľ platobnej brány pre platby kartami a Apple Pay, certifikácia PCI DSS Level 1).</li>
              <li><strong>Vercel Inc.</strong> (poskytovateľ zabezpečenej cloudovej infraštruktúry a hostingového servera).</li>
              <li><strong>Účtovná kancelária a daňový poradca prevádzkovateľa</strong> (viazaní zákonnou mlčanlivosťou).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              3. Doba uchovávania údajov
            </h2>
            <p>
              Osobné údaje spracúvame len po dobu nevyhnutnú na dosiahnutie účelu, na ktorý boli získané:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Údaje viazané na účtovné doklady a zmluvy uchovávame po dobu 10 rokov v súlade so zákonom o účtovníctve a daňovým poriadkom.</li>
              <li>Údaje z kontaktného formulára uchovávame maximálne 1 rok po vybavení dopytu.</li>
              <li>Údaje pre VIP Waitlist uchovávame do odvolania súhlasu (odhlásenie je možné kedykoľvek kliknutím v maile alebo správou na hair.riccardo@gmail.com).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              4. Práva dotknutej osoby
            </h2>
            <p>
              Ako dotknutá osoba máte podľa nariadenia GDPR nasledovné práva:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li><strong>Právo na prístup:</strong> Máte právo vyžiadať si potvrdenie o tom, či spracúvame vaše osobné údaje a získať ich kópiu.</li>
              <li><strong>Právo na opravu:</strong> Právo na bezodkladnú opravu nepresných alebo doplnenie neúplných údajov.</li>
              <li><strong>Právo na vymazanie („právo na zabudnutie“):</strong> Právo na výmaz údajov, pokiaľ už nie sú potrebné alebo zanikol právny dôvod.</li>
              <li><strong>Právo na obmedzenie spracúvania:</strong> Právo obmedziť spracovanie v zákonom stanovených prípadoch.</li>
              <li><strong>Právo na prenosnosť údajov:</strong> Právo získať údaje v štruktúrovanom, bežne používanom formáte.</li>
              <li><strong>Právo namietať:</strong> Právo kedykoľvek namietať proti spracúvaniu na základe oprávneného záujmu.</li>
              <li><strong>Právo podať sťažnosť:</strong> Máte právo podať sťažnosť dozornému orgánu, ktorým je:
                <br />
                <strong>Úrad na ochranu osobných údajov Slovenskej republiky</strong>, Hraničná 12, 820 07 Bratislava 27, web: <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">https://dataprotection.gov.sk</a>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              5. Bezpečnosť údajov
            </h2>
            <p>
              Prevádzkovateľ prijal primerané technické, bezpečnostné a organizačné opatrenia (šifrovanie SSL/TLS, bezpečné platobné brány bez ukladania čísel kariet na našich serveroch, riadenie prístupových práv), aby chránil vaše údaje pred neoprávneným prístupom, stratou či zneužitím.
            </p>
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
