import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STYLIST_PROFILE } from '../data/content';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { ArrowUp } from 'lucide-react';
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
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="font-semibold tracking-[0.2em] text-white uppercase text-sm block">
              RICCARDO
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Hair Salon Riccardo & Academy. Vedené Richardom Čonkom, víťazom Czech & Slovak Hairdressing Awards (Cena verejnosti SR).
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
            </ul>
          </div>

          {/* Newsletter (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-zinc-300 font-medium block mb-1">
              Upozornenia na nové termíny
            </span>
            <p className="text-zinc-500 text-xs mb-3">
              Dozviete sa o nových komorných seminároch v Lučenci pred ich vypredaním.
            </p>

            {subscribed ? (
              <span className="text-white text-xs block py-2">
                Ste prihlásení na odber.
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
                  className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex-shrink-0"
                >
                  Odoberať
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <div>
            <p className="text-zinc-400">
              © {new Date().getFullYear()} Hair Salon Riccardo. Všetky práva vyhradené. J. Kármána 1727/30, 984 01 Lučenec.
            </p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Prevádzkovateľ eshopu a vzdelávacieho portálu: <strong className="text-zinc-400 font-medium">zeterem s.r.o.</strong>
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Hore</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
