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
  Phone,
  Mail,
  MapPin,
  Megaphone,
  Sparkles,
  Users,
  Bell,
  Receipt,
  Layers,
  ArrowUpRight,
  Send,
  Calendar,
  Hourglass,
  Sliders
} from 'lucide-react';

type SettingsCategory =
  | 'all'
  | 'stripe'
  | 'salon'
  | 'banner'
  | 'bookings'
  | 'notifications'
  | 'billing'
  | 'security'
  | 'backup';

export const AdminSettingsTab: React.FC = () => {
  const { settings, auditLogs, store } = useAdminStore();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('all');

  // 1. Stripe Gateway state
  const stripeConfig = store.getStripeConfig();
  const [stripePk, setStripePk] = useState(stripeConfig.publishableKey);
  const [stripeSk, setStripeSk] = useState(stripeConfig.secretKey);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  // 2. Salon & Academy Contact state
  const [salonPhone, setSalonPhone] = useState(settings.salonPhone || '+421 915 869 758');
  const [salonSecondaryPhone, setSalonSecondaryPhone] = useState(settings.salonSecondaryPhone || '+421 908 261 740');
  const [salonEmail, setSalonEmail] = useState(settings.salonEmail || 'hair.riccardo@gmail.com');
  const [salonAddress, setSalonAddress] = useState(settings.salonAddress || 'J. Kármána 1727/30, 984 01 Lučenec, Slovenská republika');
  const [salonOpeningHours, setSalonOpeningHours] = useState(settings.salonOpeningHours || 'Pondelok – Piatok: 09:00 – 18:00, Sobota: Na objednávku, Nedeľa: Zatvorené');
  const [salonInstagram, setSalonInstagram] = useState(settings.salonInstagram || '@hair_salon_riccardo');
  const [salonSuccess, setSalonSuccess] = useState(false);

  // 3. Top Announcement Banner state
  const [bannerEnabled, setBannerEnabled] = useState(settings.bannerEnabled || false);
  const [bannerText, setBannerText] = useState(settings.bannerText || 'Nové termíny masterclass seminárov Richarda Čonku 2026 sú v predaji.');
  const [bannerButtonText, setBannerButtonText] = useState(settings.bannerButtonText || 'Zobraziť termíny');
  const [bannerButtonLink, setBannerButtonLink] = useState(settings.bannerButtonLink || '/seminare');
  const [bannerStyle, setBannerStyle] = useState<'gold' | 'emerald' | 'dark'>(settings.bannerStyle || 'gold');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // 4. Bookings & Capacity Rules state
  const [showRemainingSeats, setShowRemainingSeats] = useState(settings.showRemainingSeats !== false);
  const [enableWaitlist, setEnableWaitlist] = useState(settings.enableWaitlist !== false);
  const [checkoutHoldMinutes, setCheckoutHoldMinutes] = useState(settings.checkoutHoldMinutes || 15);
  const [maxTicketsPerOrder, setMaxTicketsPerOrder] = useState(settings.maxTicketsPerOrder || 2);
  const [lowCapacityThreshold, setLowCapacityThreshold] = useState(settings.lowCapacityThreshold || 2);
  const [bookingsSuccess, setBookingsSuccess] = useState(false);

  // 5. Notifications state
  const [adminNotifyEmail, setAdminNotifyEmail] = useState(settings.adminNotifyEmail || 'hair.riccardo@gmail.com');
  const [notifyOnNewOrder, setNotifyOnNewOrder] = useState(settings.notifyOnNewOrder !== false);
  const [notifyOnNewInquiry, setNotifyOnNewInquiry] = useState(settings.notifyOnNewInquiry !== false);
  const [notifyOnLowCapacity, setNotifyOnLowCapacity] = useState(settings.notifyOnLowCapacity !== false);
  const [sendTicketEmailToParticipant, setSendTicketEmailToParticipant] = useState(settings.sendTicketEmailToParticipant !== false);
  const [sendReminderBeforeSeminar, setSendReminderBeforeSeminar] = useState(settings.sendReminderBeforeSeminar !== false);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);

  // 6. Invoicing & Billing state
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix || 'RIC-2026-');
  const [currency, setCurrency] = useState(settings.currency || 'EUR');
  const [invoiceDueDays, setInvoiceDueDays] = useState(settings.invoiceDueDays || 7);
  const [showIbanOnReceipts, setShowIbanOnReceipts] = useState(settings.showIbanOnReceipts !== false);
  const [invoiceNoteText, setInvoiceNoteText] = useState(
    settings.invoiceNoteText ||
    'Dodávateľ nie je platiteľom DPH podľa § 4 zákona o DPH. Úhrada za účasť na odbornom kaderníckom seminári Hair Salon Riccardo & Academy.'
  );
  const [billingSuccess, setBillingSuccess] = useState(false);

  // 7. Security & Session state
  const [timeoutMinutes, setTimeoutMinutes] = useState(settings.sessionTimeoutMinutes);
  const [maxAttempts, setMaxAttempts] = useState(settings.maxFailedAttempts);
  const [lockoutMinutes, setLockoutMinutes] = useState(settings.lockoutDurationMinutes);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // 8. Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 9. Backup & Audit states
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  // Save Handlers
  const handleSaveStripeGateway = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveStripeConfig({
      mode: 'live',
      publishableKey: stripePk,
      secretKey: stripeSk
    });
    setStripeSuccess(true);
    setTimeout(() => setStripeSuccess(false), 3000);
  };

  const handleSaveSalonInfo = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        salonPhone,
        salonSecondaryPhone,
        salonEmail,
        salonAddress,
        salonOpeningHours,
        salonInstagram
      },
      'Aktualizácia kontaktných údajov',
      `Telefón: ${salonPhone}, Email: ${salonEmail}, Adresa: ${salonAddress}`
    );
    setSalonSuccess(true);
    setTimeout(() => setSalonSuccess(false), 3000);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        bannerEnabled,
        bannerText,
        bannerButtonText,
        bannerButtonLink,
        bannerStyle
      },
      'Aktualizácia oznamovacieho bannera',
      `Banner: ${bannerEnabled ? 'Aktívny' : 'Vypnutý'}, Text: "${bannerText.slice(0, 30)}..."`
    );
    setBannerSuccess(true);
    setTimeout(() => setBannerSuccess(false), 3000);
  };

  const handleSaveBookings = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        showRemainingSeats,
        enableWaitlist,
        checkoutHoldMinutes: Number(checkoutHoldMinutes),
        maxTicketsPerOrder: Number(maxTicketsPerOrder),
        lowCapacityThreshold: Number(lowCapacityThreshold)
      },
      'Aktualizácia rezervačných pravidiel',
      `Držanie miesta: ${checkoutHoldMinutes} min, Max lístkov: ${maxTicketsPerOrder}, Waitlist: ${enableWaitlist ? 'Áno' : 'Nie'}`
    );
    setBookingsSuccess(true);
    setTimeout(() => setBookingsSuccess(false), 3000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        adminNotifyEmail,
        notifyOnNewOrder,
        notifyOnNewInquiry,
        notifyOnLowCapacity,
        sendTicketEmailToParticipant,
        sendReminderBeforeSeminar
      },
      'Aktualizácia notifikačných pravidiel',
      `Notifikačný email: ${adminNotifyEmail}`
    );
    setNotificationsSuccess(true);
    setTimeout(() => setNotificationsSuccess(false), 3000);
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        invoicePrefix,
        currency,
        invoiceDueDays: Number(invoiceDueDays),
        showIbanOnReceipts,
        invoiceNoteText
      },
      'Aktualizácia fakturačných nastavení',
      `Predčíslie: ${invoicePrefix}, Splatnosť: ${invoiceDueDays} dní`
    );
    setBillingSuccess(true);
    setTimeout(() => setBillingSuccess(false), 3000);
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(
      {
        ...settings,
        sessionTimeoutMinutes: Number(timeoutMinutes),
        maxFailedAttempts: Number(maxAttempts),
        lockoutDurationMinutes: Number(lockoutMinutes),
        requireTwoFactorDemo: false
      },
      'Aktualizácia bezpečnostných pravidiel',
      `Relácia: ${timeoutMinutes} minút, Max pokusov: ${maxAttempts}`
    );
    setSecuritySuccess(true);
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

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

  const categories = [
    { id: 'all', label: 'Všetky nastavenia' },
    { id: 'stripe', label: 'Platby Stripe' },
    { id: 'salon', label: 'Salón & Kontakt' },
    { id: 'banner', label: 'Oznam na webe' },
    { id: 'bookings', label: 'Rezervácie & Kapacita' },
    { id: 'notifications', label: 'Notifikácie' },
    { id: 'billing', label: 'Fakturácia' },
    { id: 'security', label: 'Zabezpečenie' },
    { id: 'backup', label: 'Záloha & Audit' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="pb-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Systémové nastavenia & Správa salónu
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Komplexná konfigurácia prevádzky salónu Riccardo, platieb Stripe, oznámení, notifikácií, fakturácie a bezpečnosti.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as SettingsCategory)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 1. Stripe Payment Gateway Section */}
      {(activeCategory === 'all' || activeCategory === 'stripe') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-white">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Platobná brána Stripe (Apple Pay & Platobné karty)</h2>
                <p className="text-[11px] text-zinc-400">
                  Konfigurácia produkčných platobných kľúčov pre prijímanie úhrad od zákazníkov.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
              Trvalý živý režim (Live Production)
            </span>
          </div>

          {stripeSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nastavenia Stripe brány boli úspešne uložené a sú okamžite aktívne v pokladni.</span>
            </div>
          )}

          {/* Live Mode Notice */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-zinc-300 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Výhradne živá produkčná prevádzka (Live Mode)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">Aktívne</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Testovací režim bol trvalo vyradený. Všetky transakcie z Apple Pay, Google Pay a platobných kariet prebiehajú v reálnom čase a platby sú pripisované priamo na bankový účet spoločnosti ZETEREM s.r.o.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveStripeGateway} className="space-y-4 text-xs pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">
                  Stripe Publishable Key (pk_live_...)
                </label>
                <input
                  type="text"
                  value={stripePk}
                  onChange={(e) => setStripePk(e.target.value)}
                  placeholder="pk_live_51..."
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 font-mono text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Verejný kľúč použitý na webe pre inicializáciu Stripe.js, Apple Pay a Google Pay.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium flex justify-between">
                  <span>Stripe Secret Key (sk_live_...)</span>
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
                  placeholder="sk_live_51..."
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
      )}

      {/* 2. Salon & Academy Contact Section */}
      {(activeCategory === 'all' || activeCategory === 'salon') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Kontaktné & Prevádzkové údaje salónu</h2>
              <p className="text-[11px] text-zinc-400">
                Oficiálne kontaktné telefóny, email, adresa salónu a otváracie hodiny.
              </p>
            </div>
          </div>

          {salonSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kontaktné a prevádzkové údaje salónu boli úspešne uložené.</span>
            </div>
          )}

          <form onSubmit={handleSaveSalonInfo} className="space-y-4 text-xs pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Hlavný telefón na salón</label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  placeholder="+421 915 869 758"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-500 block">Zobrazuje sa v hlavičke, pätičke a rýchlych hovoroch.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Sekundárny telefón / recepcia</label>
                <input
                  type="text"
                  value={salonSecondaryPhone}
                  onChange={(e) => setSalonSecondaryPhone(e.target.value)}
                  placeholder="+421 908 261 740"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-500 block">Náhradný kontakt pre účastníkov seminárov.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Oficiálny kontaktný email</label>
                <input
                  type="email"
                  value={salonEmail}
                  onChange={(e) => setSalonEmail(e.target.value)}
                  placeholder="hair.riccardo@gmail.com"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-500 block">Verejný email uvádzaný na webe pre dopyty.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Instagram účet / rukoväť</label>
                <input
                  type="text"
                  value={salonInstagram}
                  onChange={(e) => setSalonInstagram(e.target.value)}
                  placeholder="@hair_salon_riccardo"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-500 block">Odkaz na oficiálny instagramový profil Richarda Čonku.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Adresa salónu & ateliéru</label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  placeholder="J. Kármána 1727/30, 984 01 Lučenec"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Otváracie hodiny</label>
                <input
                  type="text"
                  value={salonOpeningHours}
                  onChange={(e) => setSalonOpeningHours(e.target.value)}
                  placeholder="Po – Pia: 09:00 – 18:00, So: Na objednávku"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť údaje salónu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Top Announcement Banner Section */}
      {(activeCategory === 'all' || activeCategory === 'banner') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-white">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Oznamovací banner na vrchu webu</h2>
                <p className="text-[11px] text-zinc-400">
                  Zobrazte dôležité oznámenie, novootvorené termíny alebo limitovanú ponuku na vrchu stránky.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBannerEnabled(!bannerEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  bannerEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${bannerEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                <span>{bannerEnabled ? 'Banner zapnutý' : 'Banner vypnutý'}</span>
              </button>
            </div>
          </div>

          {bannerSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nastavenia oznamovacieho bannera boli úspešne uložené.</span>
            </div>
          )}

          {/* Live Preview */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-850 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Živý náhľad bannera:
            </span>
            <div
              className={`p-2.5 rounded-xl text-center text-xs font-medium flex flex-wrap items-center justify-center gap-2 transition-all ${
                bannerStyle === 'emerald'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800/40'
                  : bannerStyle === 'dark'
                  ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  : 'bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 text-amber-200 border border-amber-800/40'
              }`}
            >
              <span>{bannerText || 'Zadajte text oznámenia nižšie...'}</span>
              {bannerButtonText && (
                <span className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 ml-1">
                  <span>{bannerButtonText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-4 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium block">Text oznámenia</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Nové termíny masterclass seminárov Richarda Čonku 2026 sú v predaji."
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Text tlačidla / odkazu</label>
                <input
                  type="text"
                  value={bannerButtonText}
                  onChange={(e) => setBannerButtonText(e.target.value)}
                  placeholder="Zobraziť termíny"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Cieľový odkaz (URL / kotva)</label>
                <input
                  type="text"
                  value={bannerButtonLink}
                  onChange={(e) => setBannerButtonLink(e.target.value)}
                  placeholder="/seminare"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Vizuálny štýl bannera</label>
                <select
                  value={bannerStyle}
                  onChange={(e) => setBannerStyle(e.target.value as any)}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value="gold">Zlatý luxusný akcent</option>
                  <option value="emerald">Smaragdový akcent</option>
                  <option value="dark">Decentný grafitový</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť nastavenia bannera
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Bookings & Capacity Rules Section */}
      {(activeCategory === 'all' || activeCategory === 'bookings') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Rezervácie, Kapacity & Registračné pravidlá</h2>
              <p className="text-[11px] text-zinc-400">
                Pravidlá nákupu vstupeniek, limity na objednávku a správa čakacej listiny (Waitlist).
              </p>
            </div>
          </div>

          {bookingsSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rezervačné a kapacitné pravidlá boli úspešne uložené.</span>
            </div>
          )}

          <form onSubmit={handleSaveBookings} className="space-y-4 text-xs pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toggle 1: Show seats */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Zobrazovať počet voľných miest verejne</div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Návštevníci uvidia presný počet voľných kresiel na každom seminári.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRemainingSeats(!showRemainingSeats)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    showRemainingSeats ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      showRemainingSeats ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Waitlist */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Povoliť čakaciu listinu (Waitlist)</div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Po vypredaní kapacity sa záujemcovia môžu zapísať ako náhradníci.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableWaitlist(!enableWaitlist)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    enableWaitlist ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      enableWaitlist ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">
                  Držanie miesta v pokladni (minúty)
                </label>
                <select
                  value={checkoutHoldMinutes}
                  onChange={(e) => setCheckoutHoldMinutes(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={10}>10 minút</option>
                  <option value={15}>15 minút (odporúčané)</option>
                  <option value={20}>20 minút</option>
                  <option value={30}>30 minút</option>
                </select>
                <span className="text-[10px] text-zinc-500 block">Doba do uvoľnenia nezaplatenej rezervácie.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">
                  Max vstupeniek na 1 objednávku
                </label>
                <select
                  value={maxTicketsPerOrder}
                  onChange={(e) => setMaxTicketsPerOrder(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={1}>1 vstupenka</option>
                  <option value={2}>2 vstupenky (odporúčané)</option>
                  <option value={4}>4 vstupenky</option>
                  <option value={10}>Bez obmedzenia (10)</option>
                </select>
                <span className="text-[10px] text-zinc-500 block">Zamedzuje hromadným blokáciám miest.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">
                  Výstraha nízkej kapacity (posledné miesta)
                </label>
                <select
                  value={lowCapacityThreshold}
                  onChange={(e) => setLowCapacityThreshold(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={1}>Posledné 1 miesto</option>
                  <option value={2}>Posledné 2 miesta</option>
                  <option value={3}>Posledné 3 miesta</option>
                </select>
                <span className="text-[10px] text-zinc-500 block">Zobrazí zvýraznený badge na webe.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť pravidlá rezervácií
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Notifications & Alerts Section */}
      {(activeCategory === 'all' || activeCategory === 'notifications') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Emailové notifikácie & Systémové alerty</h2>
              <p className="text-[11px] text-zinc-400">
                Nastavenie emailov kam chodia notifikácie a automatických správ pre účastníkov.
              </p>
            </div>
          </div>

          {notificationsSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Notifikačné pravidlá boli úspešne uložené.</span>
            </div>
          )}

          <form onSubmit={handleSaveNotifications} className="space-y-4 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium block">
                Notifikačný email administrátora
              </label>
              <input
                type="text"
                value={adminNotifyEmail}
                onChange={(e) => setAdminNotifyEmail(e.target.value)}
                placeholder="hair.riccardo@gmail.com"
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
              />
              <span className="text-[10px] text-zinc-500 block">
                Na túto adresu chodia okamžité hlásenia o nových platbách a dopytoch od zákazníkov.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="p-3.5 rounded-2xl bg-zinc-950/60 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnNewOrder}
                  onChange={(e) => setNotifyOnNewOrder(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-white">Notifikácia pri novej zaplatenej objednávke</div>
                  <div className="text-[11px] text-zinc-400">Odošle email administrátorovi s údajmi o platbe a účastníkovi.</div>
                </div>
              </label>

              <label className="p-3.5 rounded-2xl bg-zinc-950/60 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnNewInquiry}
                  onChange={(e) => setNotifyOnNewInquiry(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-white">Notifikácia pri novom dopyte z formulára</div>
                  <div className="text-[11px] text-zinc-400">Okamžité upozornenie pri správe z kontaktného formulára.</div>
                </div>
              </label>

              <label className="p-3.5 rounded-2xl bg-zinc-950/60 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendTicketEmailToParticipant}
                  onChange={(e) => setSendTicketEmailToParticipant(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-white">Zaslať elektronickú vstupenku s QR kódom</div>
                  <div className="text-[11px] text-zinc-400">Účastník obdrží potvrdenie s QR kódom pre rýchly check-in na mieste.</div>
                </div>
              </label>

              <label className="p-3.5 rounded-2xl bg-zinc-950/60 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendReminderBeforeSeminar}
                  onChange={(e) => setSendReminderBeforeSeminar(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-white">Pripomienka 48 hodín pred seminárom</div>
                  <div className="text-[11px] text-zinc-400">Automatická organizačná pripomienka účastníkom s inštrukciami k príchodu.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť notifikačné pravidlá
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Invoicing & Legal Section */}
      {(activeCategory === 'all' || activeCategory === 'billing') && (
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Fakturácia & Účtovné náležitosti (ZETEREM s.r.o.)</h2>
              <p className="text-[11px] text-zinc-400">
                Formát číslovania objednávok, splatnosť a legislatívne náležitosti pre daňové doklady.
              </p>
            </div>
          </div>

          {billingSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fakturačné a legislatívne nastavenia boli úspešne uložené.</span>
            </div>
          )}

          <form onSubmit={handleSaveBilling} className="space-y-4 text-xs pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Predčíslie faktúr & dokladov</label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  placeholder="RIC-2026-"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">Napr. RIC-2026-001, RIC-2026-002.</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Fakturačná mena</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full bg-zinc-950/40 text-zinc-400 p-3 rounded-xl border-0 text-xs outline-none font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-500 block">Štandardná mena Slovenskej republiky (EUR).</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Splatnosť dokladov (dní)</label>
                <select
                  value={invoiceDueDays}
                  onChange={(e) => setInvoiceDueDays(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={3}>3 dni</option>
                  <option value={7}>7 dní (odporúčané)</option>
                  <option value={14}>14 dní</option>
                  <option value={30}>30 dní</option>
                </select>
                <span className="text-[10px] text-zinc-500 block">Lehota na úhradu pri zálohových platbách.</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium block">
                Zákonná doložka na faktúre / potvrdení
              </label>
              <textarea
                rows={2}
                value={invoiceNoteText}
                onChange={(e) => setInvoiceNoteText(e.target.value)}
                className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none resize-none"
              />
              <span className="text-[10px] text-zinc-500 block">
                Informácia o DPH statuse spoločnosti ZETEREM s.r.o. podľa zákona o dani z pridanej hodnoty.
              </span>
            </div>

            {/* Corporate Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 uppercase block">Obchodné meno:</span>
                <span className="text-white font-medium block mt-0.5 truncate">{COMPANY_DETAILS.legalName}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 uppercase block">IČO:</span>
                <span className="text-white font-mono block mt-0.5">{COMPANY_DETAILS.ico}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 uppercase block">DIČ:</span>
                <span className="text-white font-mono block mt-0.5">{COMPANY_DETAILS.dic}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 uppercase block">IBAN:</span>
                <span className="text-emerald-400 font-mono text-[11px] block mt-0.5 truncate">{COMPANY_DETAILS.bankAccount.iban}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Uložiť fakturačné nastavenia
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. Access & Security Section */}
      {(activeCategory === 'all' || activeCategory === 'security') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-white" />
              <h2 className="text-sm font-semibold text-white">Zmena administrátorského hesla</h2>
            </div>
            <p className="text-[11px] text-zinc-400">
              Nastavte si nové silné heslo pre zabezpečenie vstupu do administrácie portálu Riccardo.
            </p>

            {passwordSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-2xl bg-red-950/60 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Pôvodné heslo</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Zadajte aktuálne heslo"
                    className="w-full bg-zinc-950/80 text-white p-3 pr-10 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Nové heslo (min. 8 znakov)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Zadajte silné nové heslo"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Potvrdenie nového hesla</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Znova zadajte nové heslo"
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                  />
                  <span>Zobraziť heslá</span>
                </label>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Aktualizovať heslo
                </button>
              </div>
            </form>
          </div>

          {/* Rate Limiting & Session Rules */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              <h2 className="text-sm font-semibold text-white">Pravidlá relácie & Rate-Limiting</h2>
            </div>
            <p className="text-[11px] text-zinc-400">
              Ochrana proti hádanu hesiel (brute-force) a automatické odhlásenie pri nečinnosti.
            </p>

            {securitySuccess && (
              <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bezpečnostné pravidlá relácie boli uložené.</span>
              </div>
            )}

            <form onSubmit={handleSaveSecuritySettings} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Časový limit relácie (nečinnosť)</label>
                <select
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={15}>15 minút (Vysoká bezpečnosť)</option>
                  <option value={30}>30 minút</option>
                  <option value={60}>60 minút (Odporúčané)</option>
                  <option value={120}>2 hodiny</option>
                  <option value={240}>4 hodiny</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Maximálny počet neúspešných prihlásení</label>
                <select
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={3}>3 pokusy (Striktné)</option>
                  <option value={5}>5 pokusov (Štandard)</option>
                  <option value={10}>10 pokusov</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">Doba uzamknutia pri prekročení (Brute-force)</label>
                <select
                  value={lockoutMinutes}
                  onChange={(e) => setLockoutMinutes(Number(e.target.value))}
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl border-0 focus:ring-1 focus:ring-white/20 text-xs outline-none"
                >
                  <option value={5}>5 minút</option>
                  <option value={15}>15 minút (Štandard)</option>
                  <option value={30}>30 minút</option>
                  <option value={60}>60 minút</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Uložiť bezpečnostné pravidlá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Backup, Restore & Audit Section */}
      {(activeCategory === 'all' || activeCategory === 'backup') && (
        <div className="space-y-6">
          {/* Backup & Restore */}
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

          {/* Audit Log */}
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
        </div>
      )}

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
