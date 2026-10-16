import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STYLIST_PROFILE, COMPANY_DETAILS } from '../data/content';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { ArrowUp, ExternalLink, ShieldCheck, Scale, FileText, Lock } from 'lucide-react';
import { sendFormNotification } from '../services/formService';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      await sendFormNotification({
        formType: 'VIP Waitlist',
        name: 'Odberateľ noviniek',
        email: newsletterEmail,
        'Zdroj': 'Newsletter v pätičke webu'
      });
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-500 pt-16 pb-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-900">
          
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="font-semibold tracking-[0.2em] text-white uppercase text-sm block">
              RICCARDO
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Hair Salon Riccardo & Academy. Vedené Richardom Čonkom, víťazom Czech & Slovak Hairdressing Awards (Cena verejnosti SR).
            </p>
            <p className="text-zinc-500 text-[11px]">
              Ateliér & prevádzka: {COMPANY_DETAILS.salonAddress}
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href={STYLIST_PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={STYLIST_PROFILE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-zinc-300 font-medium block mb-3">
              Vzdelávanie & Salón
            </span>
            <ul className="space-y-2">
              <li><Link to="/seminare" className="hover:text-white transition-colors">Termíny seminárov</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfólio & Premeny</Link></li>
              <li><Link to="/ocenenia" className="hover:text-white transition-colors">Czech & Slovak Hairdressing Awards</Link></li>
              <li><Link to="/referencie" className="hover:text-white transition-colors">Referencie kaderníkov</Link></li>
              <li><Link to="/salon" className="hover:text-white transition-colors">Salón Lučenec</Link></li>
              <li><Link to="/kontakt" className="hover:text-white transition-colors">Kontakt & FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links (2 cols) */}
          <div className="md:col-span-2 space-y-2">
            <span className="text-zinc-300 font-medium block mb-3">
              Právne informácie
            </span>
            <ul className="space-y-2">
              <li>
                <Link to="/obchodne-podmienky" className="hover:text-white transition-colors">
                  Obchodné podmienky (VOP)
                </Link>
              </li>
              <li>
                <Link to="/ochrana-udajov" className="hover:text-white transition-colors">
                  Ochrana osobných údajov
                </Link>
              </li>
              <li>
                <Link to="/reklamacny-poriadok" className="hover:text-white transition-colors">
                  Reklamačný poriadok & Storno
                </Link>
              </li>
              <li>
                <a
                  href={COMPANY_DETAILS.supervisoryAuthority.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Dozor SOI</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_DETAILS.arsPlatform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Riešenie sporov RSO</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li className="pt-2 border-t border-zinc-900">
                <Link
                  to="/admin"
                  className="text-zinc-600 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5 text-[11px] font-mono"
                  title="Administratívny portál pre správu kurzov a fotografií"
                >
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span>Správa systému</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-zinc-300 font-medium block mb-1">
              Upozornenia na nové termíny
            </span>
            <p className="text-zinc-500 text-xs mb-3">
              Dozviete sa o nových komorných seminároch v Lučenci pred ich vypredaním.
            </p>

            {subscribed ? (
              <span className="text-white text-xs block py-2">
                Ste prihlásení na odber noviniek.
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Váš email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-white px-3 py-1.5 rounded-full text-xs flex-grow focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex-shrink-0 cursor-pointer"
                >
                  Odoberať
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Official Statutory Company Details Box */}
        <div className="py-8 border-b border-zinc-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[11px] text-zinc-500">
          <div>
            <span className="text-zinc-300 block font-medium text-xs mb-1.5">
              Prevádzkovateľ & Predávajúci
            </span>
            <p className="text-white font-semibold">{COMPANY_DETAILS.legalName}</p>
            <p className="font-mono mt-0.5">IČO: {COMPANY_DETAILS.ico}</p>
            <p className="font-mono">DIČ: {COMPANY_DETAILS.dic}</p>
            <p className="text-[10px] text-zinc-400 mt-1">{COMPANY_DETAILS.vatStatus}</p>
          </div>

          <div>
            <span className="text-zinc-300 block font-medium text-xs mb-1.5">
              Sídlo & Registrácia
            </span>
            <p className="text-zinc-300">{COMPANY_DETAILS.registeredOffice}</p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
              {COMPANY_DETAILS.courtRegistration}
            </p>
          </div>

          <div>
            <span className="text-zinc-300 block font-medium text-xs mb-1.5">
              Ateliér & Kontakt
            </span>
            <p className="text-zinc-300">{COMPANY_DETAILS.salonAddress}</p>
            <p className="mt-1">Konateľ: <span className="text-zinc-300 font-medium">{COMPANY_DETAILS.managingDirector}</span></p>
            <p>Email: <a href={`mailto:${COMPANY_DETAILS.contactEmail}`} className="hover:text-white transition-colors">{COMPANY_DETAILS.contactEmail}</a></p>
            <p>Tel: <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{COMPANY_DETAILS.phone}</a></p>
          </div>

          <div>
            <span className="text-zinc-300 block font-medium text-xs mb-1.5">
              Orgán dozoru
            </span>
            <p className="text-zinc-300">{COMPANY_DETAILS.supervisoryAuthority.name}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {COMPANY_DETAILS.supervisoryAuthority.inspectorate}
            </p>
            <p className="text-[10px] text-zinc-500">
              {COMPANY_DETAILS.supervisoryAuthority.address}
            </p>
            <p className="text-[10px] text-zinc-500">
              {COMPANY_DETAILS.supervisoryAuthority.department}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <div>
            <p className="text-zinc-400">
              © {new Date().getFullYear()} Hair Salon Riccardo. Všetky práva vyhradené. Prevádzkovateľom eshopu a vzdelávacieho portálu je <strong>{COMPANY_DETAILS.legalName}</strong>.
            </p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Všetky zmluvné vzťahy a predaj kurzov sa riadia platnými zákonmi Slovenskej republiky (Zákon č. 108/2024 Z. z. a Zákon č. 22/2004 Z. z.).
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Hore</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
