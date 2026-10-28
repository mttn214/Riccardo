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
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Ocenenia', href: '/ocenenia' },
    { label: 'Referencie', href: '/referencie' },
    { label: 'Salón', href: '/salon' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 transform-gpu will-change-[background-color,border-color] ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-zinc-850'
          : 'bg-black/40 backdrop-blur-md border-transparent'
      }`}
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
        isScrolled ? 'py-3.5 sm:py-4' : 'py-4 sm:py-4.5'
      }`}>
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/riccardo/official_logo_dark_square.png"
              alt="Hair Salon Riccardo"
              className="w-8 h-8 rounded-full object-contain bg-zinc-950 border border-zinc-800 group-hover:border-zinc-400 transition-colors shadow-lg"
            />
            <span className="font-semibold tracking-[0.2em] text-white text-sm uppercase">
              RICCARDO
            </span>
            <span className="text-[11px] text-zinc-500 font-normal tracking-wide hidden sm:inline">
              / Lučenec
            </span>
          </Link>

          {/* Desktop Multi-page Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `text-[13px] transition-colors font-normal tracking-tight relative py-1 ${
                    isActive
                      ? 'text-white font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-white'
                      : 'text-zinc-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Minimal CTA Button */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
            >
              <span>Rezervovať</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
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
        <div className="sm:hidden bg-black/98 border-b border-zinc-800 px-6 py-6 animate-fadeIn backdrop-blur-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm py-1.5 transition-colors ${
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
