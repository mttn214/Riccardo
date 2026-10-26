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
          
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="font-semibold tracking-[0.2em] text-white uppercase text-sm block">
              RICCARDO
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Autorské vzdelávanie kaderníkov a salónna tvorba.
            </p>
            <div className="flex items-center gap-3">
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
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfólio</Link></li>
              <li><Link to="/ocenenia" className="hover:text-white transition-colors">Ocenenia</Link></li>
              <li><Link to="/referencie" className="hover:text-white transition-colors">Hodnotenia</Link></li>
              <li><Link to="/salon" className="hover:text-white transition-colors">Salón Lučenec</Link></li>
              <li><Link to="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Legal Links (2 cols) */}
          <div className="md:col-span-2 space-y-2">
            <span className="text-zinc-300 font-medium block mb-3">
              Informácie
            </span>
            <ul className="space-y-2">
              <li>
                <Link to="/obchodne-podmienky" className="hover:text-white transition-colors">
                  Obchodné podmienky
                </Link>
              </li>
              <li>
                <Link to="/ochrana-udajov" className="hover:text-white transition-colors">
                  Ochrana osobných údajov
                </Link>
              </li>
              <li>
                <Link to="/reklamacny-poriadok" className="hover:text-white transition-colors">
                  Reklamácie a storno
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-zinc-300 font-medium block mb-1">
              Nové termíny
            </span>
            <p className="text-zinc-500 text-xs mb-3">
              Upozornenia na nové termíny seminárov pred ich vypredaním.
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <p className="text-zinc-500">
              © {new Date().getFullYear()} Hair Salon Riccardo. Všetky práva vyhradené.
            </p>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <Link to="/admin" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Správa portálu
            </Link>
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
