import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { adminStore } from '../services/adminStore';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    const unsub = adminStore.subscribe(() => {
      setSettings(adminStore.getSettings());
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const navLinks = [
    { label: 'Domov', href: '/' },
    { label: 'Semináre', href: '/seminare' },
    { label: 'Tvorba', href: '/tvorba' },
    { label: 'Ocenenia', href: '/ocenenia' },
    { label: 'Referencie', href: '/referencie' },
    { label: 'Salón', href: '/salon' },
  ];

  const brandText = (
    <>
      <span className="font-bold tracking-[0.14em] text-white text-xs sm:text-sm uppercase leading-none font-brand">
        RICCARDO
      </span>
      <span className="text-[8px] sm:text-[9px] text-zinc-400 font-normal tracking-[0.10em] uppercase mt-1.5 font-brand">
        Hair Salon &amp; Academy <span className="hidden sm:inline">• Lučenec</span>
      </span>
    </>
  );

  return (
    <header
      className="glass-navbar fixed inset-x-0 top-0 z-40"
    >
      {/* Dynamic Top Announcement Banner */}
      {settings.bannerEnabled && settings.bannerText && (
        <div
          className={`w-full py-2 px-4 text-center text-xs font-medium flex items-center justify-center gap-2 border-b transition-colors ${
            settings.bannerStyle === 'emerald'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/40'
              : settings.bannerStyle === 'dark'
              ? 'bg-zinc-900/95 text-zinc-300 border-zinc-800'
              : 'bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 text-amber-200 border-amber-800/40'
          }`}
        >
          <span>{settings.bannerText}</span>
          {settings.bannerButtonText && (
            <Link
              to={settings.bannerButtonLink || '/seminare'}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity ml-1.5"
            >
              <span>{settings.bannerButtonText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-300 ${
        isScrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-3.5'
      }`}>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Brand Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-3.5 [-webkit-tap-highlight-color:transparent]">
            <img
              src="/images/riccardo/official_logo_dark_square.png"
              alt="Hair Salon Riccardo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-zinc-950 border border-zinc-800/90 p-0.5 shadow-xl shrink-0"
            />
            <div
              className="glass-brand-text relative font-brand"
              onPointerMove={(event) => {
                const label = event.currentTarget;
                const bounds = label.getBoundingClientRect();
                label.style.setProperty('--brand-x', `${event.clientX - bounds.left}px`);
                label.style.setProperty('--brand-y', `${event.clientY - bounds.top}px`);
              }}
            >
              <div className="flex flex-col">{brandText}</div>
              <div aria-hidden="true" className="glass-brand-highlight pointer-events-none absolute inset-0 flex flex-col">
                {brandText}
              </div>
            </div>
          </Link>

          {/* Desktop Multi-page Navigation */}
          <nav className="hidden shrink-0 items-center whitespace-nowrap md:flex lg:gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `glass-nav-link relative isolate rounded-full px-2 py-1 text-[13px] transition-colors font-normal tracking-tight ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Minimal CTA Button */}
          <div className="hidden shrink-0 items-center md:flex">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
            >
              <span>Rezervovať</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-black"
            >
              Rezervovať
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/40 px-6 py-6 animate-fadeIn">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `glass-nav-link self-start rounded-full px-2 py-1.5 text-sm transition-colors ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
