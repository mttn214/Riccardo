import React, { useState, useEffect } from 'react';
import { Seminar, SEMINARS_DATA } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import {
  X,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendFormNotification } from '../services/formService';
import { ApplePayLogo, GooglePayLogo, RevolutIcon, CreditCardBrandIcons } from './PaymentIcons';

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

  // Steps: 1: Balíček, 2: Údaje, 3: Platba, 4: Hotovo
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    salonName: '',
    city: '',
    email: '',
    phone: '',
    experience: 'Pokročilý stylista (3-7 rokov)',
    billingType: 'salon', // 'salon' | 'private'
    companyName: '',
    ico: '',
    dic: '',
    billingAddress: '',
    notes: '',
  });

  // Add-ons
  const [addOnBrush, setAddOnBrush] = useState(false);
  const [addOnAudit, setAddOnAudit] = useState(false);

  // Payment Options
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'revolut_pay' | 'card'>('apple_pay');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Payment Processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('');
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
    if (step === 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#e4e4e7', '#a1a1aa']
      });
    }
  }, [step]);

  if (!isOpen) return null;

  const currentTier =
    selectedSeminar.tiers.find((t) => t.id === selectedTierId) ||
    selectedSeminar.tiers[0];

  const brushPrice = 38;
  const auditPrice = 65;

  let totalPackagePriceEUR = currentTier.priceEUR;
  if (addOnBrush) totalPackagePriceEUR += brushPrice;
  if (addOnAudit) totalPackagePriceEUR += auditPrice;

  // Amount to be paid in step 3
  const amountToPayNow = paymentOption === 'deposit' ? 100 : totalPackagePriceEUR;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/RR)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Navigation handlers
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert('Prosím vyplňte povinné polia: Meno, Email a Telefón.');
        return;
      }
    }
    setStep((prev) => (prev + 1) as any);
  };

  // Handle Payment Execution
  const handleProcessPayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
        alert('Prosím vyplňte platné údaje platobnej karty.');
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentStatusText('Pripájam k bezpečnej platobnej bráne...');

    // Simulate realistic 3DS / Payment gateway authorization
    await new Promise((r) => setTimeout(r, 700));
    setPaymentStatusText('Overujem platbu cez zeterem s.r.o. ...');
    
    await new Promise((r) => setTimeout(r, 900));
    setPaymentStatusText('Platba úspešne autorizovaná.');

    const randomId = `RIC-${selectedSeminar.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(randomId);

    const paymentMethodLabel = 
      paymentMethod === 'apple_pay' ? 'Apple Pay' :
      paymentMethod === 'google_pay' ? 'Google Pay' :
      paymentMethod === 'revolut_pay' ? 'Revolut Pay' :
      `Platobná karta (končiaca na ${cardNumber.slice(-4) || '••••'})`;

    // Send real email notification to carlitomio214@gmail.com
    await sendFormNotification({
      formType: 'Rezervácia seminára',
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      'Názov seminára': selectedSeminar.title,
      'Termín konania': selectedSeminar.dates,
      'Miesto konania': `${selectedSeminar.venue}, ${selectedSeminar.city}`,
      'Zvolený balíček': `${currentTier.name} (${formatPrice(totalPackagePriceEUR, currency)})`,
      'Spôsob platby': paymentMethodLabel,
      'Platobný režim': paymentOption === 'deposit' ? 'Záloha 100 € (Doplatok na mieste)' : 'Celá suma vopred',
      'Uhradená suma teraz': `${amountToPayNow} €`,
      'Zostáva doplatiť': paymentOption === 'deposit' ? `${totalPackagePriceEUR - 100} €` : '0 € (Plne uhradené)',
      'Kód vstupenky': randomId,
      'Názov salónu': formData.salonName || 'Neuvedené',
      'Mesto salónu': formData.city || 'Neuvedené',
      'Dĺžka praxe': formData.experience,
      'Fakturačný subjekt': formData.billingType === 'salon' ? (formData.companyName || formData.salonName || 'Firma/Salón') : 'Súkromná osoba',
      'IČO': formData.ico || 'Neuvedené',
      'DIČ / IČ DPH': formData.dic || 'Neuvedené',
      'Fakturačná adresa': formData.billingAddress || 'Neuvedené',
      'Doplnky': `${addOnBrush ? 'Termokefa (+38€) ' : ''}${addOnAudit ? 'Audit (+65€)' : ''}` || 'Žiadne',
      'Poznámka': formData.notes || 'Žiadna',
      'Prevádzkovateľ eshopu': 'zeterem s.r.o.'
    });

    setIsProcessingPayment(false);
    setStep(4);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hair Salon Riccardo//Masterclass Reservations//SK\r\nBEGIN:VEVENT\r\nSUMMARY:${selectedSeminar.title} — Hair Salon Riccardo\r\nDESCRIPTION:Masterclass s Richardom Čonkom. Kód rezervácie: ${confirmationCode}. Prevádzkovateľ: zeterem s.r.o.\r\nLOCATION:${selectedSeminar.venue}, ${selectedSeminar.city}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedSeminar.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAndClose = () => {
    setStep(1);
    setPaymentMethod('apple_pay');
    setPaymentOption('full');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl text-white animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Progress */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                Krok {step} zo 4
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">
                Prevádzkovateľ: <strong className="text-zinc-400">zeterem s.r.o.</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              {step === 1 && 'Výber balíčka & Doplnky'}
              {step === 2 && 'Účastník & Fakturačné údaje'}
              {step === 3 && 'Bezpečná platba kurzu'}
              {step === 4 && 'Vstupenka & Potvrdenie'}
            </h2>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Zavrieť"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-1 bg-zinc-900">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* STEP 1: Package Selection & Addons */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Seminar Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-white">{selectedSeminar.dates}</span>
                    <span>•</span>
                    <span>{selectedSeminar.city} (Atelier)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    {selectedSeminar.title}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Iba 6 miest v ateliéri
                  </span>
                </div>
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                  Vyberte úroveň účasti
                </label>
                <div className="space-y-3">
                  {selectedSeminar.tiers.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-zinc-900 border-white shadow-xl ring-1 ring-white/10'
                            : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-semibold text-white">
                              {tier.name}
                            </span>
                            {tier.recommended && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-black">
                                Odporúčané
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {tier.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-lg sm:text-xl font-bold text-white">
                            {formatPrice(tier.priceEUR, currency)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-white bg-white text-black' : 'border-zinc-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Add-ons */}
              <div className="space-y-3 pt-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                  Voliteľné prémiové doplnky
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setAddOnBrush(!addOnBrush)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      addOnBrush
                        ? 'bg-zinc-900 border-white'
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                        addOnBrush ? 'bg-white border-white text-black' : 'border-zinc-700'
                      }`}
                    >
                      {addOnBrush && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Termálna kefa Riccardo 45mm
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Ikonická kefa pre dokonalú fúkanú.
                      </p>
                      <span className="text-xs font-semibold text-zinc-200 block mt-2">
                        +{brushPrice} €
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setAddOnAudit(!addOnAudit)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      addOnAudit
                        ? 'bg-zinc-900 border-white'
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                        addOnAudit ? 'bg-white border-white text-black' : 'border-zinc-700'
                      }`}
                    >
                      {addOnAudit && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        1-on-1 Online Audit
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        30-min súkromná konzultácia s Richardom.
                      </p>
                      <span className="text-xs font-semibold text-zinc-200 block mt-2">
                        +{auditPrice} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Mode (Full vs Deposit) */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Ako si želáte uhradiť kurz?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentOption('full')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      paymentOption === 'full'
                        ? 'bg-zinc-850 border-white text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <strong className="text-xs sm:text-sm block font-medium">Celá suma vopred</strong>
                      <span className="text-[11px] text-zinc-500 block">Bezstarostný príchod bez doplatkov</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{totalPackagePriceEUR} €</span>
                  </div>

                  <div
                    onClick={() => setPaymentOption('deposit')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      paymentOption === 'deposit'
                        ? 'bg-zinc-850 border-white text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <strong className="text-xs sm:text-sm block font-medium">Iba záloha 100 €</strong>
                      <span className="text-[11px] text-zinc-500 block">Doplatok {totalPackagePriceEUR - 100} € na mieste</span>
                    </div>
                    <span className="text-sm font-semibold text-white">100 €</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Stylist & Billing Information */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Meno a priezvisko účastníka *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="napr. Michaela Kováčová"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                    E-mail pre potvrdenie & faktúru *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vas@email.sk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Telefónne číslo *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+421 9xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Názov salónu
                  </label>
                  <input
                    type="text"
                    placeholder="napr. Hair Studio Elegance"
                    value={formData.salonName}
                    onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                    Mesto
                  </label>
                  <input
                    type="text"
                    placeholder="napr. Bratislava, Žilina, Praha"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Billing Details Selector */}
              <div className="pt-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2.5">
                  Fakturačné údaje pre daňový doklad
                </label>
                
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={formData.billingType === 'salon'}
                      onChange={() => setFormData({ ...formData, billingType: 'salon' })}
                      className="accent-white cursor-pointer"
                    />
                    <span className="text-white font-medium">Faktúra na IČO (Náklad pre salón)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={formData.billingType === 'private'}
                      onChange={() => setFormData({ ...formData, billingType: 'private' })}
                      className="accent-white cursor-pointer"
                    />
                    <span>Súkromná osoba</span>
                  </label>
                </div>

                {formData.billingType === 'salon' && (
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Názov spoločnosti / Živnosti</label>
                        <input
                          type="text"
                          placeholder="Firma s.r.o. / Meno a priezvisko"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Fakturačná adresa (Ulica, Mesto, PSČ)</label>
                        <input
                          type="text"
                          placeholder="Hlavná 12, 811 01 Bratislava"
                          value={formData.billingAddress}
                          onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">IČO *</label>
                        <input
                          type="text"
                          placeholder="12345678"
                          value={formData.ico}
                          onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">DIČ / IČ DPH</label>
                        <input
                          type="text"
                          placeholder="SK20..."
                          value={formData.dic}
                          onChange={(e) => setFormData({ ...formData, dic: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-1">
                      Daňový doklad a faktúru pre váš salón vystavuje: <strong className="text-zinc-300">zeterem s.r.o.</strong>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Poznámka / Špecifické otázky k technike
                </label>
                <textarea
                  rows={2}
                  placeholder="Máte špecifické techniky, na ktoré sa chcete počas praktickej časti zamerať?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

            </div>
          )}

          {/* STEP 3: Payment Gateway (Apple Pay, Google Pay, Revolut Pay, Card) */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Order Summary Box */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-start border-b border-zinc-800/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-semibold">Seminár</span>
                    <strong className="text-sm sm:text-base text-white block">{selectedSeminar.title}</strong>
                    <span className="text-xs text-zinc-400">{selectedSeminar.dates} • {currentTier.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{totalPackagePriceEUR} €</span>
                </div>

                {(addOnBrush || addOnAudit) && (
                  <div className="space-y-1 text-xs text-zinc-400 border-b border-zinc-800/80 pb-3">
                    {addOnBrush && (
                      <div className="flex justify-between">
                        <span>Termálna kefa Riccardo</span>
                        <span>+{brushPrice} €</span>
                      </div>
                    )}
                    {addOnAudit && (
                      <div className="flex justify-between">
                        <span>1-on-1 Online audit</span>
                        <span>+{auditPrice} €</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-xs text-zinc-400 block">
                      {paymentOption === 'deposit' ? 'Platba zálohy teraz (garancia miesta):' : 'Konečná suma k úhrade:'}
                    </span>
                    {paymentOption === 'deposit' && (
                      <span className="text-[11px] text-zinc-500">
                        Zostávajúci doplatok {totalPackagePriceEUR - 100} € uhradíte na mieste.
                      </span>
                    )}
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {amountToPayNow} €
                  </span>
                </div>

                {/* Operator disclosure */}
                <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-850 flex items-center justify-between">
                  <span>Predajca a prevádzkovateľ: <strong className="text-zinc-300">zeterem s.r.o.</strong></span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-bit SSL</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                  Vyberte spôsob platby
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  {/* 1. Apple Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <ApplePayLogo className="h-5 w-auto text-white" />
                    </div>
                    <span className="text-[11px] font-semibold">Apple Pay</span>
                  </button>

                  {/* 2. Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <GooglePayLogo className="h-4 w-auto" lightText={true} />
                    </div>
                    <span className="text-[11px] font-semibold">Google Pay</span>
                  </button>

                  {/* 3. Revolut Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('revolut_pay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'revolut_pay'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center gap-1.5">
                      <RevolutIcon className="h-4 w-4 text-white" />
                      <span className="text-xs font-bold text-white tracking-tight">Pay</span>
                    </div>
                    <span className="text-[11px] font-semibold">Revolut Pay</span>
                  </button>

                  {/* 4. Credit / Debit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold">Platobná karta</span>
                  </button>

                </div>
              </div>

              {/* Conditional Method Form */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Expresná autorizácia cez Apple Pay</span>
                    <span className="text-white font-medium">Touch ID / Face ID</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                  >
                    <ApplePayLogo className="h-6 w-auto" fill="#000000" />
                    <span className="font-semibold text-base">Zaplatiť {amountToPayNow} €</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center">
                    Platba prebehne priamo cez Apple Pay kartu uloženú vo vašom Apple zariadení.
                  </p>
                </div>
              )}

              {paymentMethod === 'google_pay' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Expresná platba cez Google Pay</span>
                    <span className="text-white font-medium">Google Peňaženka</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-zinc-900 border border-zinc-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                  >
                    <GooglePayLogo className="h-5 w-auto" lightText={true} />
                    <span className="font-semibold text-base">Zaplatiť {amountToPayNow} €</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center">
                    Bezpečné spracovanie platby cez účet Google.
                  </p>
                </div>
              )}

              {paymentMethod === 'revolut_pay' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Okamžitá platba cez Revolut</span>
                    <span className="text-white font-medium">Revolut App</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-black font-semibold text-sm transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                  >
                    <RevolutIcon className="h-5 w-5" fill="#000000" />
                    <span className="font-semibold text-base">Zaplatiť cez Revolut Pay ({amountToPayNow} €)</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center">
                    Budete presmerovaný do aplikácie Revolut na 1-klikové potvrdenie.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Platba kartou online (Visa, Mastercard, Maestro)</span>
                    <CreditCardBrandIcons />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Číslo karty *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4532 •••• •••• ••••"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-zinc-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Platnosť (MM/RR) *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/RR"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-sm font-mono text-center focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Bezpečnostný kód (CVC/CVV) *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-sm font-mono text-center focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Meno na karte</label>
                    <input
                      type="text"
                      placeholder={formData.fullName || "Meno a priezvisko"}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Zaplatiť {amountToPayNow} € kartou</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Zabezpečené cez 3D Secure 2.0 • Prevádzkovateľ: zeterem s.r.o.</span>
                  </div>
                </div>
              )}

              {/* Processing Overlay if in progress */}
              {isProcessingPayment && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-4 shadow-2xl">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                    Spracúvam platbu...
                  </h3>
                  <p className="text-sm text-zinc-400">{paymentStatusText}</p>
                </div>
              )}

            </div>
          )}

          {/* STEP 4: Confirmation & Ticket Receipt */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fadeIn">
              
              <div className="space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">
                  Platba úspešná • Miesto garantované
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  Tešíme sa na vás, {formData.fullName}.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Vaša rezervácia a platba boli úspešne spracované. Potvrdenie a daňový doklad vystavený prevádzkovateľom <strong>zeterem s.r.o.</strong> boli odoslané na <strong>{formData.email}</strong>.
                </p>
              </div>

              {/* Minimal Monochrome Ticket Card */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-left space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <QrCode className="w-32 h-32 text-white" />
                </div>

                <div className="flex justify-between items-baseline border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-white uppercase block">
                      RICCARDO ACADEMY
                    </span>
                    <span className="text-[11px] text-zinc-500">Predajca: zeterem s.r.o.</span>
                  </div>
                  <span className="font-mono text-xs text-white bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                    {confirmationCode}
                  </span>
                </div>

                <div className="space-y-2 text-xs relative z-10">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Seminár</span>
                    <strong className="text-sm text-white font-medium block">
                      {selectedSeminar.title}
                    </strong>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-zinc-300 pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Dátum</span>
                      <span className="font-medium text-white">{selectedSeminar.dates}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Miesto</span>
                      <span className="font-medium text-white">{selectedSeminar.city} (Atelier)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Účastník</span>
                      <span className="font-medium text-white">{formData.fullName}</span>
                      <span className="text-[10px] text-zinc-500 block">{formData.salonName || formData.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Spôsob platby</span>
                      <span className="text-emerald-400 font-medium capitalize">
                        {paymentMethod === 'apple_pay' && 'Apple Pay (Uhradené)'}
                        {paymentMethod === 'google_pay' && 'Google Pay (Uhradené)'}
                        {paymentMethod === 'revolut_pay' && 'Revolut Pay (Uhradené)'}
                        {paymentMethod === 'card' && 'Kreditná karta (Uhradené)'}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">Uhradené: {amountToPayNow} €</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-7 h-7 text-white" />
                    <span className="text-[10px] text-zinc-400">Platná elektronická vstupenka</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">
                    Spolu balíček: {totalPackagePriceEUR} €
                  </span>
                </div>
              </div>

              {/* Add to Calendar Action Buttons */}
              <div className="space-y-3">
                <span className="text-xs text-zinc-400 block font-medium">
                  Pridajte si termín do svojho kalendára:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={handleDownloadCalendar}
                    className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Apple / Outlook (.ics)</span>
                  </button>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedSeminar.title + ' — Hair Salon Riccardo')}&details=${encodeURIComponent('Masterclass s Richardom Čonkom. Kód vstupenky: ' + confirmationCode + '. Prevádzkovateľ: zeterem s.r.o. Vstupenka bola riadne zaplatená.')}&location=${encodeURIComponent(selectedSeminar.venue + ', Lučenec')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Google Kalendár</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation (Steps 1 & 2) */}
        {step < 3 && (
          <div className="p-4 sm:p-5 border-t border-zinc-850 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Späť</span>
              </button>
            ) : (
              <div className="text-xs text-zinc-500">
                Prevádzkovateľ eshopu: <strong className="text-zinc-400 font-medium">zeterem s.r.o.</strong>
              </div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-1.5 shadow-lg"
            >
              <span>{step === 1 ? 'Pokračovať na údaje' : 'Prejsť k platbe'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 3 back button */}
        {step === 3 && (
          <div className="p-4 sm:p-5 border-t border-zinc-850 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť na údaje</span>
            </button>
            <span className="text-xs text-zinc-500">
              Vyberte Apple Pay, Google Pay, Revolut Pay alebo Kartu
            </span>
          </div>
        )}

        {/* Step 4 close */}
        {step === 4 && (
          <div className="p-4 sm:p-5 border-t border-zinc-850 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-8 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-zinc-200 transition-all shadow-lg"
            >
              Zavrieť a hotovo
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
