import React, { useState, useEffect } from 'react';
import { Seminar, SEMINARS_DATA } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import {
  X,
  Calendar,
  MapPin,
  Download,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Check,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  initialSeminar?: Seminar | null;
  initialTierId?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  currency,
  initialSeminar,
  initialTierId,
}) => {
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar>(
    initialSeminar || SEMINARS_DATA[0]
  );
  
  const [selectedTierId, setSelectedTierId] = useState<string>(
    initialTierId || selectedSeminar.tiers[1]?.id || selectedSeminar.tiers[0].id
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [formData, setFormData] = useState({
    fullName: '',
    salonName: '',
    city: '',
    email: '',
    phone: '',
    experience: 'Pokročilý stylista (3-7 rokov)',
    billingType: 'salon',
    ico: '',
    dic: '',
    notes: '',
  });

  const [addOnBrush, setAddOnBrush] = useState(false);
  const [addOnAudit, setAddOnAudit] = useState(false);

  const [confirmationCode, setConfirmationCode] = useState('');

  useEffect(() => {
    if (initialSeminar) {
      setSelectedSeminar(initialSeminar);
      setSelectedTierId(
        initialTierId || initialSeminar.tiers[1]?.id || initialSeminar.tiers[0].id
      );
    }
  }, [initialSeminar, initialTierId]);

  useEffect(() => {
    if (step === 5) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#a1a1aa', '#52525b']
      });
    }
  }, [step]);

  if (!isOpen) return null;

  const currentTier =
    selectedSeminar.tiers.find((t) => t.id === selectedTierId) ||
    selectedSeminar.tiers[0];

  const brushPrice = 38;
  const auditPrice = 65;

  let totalPriceEUR = currentTier.priceEUR;
  if (addOnBrush) totalPriceEUR += brushPrice;
  if (addOnAudit) totalPriceEUR += auditPrice;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert('Vyplňte povinné polia: Meno, Email a Telefón.');
        return;
      }
    }
    if (step === 4) {
      const randomId = `RIC-${selectedSeminar.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmationCode(randomId);
      setStep(5);
      return;
    }
    setStep((prev) => (prev + 1) as any);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hair Salon Riccardo//Masterclass Reservations//SK
BEGIN:VEVENT
SUMMARY:${selectedSeminar.title} - Hair Salon Riccardo
DESCRIPTION:Seminár s Richardom Čonkom. Miesto: ${selectedSeminar.venue}, ${selectedSeminar.city}. Kód rezervácie: ${confirmationCode}
LOCATION:${selectedSeminar.venue}, ${selectedSeminar.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedSeminar.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl text-white">
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium block">
              Rezervácia seminára
            </span>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              {step === 5 ? 'Rezervácia potvrdená' : selectedSeminar.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 5 && (
          <div className="px-6 py-3 border-b border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
            <span className={step === 1 ? 'text-white font-medium' : ''}>1. Variant</span>
            <span className="text-zinc-700">/</span>
            <span className={step === 2 ? 'text-white font-medium' : ''}>2. Účastník</span>
            <span className="text-zinc-700">/</span>
            <span className={step === 3 ? 'text-white font-medium' : ''}>3. Doplnky</span>
            <span className="text-zinc-700">/</span>
            <span className={step === 4 ? 'text-white font-medium' : ''}>4. Prehľad</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* STEP 1: Select Seminar & Tier */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 block mb-2 font-medium">
                  Seminár a lokalita:
                </label>
                <select
                  value={selectedSeminar.id}
                  onChange={(e) => {
                    const found = SEMINARS_DATA.find((s) => s.id === e.target.value);
                    if (found) {
                      setSelectedSeminar(found);
                      setSelectedTierId(found.tiers[1]?.id || found.tiers[0].id);
                    }
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                >
                  {SEMINARS_DATA.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.title} – {sem.city} ({sem.dates})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 block mb-3 font-medium">
                  Typ vstupenky:
                </label>
                <div className="space-y-3">
                  {selectedSeminar.tiers.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        selectedTierId === tier.id
                          ? 'bg-zinc-900 border-white'
                          : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">
                            {tier.name}
                          </h4>
                          {tier.recommended && (
                            <span className="px-2 py-0.5 text-[9px] font-semibold bg-white text-black rounded-full">
                              Odporúčané
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{tier.description}</p>
                      </div>
                      <span className="text-xl font-semibold text-white whitespace-nowrap">
                        {formatPrice(tier.priceEUR, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Attendee Info */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Meno a priezvisko *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Meno a priezvisko"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vas@email.sk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Telefón *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+421 9xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Názov salónu / Mesto
                  </label>
                  <input
                    type="text"
                    placeholder="Názov salónu"
                    value={formData.salonName}
                    onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Dĺžka kaderníckej praxe:
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                >
                  <option>Začiatočník (do 2 rokov)</option>
                  <option>Pokročilý stylista (3-7 rokov)</option>
                  <option>Senior stylista (8+ rokov)</option>
                  <option>Majiteľ salónu</option>
                </select>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={formData.billingType === 'salon'}
                      onChange={() => setFormData({ ...formData, billingType: 'salon' })}
                    />
                    <span>Faktúra na IČO (Náklad pre salón)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={formData.billingType === 'private'}
                      onChange={() => setFormData({ ...formData, billingType: 'private' })}
                    />
                    <span>Súkromná osoba</span>
                  </label>
                </div>

                {formData.billingType === 'salon' && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <input
                      type="text"
                      placeholder="IČO"
                      value={formData.ico}
                      onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                      className="bg-zinc-950 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="DIČ / IČ DPH"
                      value={formData.dic}
                      onChange={(e) => setFormData({ ...formData, dic: e.target.value })}
                      className="bg-zinc-950 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons */}
          {step === 3 && (
            <div className="space-y-4">
              <span className="text-xs text-zinc-400 block mb-2">
                Voliteľné zvýhodnené balíčky k semináru:
              </span>

              <div
                onClick={() => setAddOnBrush(!addOnBrush)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  addOnBrush
                    ? 'bg-zinc-900 border-white'
                    : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${
                      addOnBrush ? 'bg-white border-white text-black' : 'border-zinc-700'
                    }`}
                  >
                    {addOnBrush && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Termálna kefa Riccardo 45mm
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Ikonická kefa na 'Umenie fúkanej' vyvinutá pre perfektný ťah.
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">
                  +{formatPrice(brushPrice, currency)}
                </span>
              </div>

              <div
                onClick={() => setAddOnAudit(!addOnAudit)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  addOnAudit
                    ? 'bg-zinc-900 border-white'
                    : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${
                      addOnAudit ? 'bg-white border-white text-black' : 'border-zinc-700'
                    }`}
                  >
                    {addOnAudit && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      30-minútový online audit po seminári
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Individuálny hovor s Richardom Čonkom pre vyhodnotenie pokroku.
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">
                  +{formatPrice(auditPrice, currency)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-3">
                <div className="flex justify-between items-baseline border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {selectedSeminar.title}
                    </h4>
                    <span className="text-xs text-zinc-400">
                      {selectedSeminar.city} • {selectedSeminar.dates} ({currentTier.name})
                    </span>
                  </div>
                  <span className="text-base font-semibold text-white">
                    {formatPrice(currentTier.priceEUR, currency)}
                  </span>
                </div>

                {(addOnBrush || addOnAudit) && (
                  <div className="space-y-1 text-xs text-zinc-400 border-b border-zinc-800 pb-3">
                    {addOnBrush && (
                      <div className="flex justify-between">
                        <span>Termálna kefa Riccardo</span>
                        <span>{formatPrice(brushPrice, currency)}</span>
                      </div>
                    )}
                    {addOnAudit && (
                      <div className="flex justify-between">
                        <span>Online audit s Richardom</span>
                        <span>{formatPrice(auditPrice, currency)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm text-zinc-300">Spolu:</span>
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(totalPriceEUR, currency)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed">
                Účastník: <strong className="text-white">{formData.fullName}</strong> ({formData.email}, {formData.phone}).
              </div>
            </div>
          )}

          {/* STEP 5: Ticket & Confirmation */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium block mb-1">
                  Rezervácia dokončená
                </span>
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  Tešíme sa na vás, {formData.fullName}.
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Potvrdenie a podrobné inštrukcie boli odoslané na váš email.
                </p>
              </div>

              {/* Minimal Monochrome Ticket Card */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-left space-y-4">
                <div className="flex justify-between items-baseline border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-white uppercase block">
                      RICCARDO ACADEMY
                    </span>
                    <span className="text-[11px] text-zinc-500">Oficiálna akreditácia</span>
                  </div>
                  <span className="font-mono text-xs text-zinc-300 font-medium">
                    {confirmationCode}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Seminár</span>
                    <strong className="text-sm text-white font-medium">
                      {selectedSeminar.title}
                    </strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Dátum</span>
                      <span>{selectedSeminar.dates}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Miesto</span>
                      <span>{selectedSeminar.city}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Účastník</span>
                    <span>{formData.fullName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-white" />
                    <span className="text-[10px] text-zinc-500">Platná vstupenka</span>
                  </div>
                  <span className="text-lg font-semibold text-white">
                    {formatPrice(totalPriceEUR, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={handleDownloadCalendar}
                  className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Apple / Outlook (.ics)</span>
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedSeminar.title + ' — Hair Salon Riccardo')}&details=${encodeURIComponent('Masterclass s Richardom Čonkom. Kód rezervácie: ' + confirmationCode + '. Vstupenka bola potvrdená.')}&location=${encodeURIComponent(selectedSeminar.venue + ', Lučenec')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Google Kalendár</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-zinc-850 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Pokračovať</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Potvrdiť rezerváciu ({formatPrice(totalPriceEUR, currency)})
            </button>
          )}

          {step === 5 && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-medium transition-colors ml-auto"
            >
              Zavrieť
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
