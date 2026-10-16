import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { COMPANY_DETAILS } from '../../data/content';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FileText,
  Search,
  CreditCard,
  Check,
  Zap
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { settings, auditLogs, store } = useAdminStore();

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Security settings state
  const [timeoutMinutes, setTimeoutMinutes] = useState(settings.sessionTimeoutMinutes);
  const [maxAttempts, setMaxAttempts] = useState(settings.maxFailedAttempts);
  const [lockoutMinutes, setLockoutMinutes] = useState(settings.lockoutDurationMinutes);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Stripe Gateway Configuration state
  const stripeConfig = store.getStripeConfig();
  const [stripeMode, setStripeMode] = useState<'test' | 'live'>(stripeConfig.mode);
  const [stripePk, setStripePk] = useState(stripeConfig.publishableKey);
  const [stripeSk, setStripeSk] = useState(stripeConfig.secretKey);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  // Backup restore state
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Audit log search
  const [logSearch, setLogSearch] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Nové heslá sa nezhodujú.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Nové heslo musí mať aspoň 8 znakov.');
      return;
    }

    const res = store.changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordSuccess('Heslo bolo úspešne zmenené. Nové heslo je aktívne.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error || 'Pôvodné heslo je nesprávne.');
    }
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings({
      ...settings,
      sessionTimeoutMinutes: Number(timeoutMinutes),
      maxFailedAttempts: Number(maxAttempts),
      lockoutDurationMinutes: Number(lockoutMinutes),
      requireTwoFactorDemo: false,
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2500);
  };

  const handleSaveStripeGateway = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveStripeConfig({
      mode: stripeMode,
      publishableKey: stripePk,
      secretKey: stripeSk
    });
    setStripeSuccess(true);
    setTimeout(() => setStripeSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = store.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riccardo_zaloha_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = store.restoreBackup(content);
      if (res.success) {
        setRestoreMessage({ type: 'success', text: 'Záloha bola úspešne obnovená do systému.' });
      } else {
        setRestoreMessage({ type: 'error', text: res.error || 'Chyba pri obnove údajov.' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    store.resetToFactoryDefaults();
    setShowResetConfirm(false);
    setRestoreMessage({ type: 'success', text: 'Systém bol obnovený na pôvodné výrobné nastavenia.' });
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (!logSearch.trim()) return true;
    const q = logSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.category.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header - Unified & Seamless without harsh lines */}
      <div className="pb-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Bezpečnosť & Systémové nastavenia
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Zabezpečenie prístupu, platobná brána Stripe, prevádzkovateľ ZETEREM s.r.o., audit a zálohovanie.
        </p>
      </div>

      {/* Stripe Payment Gateway Section */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Platobná brána Stripe (Apple Pay & Platobné karty)</h2>
              <p className="text-[11px] text-zinc-400">
                Konfigurácia platobných kľúčov pre prijímanie úhrad za semináre od kaderníkov.
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full ${
            stripeMode === 'live'
              ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20'
          }`}>
            Režim: {stripeMode === 'live' ? 'Živý (Live)' : 'Testovací (Sandbox)'}
          </span>
        </div>

        {stripeSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nastavenia Stripe brány boli úspešne uložené a sú okamžite aktívne v platobnom dialógu.</span>
          </div>
        )}

        <form onSubmit={handleSaveStripeGateway} className="space-y-4 text-xs pt-1">
          {/* Mode switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStripeMode('test')}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                stripeMode === 'test'
                  ? 'bg-zinc-800 text-white font-medium shadow'
                  : 'bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="font-semibold text-xs text-white">Testovací režim (Test Mode)</div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Pre testovanie platieb s testovacou kartou (4242...). Stripe odmieta reálne karty.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStripeMode('live')}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                stripeMode === 'live'
                  ? 'bg-emerald-950/60 text-emerald-200 font-medium shadow ring-1 ring-emerald-500/30'
                  : 'bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                <span>Živý režim (Live Production)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Skutočné platby</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Stiahne reálne peniaze z kariet a Apple Pay klientov na účet ZETEREM s.r.o.
              </p>
            </button>
          </div>

          {/* Keys inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium block">
                Stripe Publishable Key ({stripeMode === 'live' ? 'pk_live_...' : 'pk_test_...'})
              </label>
              <input
                type="text"
                value={stripePk}
                onChange={(e) => setStripePk(e.target.value)}
                placeholder={stripeMode === 'live' ? 'pk_live_51...' : 'pk_test_51...'}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
              />
              <span className="text-[10px] text-zinc-500 block">
                Verejný kľúč použitý na webe pre inicializáciu Stripe.js a Apple Pay.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium flex justify-between">
                <span>Stripe Secret Key ({stripeMode === 'live' ? 'sk_live_...' : 'sk_test_...'})</span>
                <button
                  type="button"
                  onClick={() => setShowStripeSecret(!showStripeSecret)}
                  className="text-zinc-500 hover:text-zinc-300 text-[10px] cursor-pointer"
                >
                  {showStripeSecret ? 'Skryť' : 'Zobraziť'}
                </button>
              </label>
              <input
                type={showStripeSecret ? 'text' : 'password'}
                value={stripeSk}
                onChange={(e) => setStripeSk(e.target.value)}
                placeholder={stripeMode === 'live' ? 'sk_live_51...' : 'sk_test_51...'}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
              />
              <span className="text-[10px] text-zinc-500 block">
                Tajný kľúč servera pre autorizáciu platby a stiahnutie peňazí.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-zinc-400">
              Kľúče nájdete vo vašom Stripe Dashboarde: <strong className="text-zinc-200">dashboard.stripe.com/apikeys</strong>.
            </p>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer shrink-0"
            >
              Uložiť konfiguráciu Stripe
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Zmena hesla - Borderless & Seamless */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Zmena administrátorského hesla</h2>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-2xl bg-amber-950/60 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Pôvodné heslo</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Zadajte aktuálne heslo"
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Nové heslo (min. 8 znakov)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Zadajte silné nové heslo"
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Potvrdenie nového hesla</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Znova zadajte nové heslo"
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded bg-zinc-900 border-0"
                />
                <span>Zobraziť heslá</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Aktualizovať heslo
              </button>
            </div>
          </form>
        </div>

        {/* 2. Bezpečnostné pravidlá relácie - Borderless & Seamless */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Pravidlá relácie & Rate-Limiting</h2>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bezpečnostné parametre boli úspešne uložené.</span>
            </div>
          )}

          <form onSubmit={handleSaveSecuritySettings} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium flex justify-between">
                <span>Časový limit relácie (nečinnosť)</span>
                <span className="font-mono text-zinc-400">{timeoutMinutes} minút</span>
              </label>
              <select
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer"
              >
                <option value={15}>15 minút (Vysoká bezpečnosť)</option>
                <option value={30}>30 minút</option>
                <option value={60}>60 minút (Odporúčané)</option>
                <option value={120}>120 minút (2 hodiny)</option>
                <option value={480}>480 minút (Celý pracovný deň)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium flex justify-between">
                <span>Maximálny počet neúspešných prihlásení</span>
                <span className="font-mono text-zinc-400">{maxAttempts} pokusov</span>
              </label>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer"
              >
                <option value={3}>3 pokusy (Striktná ochrana)</option>
                <option value={5}>5 pokusov (Štandard)</option>
                <option value={10}>10 pokusov</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium flex justify-between">
                <span>Doba uzamknutia pri prekročení (Brute-force)</span>
                <span className="font-mono text-zinc-400">{lockoutMinutes} minút</span>
              </label>
              <select
                value={lockoutMinutes}
                onChange={(e) => setLockoutMinutes(Number(e.target.value))}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer"
              >
                <option value={5}>5 minút</option>
                <option value={15}>15 minút (Štandard)</option>
                <option value={30}>30 minút</option>
                <option value={60}>60 minút</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť bezpečnostné pravidlá
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Prevádzkovateľ ZETEREM s.r.o. Informácie - Seamless 4-card layout */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Oficiálne údaje prevádzkovateľa (ZETEREM s.r.o.)</h2>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            Aktívne v systéme
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 block uppercase">Obchodné meno:</span>
            <strong className="text-white block mt-1">{COMPANY_DETAILS.legalName}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 block uppercase">IČO / DIČ:</span>
            <span className="text-white block mt-1">IČO: {COMPANY_DETAILS.ico}</span>
            <span className="text-zinc-400 block text-[11px]">DIČ: {COMPANY_DETAILS.dic}</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 block uppercase">Bankové spojenie:</span>
            <span className="text-white block mt-1">Tatra banka, a.s.</span>
            <span className="text-zinc-400 block text-[10px] truncate">SK91 1100 0000 0029 3847 5612</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 block uppercase">Sídlo & Salón:</span>
            <span className="text-white block mt-1 truncate">{COMPANY_DETAILS.registeredOffice}</span>
            <span className="text-zinc-400 block text-[11px] truncate">{COMPANY_DETAILS.salonAddress}</span>
          </div>
        </div>
      </div>

      {/* 4. Zálohovanie & Obnova údajov - Seamless layout */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Zálohovanie dát & Obnova zo zálohy</h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">JSON formát</span>
        </div>

        {restoreMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              restoreMessage.type === 'success'
                ? 'bg-emerald-950/60 text-emerald-200'
                : 'bg-red-950/60 text-red-200'
            }`}
          >
            {restoreMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{restoreMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white">Exportovať zálohu systému</h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Stiahne všetky kurzy, účastníkov, fotky a nastavenia do jedného súboru JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Stiahnuť zálohu (.json)</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white">Obnoviť zo záložného súboru</h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Nahrajte predtým exportovaný súbor JSON pre obnovenie údajov.
              </p>
            </div>
            <label className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Vybrať súbor JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Factory Reset */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-red-400">Výrobné nastavenia</h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Obnoví počiatočné kurzy, účastníkov a heslá do pôvodného stavu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Obnoviť výrobné údaje</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bezpečnostný Audit Log - Borderless & Seamless */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Bezpečnostný auditný záznam (Audit Log)</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrovať záznamy..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-zinc-950/80 text-white pl-8 pr-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-white/20 outline-none font-mono"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-950/60 overflow-hidden max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/90 text-zinc-400 text-[10px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Časová pečiatka</th>
                <th className="py-2.5 px-3">Kategória</th>
                <th className="py-2.5 px-3">Operácia</th>
                <th className="py-2.5 px-3">Podrobnosti</th>
                <th className="py-2.5 px-3">Používateľ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-500">
                    Žiadne záznamy v auditnom protokole.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-2 px-3 text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-white font-medium whitespace-nowrap">{log.action}</td>
                    <td className="py-2 px-3 text-zinc-400">{log.details}</td>
                    <td className="py-2 px-3 text-zinc-500">{log.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-white">Obnoviť výrobné nastavenia?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Týmto sa vymažú všetky novovytvorené semináre, zoznamy účastníkov a heslá a obnovia sa predvolené testovacie údaje.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                Potvrdiť reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
