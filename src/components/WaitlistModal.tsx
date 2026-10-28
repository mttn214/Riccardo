import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, Bell, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendFormNotification } from '../services/formService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredTopic?: string;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  preferredTopic = 'Signature Styling'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salonCity, setSalonCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [topic, setTopic] = useState(preferredTopic);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await sendFormNotification({
      formType: 'VIP Waitlist',
      name,
      email,
      phone,
      'Mesto / Salón': salonCity || 'Neuvedené',
      'Instagram profil': instagram || 'Neuvedené',
      'Preferovaná téma masterclassu': topic
    });

    setLoading(false);
    setIsSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#e4e4e7', '#a1a1aa']
    });
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setSalonCity('');
    setInstagram('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          aria-label="Zavrieť"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-zinc-750 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block mb-2">
                Prednostná registrácia potvrdená
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Ste na VIP zozname.
              </h3>
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                Ďakujeme, <strong>{name}</strong>. Hneď po otvorení nového turnusu masterclassu obdržíte súkromnú pozvánku na <strong>{email}</strong> a SMS o <strong>24 hodín skôr</strong>, než bude zverejnená na sociálnych sieťach.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 text-left text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Zvolená téma:</span>
                <span className="text-white font-medium">{topic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Mesto / Salón:</span>
                <span className="text-white font-medium">{salonCity || 'Kadernícky špecialista'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Kapacita termínu:</span>
                <span className="text-emerald-400 font-mono font-medium">Striktne max 6 miest</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all shadow-lg"
            >
              Hotovo, ďakujem
            </button>
          </div>
        ) : (
          <div className="p-7 sm:p-10">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-amber-400 mb-3">
                <Bell className="w-3.5 h-3.5" />
                <span>Early-Access • 24h predpredaj</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                VIP Čakacia listina
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Keďže masterclassy prebiehajú iba 1× za 1–2 mesiace pre striktne 6 kaderníkov, miesta sa vypredávajú v priebehu hodín. Zapíšte sa a získajte prednostné právo na rezerváciu.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Meno a priezvisko *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="napr. Michaela Kováčová"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.sk"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Telefón (SMS predpredaj) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+421 9..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Váš salón / Mesto
                  </label>
                  <input
                    type="text"
                    value={salonCity}
                    onChange={(e) => setSalonCity(e.target.value)}
                    placeholder="napr. Studio Velvet, Žilina"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Instagram profil (voliteľné)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@vas_salon"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Preferovaná téma masterclassu
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                >
                  <option value="Signature Styling Masterclass">Signature Styling: Architektúra objemu (1 deň)</option>
                  <option value="Precízny strih & Geometria">Precízny strih & Geometria (2 dni)</option>
                  <option value="Balayage Alchemy & Blond tóny">Balayage Alchemy & AirTouch (2 dni)</option>
                  <option value="Všetky témy (Chcem notifikáciu na akýkoľvek drop)">Všetky témy (Chcem notifikáciu na akýkoľvek drop)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registrujem do VIP listiny...</span>
                  ) : (
                    <>
                      <span>Zaradiť na VIP čakaciu listinu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nulový spam. Iba 1 súkromná správa pri otvorení nového termínu.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
