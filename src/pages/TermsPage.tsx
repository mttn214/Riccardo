import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS, STYLIST_PROFILE } from '../data/content';
import { ArrowLeft, ShieldCheck, FileText, Scale, Building2, ExternalLink } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Právny dokument eshopu & akadémie</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Všeobecné obchodné podmienky (VOP)
          </h1>
          <p className="text-sm text-zinc-400">
            Platné a účinné od 1. novembra 2024. Vydané v súlade so zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa a zákonom č. 22/2004 Z. z. o elektronickom obchode.
          </p>
        </div>

        {/* Company Identification Box */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 mb-10 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Identifikačné údaje prevádzkovateľa a predávajúceho:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-850 font-mono text-[11px]">
            <div><strong>Obchodné meno:</strong> {COMPANY_DETAILS.legalName}</div>
            <div><strong>IČO:</strong> {COMPANY_DETAILS.ico}</div>
            <div><strong>Sídlo:</strong> {COMPANY_DETAILS.registeredOffice}</div>
            <div><strong>DIČ:</strong> {COMPANY_DETAILS.dic}</div>
            <div><strong>Zápis v registri:</strong> {COMPANY_DETAILS.courtRegistration}</div>
            <div><strong>DPH status:</strong> {COMPANY_DETAILS.vatStatus}</div>
            <div><strong>Štatutárny orgán / Konateľ:</strong> {COMPANY_DETAILS.managingDirector}</div>
            <div><strong>Adresa prevádzky (Salón & Atelier):</strong> {COMPANY_DETAILS.salonAddress}</div>
            <div><strong>Email:</strong> {COMPANY_DETAILS.contactEmail}</div>
            <div><strong>Telefón:</strong> {COMPANY_DETAILS.phone}</div>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">

          {/* Článok I */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok I. Vymedzenie pojmov a úvodné ustanovenia
            </h2>
            <p>
              1.1. Tieto Všeobecné obchodné podmienky (ďalej len <strong>„VOP“</strong>) upravujú práva a povinnosti zmluvných strán vyplývajúce z kúpnej zmluvy a zmluvy o poskytnutí vzdelávacích a odborných služieb (ďalej len <strong>„Zmluva“</strong>) uzatváranej medzi predávajúcim a kupujúcim prostredníctvom internetovej stránky a rezervačného systému dostupného na doméne riccardo-zednici.vercel.app (ďalej len <strong>„Webové sídlo“</strong>).
            </p>
            <p>
              1.2. <strong>Predávajúcim a prevádzkovateľom</strong> je obchodná spoločnosť <strong>ZETEREM s.r.o.</strong>, so sídlom Haličská cesta 942/3, 984 01 Lučenec, IČO: 47 520 817, DIČ: 2023950863, zapísaná v Obchodnom registri Okresného súdu Banská Bystrica, Oddiel: Sro, Vložka číslo: 25734/S (ďalej len „Predávajúci“).
            </p>
            <p>
              1.3. <strong>Kupujúcim</strong> je každá fyzická alebo právnická osoba, ktorá uskutoční online rezerváciu miesta na odbornom seminári / masterclasse alebo objedná službu či tovar na Webovom sídle Predávajúceho.
            </p>
            <p>
              1.4. <strong>Spotrebiteľom</strong> je fyzická osoba, ktorá pri uzatváraní a plnení spotrebiteľskej zmluvy nekoná v rámci predmetu svojej podnikateľskej činnosti, zamestnania alebo povolania.
            </p>
          </section>

          {/* Článok II */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok II. Objednávka a uzatvorenie zmluvy
            </h2>
            <p>
              2.1. Ponuka seminárov, workshopov a služieb na Webovom sídle predstavuje návrh na uzavretie zmluvy.
            </p>
            <p>
              2.2. K uzatvoreniu Zmluvy dochádza odoslaním riadne vyplneného online rezervačného formulára Kupujúcim a jeho potvrdením zo strany Predávajúceho. Súčasťou objednávky je povinnosť Kupujúceho zaplatiť kúpnu cenu alebo dohodnutú zálohu.
            </p>
            <p>
              2.3. Po úspešnom odoslaní a úhrade objednávky systém automaticky vygeneruje a zašle na emailovú adresu Kupujúceho potvrdenie rezervácie s unikátnym kódom vstupenky (Ticket ID), údajmi o seminári a daňovým dokladom.
            </p>
          </section>

          {/* Článok III */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok III. Ceny a platobné podmienky
            </h2>
            <p>
              3.1. Všetky ceny uvedené na Webovom sídle sú konečné, uvádzané v mene Euro (EUR). Predávajúci je neplatiteľom DPH podľa § 4 zákona o DPH.
            </p>
            <p>
              3.2. Kupujúci môže vykonať úhradu jedným z nasledujúcich bezpečných spôsobov:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Platobnou kartou (Visa, Mastercard, Maestro) prostredníctvom certifikovanej platobnej brány Stripe s 3D Secure overením.</li>
              <li>Prostredníctvom mobilnej peňaženky Apple Pay alebo Google Pay.</li>
              <li>Bezhotovostným bankovým prevodom na základe vystavenej zálohovej faktúry (splatnosť 3 dni).</li>
              <li>Úhradou nevratnej garančnej zálohy vo výške 100 EUR online a doplatením zostatku na mieste konania v hotovosti alebo kartou pred začiatkom kurzu.</li>
            </ul>
          </section>

          {/* Článok IV */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok IV. Podmienky účasti na seminároch
            </h2>
            <p>
              4.1. Kapacita každého turnusu masterclassu je z dôvodu zachovania komorného charakteru a 100% individuálneho dohľadu lektora striktne obmedzená na <strong>maximálne 6 účastníkov</strong>.
            </p>
            <p>
              4.2. Miestom konania je Atelier Hair Salon Riccardo, J. Kármána 1727/30, 984 01 Lučenec, pokiaľ pri konkrétnom termíne nie je výslovne uvedené inak.
            </p>
            <p>
              4.3. V cene All-Inclusive vstupenky je zahrnuté celodenné školenie pod osobným vedením Richarda Čonku, originálna termokefa Riccardo, pracovné skriptá, občerstvenie počas prestávok, spotrebný materiál, cvičné hlavy a oficiálny akreditovaný certifikát Riccardo Academy.
            </p>
          </section>

          {/* Článok V */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok V. Odstúpenie od zmluvy a storno podmienky
            </h2>
            <p>
              5.1. <strong>Právo Spotrebiteľa na odstúpenie od zmluvy:</strong> Spotrebiteľ má právo odstúpiť od zmluvy bez uvedenia dôvodu v lehote 14 dní odo dňa uzavretia zmluvy v súlade s § 19 zákona č. 108/2024 Z. z. o ochrane spotrebiteľa.
            </p>
            <p>
              5.2. Ak Spotrebiteľ požiada o začatie poskytovania služby pred uplynutím lehoty na odstúpenie od zmluvy a služba bola úplne poskytnutá, právo na odstúpenie zaniká.
            </p>
            <p>
              5.3. <strong>Storno podmienky pre semináre (vzhľadom na limitovanú kapacitu 6 miest):</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Bezplatné storno alebo bezplatný presun na iný termín: viac ako 14 kalendárnych dní pred termínom konania (vrátenie 100% uhradenej sumy).</li>
              <li>Storno 14 až 7 dní pred termínom: storno poplatok 50% z ceny vstupenky (alebo možnosť vyslania náhradníka za seba bez poplatku).</li>
              <li>Storno menej ako 7 dní pred konaním alebo neúčasť bez oznámenia: 100% ceny vstupenky z dôvodu zablokovania miesta v ateliéri (Kupujúci má právo poslať za seba náhradníka).</li>
            </ul>
          </section>

          {/* Článok VI */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok VI. Reklamačný poriadok
            </h2>
            <p>
              6.1. Kupujúci má právo na riadne a včasné poskytnutie objednanej služby v deklarovanej kvalite a rozsahu.
            </p>
            <p>
              6.2. Reklamáciu je možné uplatniť písomne na emailovej adrese <strong>hair.riccardo@gmail.com</strong> alebo poštou na adresu sídla Predávajúceho: ZETEREM s.r.o., Haličská cesta 942/3, 984 01 Lučenec.
            </p>
            <p>
              6.3. Predávajúci vybaví reklamáciu bez zbytočného odkladu, najneskôr do 30 dní od jej doručenia, a o výsledku písomne informuje Kupujúceho.
            </p>
          </section>

          {/* Článok VII */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok VII. Alternatívne riešenie sporov (ARS) a orgán dozoru
            </h2>
            <p>
              7.1. Spotrebiteľ má právo obrátiť sa na Predávajúceho so žiadosťou o nápravu, ak nie je spokojný so spôsobom, ktorým Predávajúci vybavil jeho reklamáciu.
            </p>
            <p>
              7.2. Ak Predávajúci na žiadosť odpovedal zamietavo alebo na ňu neodpovedal do 30 dní, Spotrebiteľ má právo podať návrh na začatie alternatívneho riešenia sporu subjektu ARS v zmysle zákona č. 391/2015 Z. z.
            </p>
            <p>
              7.3. Príslušným subjektom pre alternatívne riešenie spotrebiteľských sporov je:
              <br />
              <strong>Slovenská obchodná inšpekcia (SOI)</strong>, Inšpektorát SOI pre Banskobystrický kraj, Kuzmányho 18, 974 01 Banská Bystrica 1.
              <br />
              Spotrebiteľ môže použiť aj online platformu pre riešenie sporov dostupnú na: <a href={COMPANY_DETAILS.arsPlatform} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1">http://ec.europa.eu/consumers/odr <ExternalLink className="w-3 h-3" /></a>.
            </p>
          </section>

          {/* Článok VIII */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2">
              Článok VIII. Záverečné ustanovenia
            </h2>
            <p>
              8.1. Právne vzťahy neupravené týmito VOP sa spravujú príslušnými ustanoveniami Občianskeho zákonníka, zákona o ochrane spotrebiteľa, zákona o elektronickom obchode a právnym poriadkom Slovenskej republiky.
            </p>
            <p>
              8.2. Tieto VOP nadobúdajú platnosť a účinnosť dňom 1. novembra 2024.
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
