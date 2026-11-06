import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { adminStore } from '../services/adminStore';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    return adminStore.subscribe(() => {
      setSettings(adminStore.getSettings());
    });
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
      <span className="font-bold tracking-[0.14em] text-white text-[0.9rem] sm:text-[1.05rem] uppercase leading-none font-brand">
        RICCARDO
      </span>
      <span className="text-[9.6px] sm:text-[10.8px] text-zinc-400 font-normal tracking-[0.10em] uppercase mt-1.5 font-brand">
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
          className={`w-full py-2 px-4 text-center text-[0.9rem] font-medium flex items-center justify-center gap-2 border-b transition-colors ${
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-[4.5rem] items-center justify-between gap-3 sm:h-[5.1rem] lg:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3.5 [-webkit-tap-highlight-color:transparent]">
            <span className="relative z-10 h-[4.5rem] w-[5.67rem] shrink-0 sm:h-[5.1rem] sm:w-[6.48rem]">
              <span aria-hidden="true" className="pointer-events-none absolute left-0 top-1 aspect-square w-full">
                <span className="absolute inset-[10%] rounded-full bg-white/[0.056] backdrop-blur-[32px]" />
              </span>
              <svg aria-hidden="true" className="absolute size-0">
                <filter id="navbar-logo-white" colorInterpolationFilters="sRGB">
                  <feColorMatrix type="matrix" values="
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0.36 1.2 0.12 0 -0.6
                  " />
                  <feComposite in2="SourceAlpha" operator="in" />
                </filter>
              </svg>
              <img
                src="/images/riccardo/official_logo_dark_square.png"
                alt="Hair Salon Riccardo"
                className="absolute top-1 left-0 aspect-square w-full object-contain [filter:url(#navbar-logo-white)]"
              />
            </span>
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
          <nav className="hidden shrink-0 items-center whitespace-nowrap min-[960px]:flex lg:gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `glass-nav-link relative isolate rounded-full px-2 py-1 text-[15.6px] transition-colors font-normal tracking-tight ${
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
          <div className="hidden shrink-0 items-center min-[960px]:flex">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.9rem] font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
            >
              <span>Rezervovať</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-2 min-[960px]:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1 rounded-full text-[0.9rem] font-semibold bg-white text-black"
            >
              Rezervovať
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="min-[960px]:hidden bg-black/40 px-6 py-6 animate-fadeIn">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `glass-nav-link self-start rounded-full px-2 py-1.5 text-[1.05rem] transition-colors ${
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
