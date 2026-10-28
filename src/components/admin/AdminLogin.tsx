import React, { useState, useEffect } from 'react';
import { adminStore } from '../../services/adminStore';
import { COMPANY_DETAILS } from '../../data/content';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  Clock
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Check lockout on mount and interval
  useEffect(() => {
    const checkLockout = () => {
      const { locked, remainingSeconds } = adminStore.isLockedOut();
      if (locked && remainingSeconds) {
        setLockoutSeconds(remainingSeconds);
      } else {
        setLockoutSeconds(null);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) return;

    if (!username.trim() || !password.trim()) {
      setError('Vyplňte prosím používateľské meno aj heslo.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = adminStore.login(username, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Nesprávne prihlasovacie údaje.');
        const check = adminStore.isLockedOut();
        if (check.locked && check.remainingSeconds) {
          setLockoutSeconds(check.remainingSeconds);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-zinc-800/20 via-zinc-900/40 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-zinc-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <img
              src="/images/riccardo/official_logo_square.png"
              alt="Hair Salon Riccardo"
              className="w-16 h-16 rounded-full object-contain bg-white p-1 border border-zinc-700/80 shadow-2xl"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zabezpečený prístup</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white uppercase">
            HAIR SALON <span className="font-bold">RICCARDO</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase">
            Administratívny portál & Správa kurzov
          </p>
        </div>

        {/* Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-zinc-950/90 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Prihlásenie správcu</h2>
              <p className="text-xs text-zinc-400">Autorizácia pre {COMPANY_DETAILS.legalName}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Lockout Warning */}
          {lockoutSeconds !== null && lockoutSeconds > 0 && (
            <div className="p-3.5 rounded-xl bg-red-950/40 text-red-200 text-xs flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Prístup dočasne uzamknutý</span>
                <p className="text-[11px] text-red-300 leading-relaxed">
                  Z bezpečnostných dôvodov počkajte ešte <strong>{lockoutSeconds} sekúnd</strong> pred ďalším pokusom.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !lockoutSeconds && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-zinc-300 block">
                  Email alebo prihlasovacie meno
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Zadajte prihlasovací email alebo meno"
                  className="w-full bg-zinc-900 focus:bg-zinc-850 text-white pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-zinc-300">
                  Bezpečnostné heslo
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900 focus:bg-zinc-850 text-white pl-10 pr-11 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all active:scale-[0.99] shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Overujem poverenia...</span>
                </div>
              ) : (
                <>
                  <span>Vstúpiť do administrácie</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Disclosures */}
        <div className="text-center space-y-1 text-[11px] text-zinc-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit šifrovaná relácia • Ochrana proti zneužitiu (Rate-Limiting)</span>
          </p>
          <p>
            Prevádzkovateľ: {COMPANY_DETAILS.legalName} • Všetky práva vyhradené
          </p>
        </div>
      </div>
    </div>
  );
};
