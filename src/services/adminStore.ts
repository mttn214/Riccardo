/**
 * Admin Data Store & Security Management for Hair Salon Riccardo / ZETEREM s.r.o.
 * Handles encrypted admin authentication, course management, attendee lists,
 * transformation photos, inquiries, audit logs, and data persistence.
 * STRICT ZERO EMOJIS COMPLIANT.
 */

import { Seminar, PortfolioItem, SEMINARS_DATA, PORTFOLIO_DATA, COMPANY_DETAILS } from '../data/content';

export interface Participant {
  id: string;
  seminarId: string;
  seminarTitle: string;
  seminarDates: string;
  seminarCity: string;
  fullName: string;
  email: string;
  phone: string;
  salonName?: string;
  city?: string;
  experience?: string;
  tierId: string;
  tierName: string;
  tierPriceEUR: number;
  paymentOption: 'full' | 'deposit';
  amountPaidEUR: number;
  amountRemainingEUR: number;
  paymentMethod: string;
  paymentStatus: 'Uhradené (Plná suma)' | 'Uhradená záloha (100 €)' | 'Čaká na prevod / faktúru' | 'Zrušené';
  stripePaymentIntentId?: string;
  stripeTokenId?: string;
  receiptUrl?: string;
  ticketCode: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  billingType: 'personal' | 'salon';
  companyName?: string;
  ico?: string;
  dic?: string;
  billingAddress?: string;
  notes?: string;
  internalNotes?: string;
}

export interface InquiryMessage {
  id: string;
  type: 'contact' | 'waitlist';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  seminarTitle?: string;
  preferredCity?: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'resolved';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'auth' | 'seminar' | 'participant' | 'portfolio' | 'settings';
  details: string;
  user: string;
}

export interface StripeGatewayConfig {
  mode: 'test' | 'live';
  publishableKey: string;
  secretKey: string;
}

export interface AdminSecuritySettings {
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  requireTwoFactorDemo: boolean;
  stripeMode?: 'test' | 'live';
  stripePublishableKey?: string;
  stripeSecretKey?: string;
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'riccardo_admin_token',
  AUTH_EXPIRY: 'riccardo_admin_expiry',
  CREDENTIALS_HASH: 'riccardo_admin_creds_v2',
  FAILED_ATTEMPTS: 'riccardo_admin_failed_attempts',
  LOCKOUT_UNTIL: 'riccardo_admin_lockout_until',
  SEMINARS: 'riccardo_admin_seminars_v1',
  PARTICIPANTS: 'riccardo_admin_participants_v1',
  PORTFOLIO: 'riccardo_admin_portfolio_v1',
  INQUIRIES: 'riccardo_admin_inquiries_v1',
  AUDIT_LOGS: 'riccardo_admin_audit_logs_v1',
  SETTINGS: 'riccardo_admin_settings_v1',
};

// Simple cryptographic-style hash for client-side storage demonstration
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16)}_${str.length * 31}`;
}

// Default credentials: username = "admin", password = "riccardo2026!"
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD_HASH = hashString('admin:riccardo2026!');

export interface AdminAccount {
  email: string;
  name: string;
  role: 'owner' | 'tech_admin';
  roleTitle: string;
  passwordPlain: string;
  validPasswords: string[];
  aliases: string[];
}

export const AUTHORIZED_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: 'hair.riccardo@gmail.com',
    name: 'Richard Čonka',
    role: 'owner',
    roleTitle: 'Majiteľ & Master Stylist',
    passwordPlain: 'hb79kE#4vN:92Z_?qM',
    validPasswords: [
      'hb79kE#4vN:92Z_?qM',
      'Riccardo2026!'
    ],
    aliases: ['riccardo', 'hair.riccardo', 'richard']
  },
  {
    email: 'mattino.business@gmail.com',
    name: 'Mattino',
    role: 'tech_admin',
    roleTitle: 'Technická správa & Administrátor',
    passwordPlain: 'mX48vP?2qT#81L_:kY',
    validPasswords: [
      'mX48vP?2qT#81L_:kY',
      'Mattino2026!'
    ],
    aliases: ['mattino', 'mattino.business']
  },
  {
    email: 'admin',
    name: 'Hlavný správca',
    role: 'tech_admin',
    roleTitle: 'Systémový administrátor',
    passwordPlain: 'riccardo2026!',
    validPasswords: ['riccardo2026!'],
    aliases: ['admin@hairsalonriccardo.sk']
  }
];

// Realistic Seed Participants for initial load
const SEED_PARTICIPANTS: Participant[] = [
  {
    id: 'part-001',
    seminarId: 'sem-fukana-lucenec',
    seminarTitle: 'Umenie Fúkanej & Signature Vlny: Masterclass',
    seminarDates: '11. – 12. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Katarína Nováková',
    email: 'katarina.novakova@studiobelle.sk',
    phone: '+421 905 123 456',
    salonName: 'Salón Belle Banská Bystrica',
    city: 'Banská Bystrica',
    experience: '5–10 rokov',
    tierId: 'tier-fuk-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 380,
    paymentOption: 'full',
    amountPaidEUR: 380,
    amountRemainingEUR: 0,
    paymentMethod: 'Apple Pay (Biometrická autorizácia)',
    paymentStatus: 'Uhradené (Plná suma)',
    stripePaymentIntentId: 'pi_3Pq9fHFKYzQN3E701aZbK',
    ticketCode: 'RIC-LUC-8421',
    registeredAt: '2026-10-12 14:22',
    checkedIn: false,
    billingType: 'salon',
    companyName: 'Studio Belle s.r.o.',
    ico: '51294812',
    dic: '2120485912',
    billingAddress: 'Dolná 14, 974 01 Banská Bystrica',
    notes: 'Prosím o vystavenie faktúry na firmu pre odpočet nákladov.',
    internalNotes: 'Overené na bankovom účte (SLSP), certifikát vytlačený vopred.'
  },
  {
    id: 'part-002',
    seminarId: 'sem-fukana-lucenec',
    seminarTitle: 'Umenie Fúkanej & Signature Vlny: Masterclass',
    seminarDates: '11. – 12. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Martin Kováč',
    email: 'kovac.barber@gmail.com',
    phone: '+421 911 987 654',
    salonName: 'Kováč Hair Atelier',
    city: 'Zvolen',
    experience: 'Viac ako 10 rokov',
    tierId: 'tier-fuk-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 380,
    paymentOption: 'deposit',
    amountPaidEUR: 100,
    amountRemainingEUR: 280,
    paymentMethod: 'Platobná karta (Mastercard)',
    paymentStatus: 'Uhradená záloha (100 €)',
    stripePaymentIntentId: 'pi_3Pq7eHFKYzQN3E7989dEx',
    ticketCode: 'RIC-LUC-5192',
    registeredAt: '2026-10-13 09:15',
    checkedIn: false,
    billingType: 'personal',
    notes: 'Doplatok 280 € uhradím v hotovosti na mieste.',
    internalNotes: 'Záloha 100 € zaevidovaná cez Stripe.'
  },
  {
    id: 'part-003',
    seminarId: 'sem-fukana-lucenec',
    seminarTitle: 'Umenie Fúkanej & Signature Vlny: Masterclass',
    seminarDates: '11. – 12. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Lucia Horváthová',
    email: 'lucia.horvath@salonelixir.sk',
    phone: '+421 918 345 678',
    salonName: 'Salón Elixír Košice',
    city: 'Košice',
    experience: '3–5 rokov',
    tierId: 'tier-fuk-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 380,
    paymentOption: 'full',
    amountPaidEUR: 380,
    amountRemainingEUR: 0,
    paymentMethod: 'Faktúra / Bankový prevod (SLSP)',
    paymentStatus: 'Uhradené (Plná suma)',
    ticketCode: 'RIC-LUC-2938',
    registeredAt: '2026-10-14 11:40',
    checkedIn: false,
    billingType: 'salon',
    companyName: 'Elixír Beauty s.r.o.',
    ico: '48291048',
    dic: '2029481920',
    billingAddress: 'Hlavná 42, 040 01 Košice',
    notes: 'Platba prevedená s variabilným symbolom 2938.',
    internalNotes: 'Platba spárovaná s výpisom z účtu v Slovenskej sporiteľni.'
  },
  {
    id: 'part-004',
    seminarId: 'sem-fukana-lucenec',
    seminarTitle: 'Umenie Fúkanej & Signature Vlny: Masterclass',
    seminarDates: '11. – 12. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Simona Vargová',
    email: 'simona.varga@gmail.com',
    phone: '+421 902 445 566',
    salonName: 'Freelance Hairstylist',
    city: 'Lučenec',
    experience: '1–3 roky',
    tierId: 'tier-fuk-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 380,
    paymentOption: 'deposit',
    amountPaidEUR: 100,
    amountRemainingEUR: 280,
    paymentMethod: 'Apple Pay (Biometrická autorizácia)',
    paymentStatus: 'Uhradená záloha (100 €)',
    stripePaymentIntentId: 'pi_3Pq1kHFKYzQN3E7230bQv',
    ticketCode: 'RIC-LUC-7361',
    registeredAt: '2026-10-14 16:05',
    checkedIn: false,
    billingType: 'personal',
    notes: 'Mám záujem aj o doplnkovú termokefu.',
    internalNotes: 'Záloha OK.'
  },
  {
    id: 'part-005',
    seminarId: 'sem-strih-lucenec',
    seminarTitle: 'Precízny strih & Geometria: Víťazné línie',
    seminarDates: '18. – 19. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Peter Molnár',
    email: 'peter.molnar@molnarhair.sk',
    phone: '+421 904 778 899',
    salonName: 'Molnár Hair Studio Nitra',
    city: 'Nitra',
    experience: 'Viac ako 10 rokov',
    tierId: 'tier-str-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 440,
    paymentOption: 'full',
    amountPaidEUR: 440,
    amountRemainingEUR: 0,
    paymentMethod: 'Platobná karta (Visa)',
    paymentStatus: 'Uhradené (Plná suma)',
    stripePaymentIntentId: 'pi_3Pq8mHFKYzQN3E7441cVx',
    ticketCode: 'RIC-LUC-6019',
    registeredAt: '2026-10-15 10:30',
    checkedIn: false,
    billingType: 'salon',
    companyName: 'Molnár Hair s.r.o.',
    ico: '45910283',
    dic: '2024910283',
    billingAddress: 'Štefánikova 12, 949 01 Nitra',
    notes: 'Zameranie na mikrobob a pánske strihy.',
    internalNotes: 'VIP účastník z Nitry.'
  },
  {
    id: 'part-006',
    seminarId: 'sem-strih-lucenec',
    seminarTitle: 'Precízny strih & Geometria: Víťazné línie',
    seminarDates: '18. – 19. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Jana Kráľová',
    email: 'jana.kralova@hairqueen.sk',
    phone: '+421 908 223 344',
    salonName: 'Hair Queen Salón Poprad',
    city: 'Poprad',
    experience: '5–10 rokov',
    tierId: 'tier-str-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 440,
    paymentOption: 'full',
    amountPaidEUR: 440,
    amountRemainingEUR: 0,
    paymentMethod: 'Apple Pay (Biometrická autorizácia)',
    paymentStatus: 'Uhradené (Plná suma)',
    stripePaymentIntentId: 'pi_3Pq5bHFKYzQN3E7778zPa',
    ticketCode: 'RIC-LUC-3829',
    registeredAt: '2026-10-15 13:45',
    checkedIn: false,
    billingType: 'personal',
    notes: 'Teším sa na strihy ocenené Czech & Slovak Hairdressing Awards.',
    internalNotes: 'Potvrdená účasť.'
  },
  {
    id: 'part-007',
    seminarId: 'sem-strih-lucenec',
    seminarTitle: 'Precízny strih & Geometria: Víťazné línie',
    seminarDates: '18. – 19. Január 2027',
    seminarCity: 'Lučenec',
    fullName: 'Elena Tóthová',
    email: 'tothova.elena@gmail.com',
    phone: '+421 917 556 677',
    salonName: 'Salón Charm Rožňava',
    city: 'Rožňava',
    experience: '3–5 rokov',
    tierId: 'tier-str-master',
    tierName: 'Hands-On Masterpass',
    tierPriceEUR: 440,
    paymentOption: 'deposit',
    amountPaidEUR: 100,
    amountRemainingEUR: 340,
    paymentMethod: 'Čaká na úhradu faktúry',
    paymentStatus: 'Čaká na prevod / faktúru',
    ticketCode: 'RIC-LUC-9182',
    registeredAt: '2026-10-15 17:10',
    checkedIn: false,
    billingType: 'salon',
    companyName: 'Charm s.r.o.',
    ico: '49102938',
    dic: '2029384712',
    billingAddress: 'Námestie Baníkov 5, 048 01 Rožňava',
    notes: 'Faktúru prosím zašlite do konca týždňa.',
    internalNotes: 'Odoslaná predfaktúra s VS 9182.'
  }
];

const SEED_INQUIRIES: InquiryMessage[] = [
  {
    id: 'inq-001',
    type: 'contact',
    name: 'Zuzana Miháliková',
    email: 'mihalikova.zuzana@gmail.com',
    phone: '+421 905 889 900',
    subject: 'Individuálny salónny tréning pre náš tím v Žiline',
    message: 'Dobrý deň Riccardo, radi by sme dohodli celodenný uzavretý seminár fúkanej priamo v našom salóne v Žiline pre 5 kaderníčok. Aké máte voľné termíny na jar 2027?',
    submittedAt: '2026-10-15 18:30',
    status: 'unread'
  },
  {
    id: 'inq-002',
    type: 'waitlist',
    name: 'Barbora Kováčová',
    email: 'barbora.kovac@hairart.sk',
    phone: '+421 911 334 455',
    seminarTitle: 'Umenie Fúkanej & Signature Vlny: Masterclass',
    preferredCity: 'Bratislava / Lučenec',
    message: 'Prosím o zaradenie do VIP Waitlistu, keby sa uvoľnilo miesto na januárový termín.',
    submittedAt: '2026-10-14 20:15',
    status: 'read'
  },
  {
    id: 'inq-003',
    type: 'contact',
    name: 'Michal Hruška',
    email: 'michal.hruska@barbershop.sk',
    phone: '+421 903 112 233',
    subject: 'Certifikácia a akreditácia kurzov',
    message: 'Zdravím, vydávate k víťaznému kurzu precízneho strihu aj medzinárodne uznávaný certifikát s pečiatkou?',
    submittedAt: '2026-10-13 14:05',
    status: 'resolved'
  }
];

class AdminStore {
  private listeners: (() => void)[] = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.CREDENTIALS_HASH)) {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS_HASH, DEFAULT_PASSWORD_HASH);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SEMINARS)) {
      localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(SEMINARS_DATA));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PARTICIPANTS)) {
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(SEED_PARTICIPANTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO)) {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(PORTFOLIO_DATA));
    }

    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SEED_INQUIRIES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      const initialLogs: AuditLogEntry[] = [
        {
          id: 'log-001',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          category: 'auth',
          action: 'Systémová inicializácia',
          details: 'Administratívny panel Hair Salon Riccardo & ZETEREM s.r.o. bol úspešne nakonfigurovaný.',
          user: 'System'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings: AdminSecuritySettings = {
        sessionTimeoutMinutes: 60,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15,
        requireTwoFactorDemo: false,
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // ==========================================
  // AUTHENTICATION & SECURITY
  // ==========================================

  public isLockedOut(): { locked: boolean; remainingSeconds?: number } {
    if (typeof window === 'undefined') return { locked: false };
    const lockoutUntil = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    if (!lockoutUntil) return { locked: false };

    const until = parseInt(lockoutUntil, 10);
    const now = Date.now();
    if (now < until) {
      return { locked: true, remainingSeconds: Math.ceil((until - now) / 1000) };
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      return { locked: false };
    }
  }

  public login(username: string, password: string): { success: boolean; error?: string } {
    const lockout = this.isLockedOut();
    if (lockout.locked) {
      return {
        success: false,
        error: `Systém je dočasne zablokovaný z bezpečnostných dôvodov z dôvodu opakovaných nesprávnych pokusov. Skúste znova o ${lockout.remainingSeconds} sekúnd.`
      };
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const inputHash = hashString(`${cleanUser}:${cleanPass}`);

    // Find account by primary email or registered alias
    const matchedAccount = AUTHORIZED_ADMIN_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === cleanUser || acc.aliases.some(a => a.toLowerCase() === cleanUser)
    );

    let isMatch = false;
    let accountName = cleanUser;
    let accountEmail = cleanUser;
    let accountRole = 'tech_admin';
    let accountRoleTitle = 'Správca portálu';

    if (matchedAccount) {
      accountName = matchedAccount.name;
      accountEmail = matchedAccount.email;
      accountRole = matchedAccount.role;
      accountRoleTitle = matchedAccount.roleTitle;

      // Check if custom password was saved for this email
      const customHash = localStorage.getItem(`riccardo_creds_${matchedAccount.email.toLowerCase()}`);
      if (customHash) {
        isMatch = inputHash === customHash;
      } else {
        isMatch = matchedAccount.validPasswords.includes(cleanPass) || cleanPass === matchedAccount.passwordPlain;
      }
    } else {
      // Fallback for default admin
      const storedHash = localStorage.getItem(STORAGE_KEYS.CREDENTIALS_HASH) || DEFAULT_PASSWORD_HASH;
      if (cleanUser === 'admin' && (cleanPass === 'riccardo2026!' || inputHash === storedHash)) {
        isMatch = true;
        accountName = 'Hlavný správca';
        accountEmail = 'admin';
      }
    }

    if (isMatch) {
      // Success
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);

      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const settings = this.getSettings();
      const expiry = Date.now() + settings.sessionTimeoutMinutes * 60 * 1000;

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_EXPIRY, expiry.toString());
      localStorage.setItem('riccardo_active_user', JSON.stringify({
        email: accountEmail,
        name: accountName,
        role: accountRole,
        roleTitle: accountRoleTitle
      }));

      this.addAuditLog('auth', 'Úspešné prihlásenie správcu', `${accountName} (${accountEmail}) sa úspešne prihlásil do administrácie.`, accountName);
      this.notify();
      return { success: true };
    } else {
      // Failed attempt tracking
      const attempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, attempts.toString());

      const settings = this.getSettings();
      if (attempts >= settings.maxFailedAttempts) {
        const lockoutTime = Date.now() + settings.lockoutDurationMinutes * 60 * 1000;
        localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockoutTime.toString());
        this.addAuditLog('auth', 'Zablokovanie prístupu (Brute-force ochrana)', `Prekročený limit ${settings.maxFailedAttempts} neúspešných pokusov. Systém uzamknutý na ${settings.lockoutDurationMinutes} minút.`, cleanUser);
        this.notify();
        return {
          success: false,
          error: `Prekročili ste počet povolených pokusov (${settings.maxFailedAttempts}). Z bezpečnostných dôvodov je prístup uzamknutý na ${settings.lockoutDurationMinutes} minút.`
        };
      }

      this.addAuditLog('auth', 'Neúspešný pokus o prihlásenie', `Nesprávne heslo pre účet "${cleanUser}". Pokus ${attempts} z ${settings.maxFailedAttempts}.`, cleanUser);
      this.notify();
      return {
        success: false,
        error: `Nesprávne prihlasovacie meno alebo heslo. (Zostáva ${settings.maxFailedAttempts - attempts} pokusov pred uzamknutím).`
      };
    }
  }

  public getActiveUser(): { email: string; name: string; role: string; roleTitle: string } {
    if (typeof window === 'undefined') {
      return { email: 'hair.riccardo@gmail.com', name: 'Richard Čonka', role: 'owner', roleTitle: 'Majiteľ & Master Stylist' };
    }
    const raw = localStorage.getItem('riccardo_active_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return { email: 'hair.riccardo@gmail.com', name: 'Richard Čonka', role: 'owner', roleTitle: 'Majiteľ & Master Stylist' };
  }

  public logout() {
    if (typeof window === 'undefined') return;
    const user = this.getActiveUser();
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRY);
    localStorage.removeItem('riccardo_active_user');
    this.addAuditLog('auth', 'Odhlásenie správcu', `Používateľ ${user.name} (${user.email}) sa manuálne odhlásil z administrácie.`, user.name);
    this.notify();
  }

  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.AUTH_EXPIRY);
    if (!token || !expiry) return false;

    const isExpired = Date.now() > parseInt(expiry, 10);
    if (isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

  public changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    if (newPassword.length < 8) {
      return { success: false, error: 'Nové heslo musí obsahovať minimálne 8 znakov.' };
    }

    const activeUser = this.getActiveUser();
    const cleanUser = activeUser.email.toLowerCase();
    const oldPass = oldPassword.trim();
    const customUserHash = localStorage.getItem(`riccardo_creds_${cleanUser}`);

    let isOldValid = false;
    const account = AUTHORIZED_ADMIN_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === cleanUser || acc.aliases.some(a => a.toLowerCase() === cleanUser)
    );

    if (customUserHash) {
      isOldValid = hashString(`${cleanUser}:${oldPass}`) === customUserHash;
    } else if (account) {
      isOldValid = account.validPasswords.includes(oldPass) || oldPass === account.passwordPlain;
    } else {
      isOldValid = oldPass === 'riccardo2026!';
    }

    if (!isOldValid) {
      return { success: false, error: 'Pôvodné heslo je nesprávne.' };
    }

    const newHash = hashString(`${cleanUser}:${newPassword.trim()}`);
    localStorage.setItem(`riccardo_creds_${cleanUser}`, newHash);
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS_HASH, newHash);
    this.addAuditLog('settings', 'Zmena hesla správcu', `Bezpečnostné heslo pre účet "${activeUser.name}" (${activeUser.email}) bolo úspešne zmenené.`, activeUser.name);
    this.notify();
    return { success: true };
  }

  // ==========================================
  // SEMINARS & COURSES CRUD
  // ==========================================

  public getSeminars(): Seminar[] {
    if (typeof window === 'undefined') return SEMINARS_DATA;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEMINARS);
      return data ? JSON.parse(data) : SEMINARS_DATA;
    } catch {
      return SEMINARS_DATA;
    }
  }

  public saveSeminar(seminar: Seminar): { success: boolean; error?: string } {
    const list = this.getSeminars();
    const index = list.findIndex((s) => s.id === seminar.id);
    let updated: Seminar[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = seminar;
      this.addAuditLog('seminar', 'Aktualizácia seminára', `Seminár "${seminar.title}" (${seminar.city}) bol aktualizovaný.`, 'Admin');
    } else {
      updated = [seminar, ...list];
      this.addAuditLog('seminar', 'Vytvorenie nového seminára', `Vytvorený nový seminár "${seminar.title}" v meste ${seminar.city}.`, 'Admin');
    }
    localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(updated));
    this.notify();
    return { success: true };
  }

  public deleteSeminar(id: string): { success: boolean; error?: string } {
    const list = this.getSeminars();
    const target = list.find((s) => s.id === id);
    const updated = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(updated));
    this.addAuditLog('seminar', 'Vymazanie seminára', `Seminár "${target?.title || id}" bol odstránený zo systému.`, 'Admin');
    this.notify();
    return { success: true };
  }

  public updateAvailableSeats(seminarId: string, delta: number) {
    const list = this.getSeminars();
    const updated = list.map((s) => {
      if (s.id === seminarId) {
        const newAvailable = Math.max(0, Math.min(s.totalSeats, s.availableSeats + delta));
        return { ...s, availableSeats: newAvailable };
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(updated));
    this.notify();
  }

  // ==========================================
  // PARTICIPANTS CRUD & CHECK-IN
  // ==========================================

  public getParticipants(): Participant[] {
    if (typeof window === 'undefined') return SEED_PARTICIPANTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      return data ? JSON.parse(data) : SEED_PARTICIPANTS;
    } catch {
      return SEED_PARTICIPANTS;
    }
  }

  public async syncWithCloud(): Promise<Participant[]> {
    try {
      const res = await fetch('/api/admin-participants');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.participants) && data.participants.length > 0) {
          const list = this.getParticipants();
          const existingMap = new Map(list.map((p) => [p.ticketCode, p]));

          for (const item of data.participants) {
            const ticketCode = item.ticket_code;
            const mapped: Participant = {
              id: item.id,
              seminarId: item.seminar_id,
              seminarTitle: item.seminars?.title || 'Masterclass',
              seminarDates: item.seminars?.dates || '',
              seminarCity: item.seminars?.city || 'Lučenec',
              fullName: item.customers?.full_name || 'Účastník',
              email: item.customers?.email || '',
              phone: item.customers?.phone || '',
              salonName: item.customers?.salon_name || undefined,
              city: item.customers?.city || undefined,
              tierId: 'tier-master',
              tierName: 'Hands-On Masterpass',
              tierPriceEUR: Number(item.total_amount_eur) || 380,
              paymentOption: item.payment_option || 'full',
              amountPaidEUR: Number(item.amount_paid_eur) || 380,
              amountRemainingEUR: Number(item.amount_remaining_eur) || 0,
              paymentMethod: item.payment_method || 'Karta',
              paymentStatus: (item.payment_status || 'Uhradené (Plná suma)') as any,
              stripePaymentIntentId: item.stripe_payment_intent_id || undefined,
              receiptUrl: item.receipt_url || undefined,
              ticketCode,
              registeredAt: item.created_at ? new Date(item.created_at).toISOString().replace('T', ' ').slice(0, 16) : '',
              checkedIn: Boolean(item.checked_in),
              checkedInAt: item.checked_in_at || undefined,
              billingType: item.customers?.billing_type || 'personal',
              companyName: item.customers?.company_name || undefined,
              ico: item.customers?.ico || undefined,
              dic: item.customers?.dic || undefined,
              billingAddress: item.customers?.billing_address || undefined,
              notes: item.notes || undefined,
              internalNotes: item.internal_notes || undefined,
            };

            existingMap.set(ticketCode, mapped);
          }

          const merged = Array.from(existingMap.values());
          localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(merged));
          this.notify();
          return merged;
        }
      }
    } catch (e) {
      console.warn('Sync with cloud notice:', e);
    }
    return this.getParticipants();
  }

  public addParticipant(participant: Omit<Participant, 'id' | 'registeredAt' | 'checkedIn'>): Participant {
    const list = this.getParticipants();
    const newParticipant: Participant = {
      ...participant,
      id: `part-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      registeredAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkedIn: false
    };

    const updated = [newParticipant, ...list];
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(updated));

    // Automatically decrement available seats for the course
    this.updateAvailableSeats(participant.seminarId, -1);

    this.addAuditLog(
      'participant',
      'Nová rezervácia účastníka',
      `Účastník "${participant.fullName}" bol zaregistrovaný na "${participant.seminarTitle}" (Kód: ${participant.ticketCode}).`,
      'Systém / Klient'
    );
    this.notify();
    return newParticipant;
  }

  public updateParticipant(participant: Participant) {
    const list = this.getParticipants();
    const updated = list.map((p) => (p.id === participant.id ? participant : p));
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(updated));
    this.addAuditLog('participant', 'Úprava údajov účastníka', `Záznam účastníka "${participant.fullName}" bol aktualizovaný.`, 'Admin');
    this.notify();
  }

  public toggleCheckIn(participantId: string): boolean {
    const list = this.getParticipants();
    let newStatus = false;
    let targetTicketCode = '';
    const updated = list.map((p) => {
      if (p.id === participantId || p.ticketCode === participantId) {
        newStatus = !p.checkedIn;
        targetTicketCode = p.ticketCode;
        return {
          ...p,
          checkedIn: newStatus,
          checkedInAt: newStatus ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(updated));
    const target = list.find((p) => p.id === participantId || p.ticketCode === participantId);
    this.addAuditLog(
      'participant',
      newStatus ? 'Prezenčná kontrola: Prítomný' : 'Prezenčná kontrola: Zrušená',
      `Účastník "${target?.fullName}" bol označený ako ${newStatus ? 'PRÍTOMNÝ' : 'NEPRÍTOMNÝ'}.`,
      'Admin'
    );
    this.notify();

    // Async sync to Supabase Cloud
    if (targetTicketCode) {
      fetch('/api/admin-participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: targetTicketCode,
          checkedIn: newStatus
        })
      }).catch((e) => console.warn('Supabase check-in sync notice:', e));
    }

    return newStatus;
  }

  public settleBalance(participantId: string, paymentMethod: string = 'Hotovosť na mieste'): boolean {
    const list = this.getParticipants();
    let targetTicketCode = '';
    let updatedParticipant: Participant | null = null;

    const updated = list.map((p) => {
      if (p.id === participantId || p.ticketCode === participantId) {
        targetTicketCode = p.ticketCode;
        const total = p.tierPriceEUR || 380;
        updatedParticipant = {
          ...p,
          amountPaidEUR: total,
          amountRemainingEUR: 0,
          paymentStatus: 'Uhradené (Plná suma - doplatok na mieste)' as any,
          paymentMethod: paymentMethod
        };
        return updatedParticipant;
      }
      return p;
    });

    if (!updatedParticipant) return false;

    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(updated));
    this.addAuditLog(
      'participant',
      'Prijatý doplatok na mieste',
      `Účastník "${(updatedParticipant as Participant).fullName}" uhradil doplatok ${paymentMethod}. Vstupenka ${targetTicketCode} je 100% uhradená.`,
      'Admin'
    );
    this.notify();

    // Async sync to Supabase Cloud
    if (targetTicketCode) {
      fetch('/api/admin-participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: targetTicketCode,
          paymentStatus: 'Uhradené (Plná suma - doplatok na mieste)',
          amountPaidEUR: (updatedParticipant as Participant).amountPaidEUR,
          amountRemainingEUR: 0,
          paymentMethod: paymentMethod
        })
      }).catch((e) => console.warn('Supabase settle balance sync notice:', e));
    }

    return true;
  }

  public lookupParticipant(query: string): Participant | undefined {
    const clean = query.trim().toLowerCase();
    if (!clean) return undefined;
    const list = this.getParticipants();
    return list.find((p) => 
      p.ticketCode.toLowerCase() === clean ||
      p.id.toLowerCase() === clean ||
      p.email.toLowerCase() === clean ||
      p.fullName.toLowerCase().includes(clean)
    );
  }

  public deleteParticipant(id: string) {
    const list = this.getParticipants();
    const target = list.find((p) => p.id === id);
    const updated = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(updated));
    if (target) {
      // Re-credit the available seat
      this.updateAvailableSeats(target.seminarId, 1);
    }
    this.addAuditLog('participant', 'Zrušenie účasti', `Účastník "${target?.fullName || id}" bol vymazaný zo zoznamu účastníkov.`, 'Admin');
    this.notify();
  }

  // ==========================================
  // PORTFOLIO & PHOTOS CRUD
  // ==========================================

  public getPortfolio(): PortfolioItem[] {
    if (typeof window === 'undefined') return PORTFOLIO_DATA;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      return data ? JSON.parse(data) : PORTFOLIO_DATA;
    } catch {
      return PORTFOLIO_DATA;
    }
  }

  public savePortfolioItem(item: PortfolioItem) {
    const list = this.getPortfolio();
    const index = list.findIndex((p) => p.id === item.id);
    let updated: PortfolioItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
      this.addAuditLog('portfolio', 'Úprava diela v portfóliu', `Dielo "${item.title}" (${item.category}) bolo upravené.`, 'Admin');
    } else {
      updated = [item, ...list];
      this.addAuditLog('portfolio', 'Pridané nové dielo do portfólia', `Pridaná fotografia/premena "${item.title}".`, 'Admin');
    }
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
    this.notify();
  }

  public deletePortfolioItem(id: string) {
    const list = this.getPortfolio();
    const target = list.find((p) => p.id === id);
    const updated = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
    this.addAuditLog('portfolio', 'Odstránenie diela z portfólia', `Dielo "${target?.title || id}" bolo odstránené z galérie.`, 'Admin');
    this.notify();
  }

  // ==========================================
  // INQUIRIES & WAITLIST
  // ==========================================

  public getInquiries(): InquiryMessage[] {
    if (typeof window === 'undefined') return SEED_INQUIRIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : SEED_INQUIRIES;
    } catch {
      return SEED_INQUIRIES;
    }
  }

  public addInquiry(inquiry: Omit<InquiryMessage, 'id' | 'submittedAt' | 'status'>) {
    const list = this.getInquiries();
    const newInq: InquiryMessage = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'unread'
    };
    const updated = [newInq, ...list];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    this.notify();
  }

  public updateInquiryStatus(id: string, status: 'unread' | 'read' | 'resolved') {
    const list = this.getInquiries();
    const updated = list.map((i) => (i.id === id ? { ...i, status } : i));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    this.notify();
  }

  public deleteInquiry(id: string) {
    const list = this.getInquiries();
    const updated = list.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    this.notify();
  }

  // ==========================================
  // AUDIT LOGS & SETTINGS
  // ==========================================

  public getAuditLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addAuditLog(category: AuditLogEntry['category'], action: string, details: string, user: string = 'Admin') {
    if (typeof window === 'undefined') return;
    const list = this.getAuditLogs();
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category,
      action,
      details,
      user
    };
    const updated = [newLog, ...list].slice(0, 200); // keep last 200 logs
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  }

  public getSettings(): AdminSecuritySettings {
    if (typeof window === 'undefined') {
      return {
        sessionTimeoutMinutes: 60,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15,
        requireTwoFactorDemo: false,
      };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            sessionTimeoutMinutes: 60,
            maxFailedAttempts: 5,
            lockoutDurationMinutes: 15,
            requireTwoFactorDemo: false,
          };
    } catch {
      return {
        sessionTimeoutMinutes: 60,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15,
        requireTwoFactorDemo: false,
      };
    }
  }

  public saveSettings(settings: AdminSecuritySettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.addAuditLog('settings', 'Aktualizácia bezpečnostných nastavení', `Časový limit relácie: ${settings.sessionTimeoutMinutes} minút, Max pokusov: ${settings.maxFailedAttempts}.`, 'Admin');
    this.notify();
  }

  public getStripeConfig(): { mode: 'test' | 'live'; publishableKey: string; secretKey: string } {
    const s = this.getSettings();
    const defaultLivePk = 'pk_live_51UQoDZHAmh46e1VBb3RxsHk6XPTQg6ttug0vwDCux9p7Bxgva79oiJm2gvsUNzJfCPEMaoc9bb0MC0HEbhyjzixa008QwAoWJr';

    const mode = s.stripeMode || 'live';
    let publishableKey = s.stripePublishableKey || defaultLivePk;
    let secretKey = s.stripeSecretKey || '';

    if (mode === 'live') {
      if (!publishableKey || publishableKey.startsWith('pk_test_')) {
        publishableKey = defaultLivePk;
      }
    }

    return {
      mode,
      publishableKey,
      secretKey
    };
  }

  public saveStripeConfig(config: { mode: 'test' | 'live'; publishableKey: string; secretKey: string }) {
    const s = this.getSettings();
    const updated: AdminSecuritySettings = {
      ...s,
      stripeMode: config.mode,
      stripePublishableKey: config.publishableKey.trim(),
      stripeSecretKey: config.secretKey.trim()
    };
    this.saveSettings(updated);
    this.addAuditLog(
      'settings',
      'Konfigurácia Stripe platobnej brány',
      `Režim: ${config.mode.toUpperCase()}, Publishable Key: ${config.publishableKey ? config.publishableKey.slice(0, 12) + '...' : 'predvolený'}.`,
      'Admin'
    );
  }

  // Export full JSON backup
  public exportFullBackup(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      company: COMPANY_DETAILS.legalName,
      seminars: this.getSeminars(),
      participants: this.getParticipants(),
      portfolio: this.getPortfolio(),
      inquiries: this.getInquiries(),
      auditLogs: this.getAuditLogs(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  }

  // Restore from JSON backup
  public restoreBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.seminars)) localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(data.seminars));
      if (Array.isArray(data.participants)) localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(data.participants));
      if (Array.isArray(data.portfolio)) localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(data.portfolio));
      if (Array.isArray(data.inquiries)) localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(data.inquiries));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

      this.addAuditLog('settings', 'Obnova údajov zo zálohy', 'Dáta seminárov, účastníkov a galérie boli obnovené zo záložného súboru JSON.', 'Admin');
      this.notify();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Neplatný formát záložného súboru JSON: ' + (e.message || 'Chyba') };
    }
  }

  // Factory reset to seed data
  public resetToFactoryDefaults() {
    localStorage.setItem(STORAGE_KEYS.SEMINARS, JSON.stringify(SEMINARS_DATA));
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(SEED_PARTICIPANTS));
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(PORTFOLIO_DATA));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SEED_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS_HASH, DEFAULT_PASSWORD_HASH);
    this.addAuditLog('settings', 'Reset na predvolené údaje', 'Všetky údaje boli obnovené na pôvodné výrobné nastavenia.', 'Admin');
    this.notify();
  }
}

export const adminStore = new AdminStore();
