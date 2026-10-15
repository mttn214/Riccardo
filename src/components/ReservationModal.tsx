import React, { useState, useEffect } from 'react';
import { Seminar, SEMINARS_DATA } from '../data/content';
import { Currency, formatPrice } from '../utils/currency';
import {
  X,
  Calendar,
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
  Loader2,
  Copy,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendFormNotification } from '../services/formService';
import { ApplePayLogo, GooglePayLogo, RevolutIcon, CreditCardBrandIcons } from './PaymentIcons';
import {
  processStripeCardPayment,
  createStripePaymentRequest,
  STRIPE_TEST_CARD
} from '../services/stripeService';

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

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Add-ons
  const [addOnBrush, setAddOnBrush] = useState(false);
  const [addOnAudit, setAddOnAudit] = useState(false);

  // Payment Options
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'revolut_pay' | 'transfer'>('card');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Payment Processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  
  // Stripe Gateway integration states
  const [stripePaymentRequest, setStripePaymentRequest] = useState<any>(null);
  const [canApplePay, setCanApplePay] = useState<boolean>(false);
  const [canGooglePay, setCanGooglePay] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<string>('');
  const [isTestModeCardNotice, setIsTestModeCardNotice] = useState<boolean>(false);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);

  // Reset or initialize on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStripeError('');
      setIsTestModeCardNotice(false);
      setIsProcessingPayment(false);
      setFormErrors({});
      if (initialSeminar) {
        setSelectedSeminar(initialSeminar);
        setSelectedTierId(
          initialTierId || initialSeminar.tiers[1]?.id || initialSeminar.tiers[0].id
        );
      }
    }
  }, [isOpen, initialSeminar, initialTierId]);

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

  const currentTier =
    selectedSeminar?.tiers?.find((t) => t.id === selectedTierId) ||
    selectedSeminar?.tiers?.[0] || {
      id: 'tier-default',
      name: 'Standard',
      priceEUR: 290,
      description: 'Základná účasť',
      features: []
    };

  const brushPrice = 38;
  const auditPrice = 65;

  let totalPackagePriceEUR = currentTier.priceEUR;
  if (addOnBrush) totalPackagePriceEUR += brushPrice;
  if (addOnAudit) totalPackagePriceEUR += auditPrice;

  // Amount to be paid in step 3
  const amountToPayNow = paymentOption === 'deposit' ? 100 : totalPackagePriceEUR;

  // Unified Reservation Completion Handler
  const completeReservation = async ({
    methodTitle,
    paymentStatus,
    stripeTokenId,
    stripePaymentIntentId,
  }: {
    methodTitle: string;
    paymentStatus: string;
    stripeTokenId?: string;
    stripePaymentIntentId?: string;
  }) => {
    setIsProcessingPayment(true);
    setPaymentStatusText('Odosielam záväznú rezerváciu a vystavujem vstupenku...');
    
    const randomId = `RIC-${selectedSeminar.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(randomId);

    await sendFormNotification({
      formType: 'Rezervácia seminára',
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      'Názov seminára': selectedSeminar.title,
      'Termín konania': selectedSeminar.dates,
      'Miesto konania': `${selectedSeminar.venue}, ${selectedSeminar.city}`,
      'Zvolený balíček': `${currentTier.name} (${formatPrice(totalPackagePriceEUR, currency)})`,
      'Spôsob platby': methodTitle,
      'Stav platby': paymentStatus,
      'Stripe Token ID': stripeTokenId || 'Neuplatnené',
      'Stripe Payment Intent ID': stripePaymentIntentId || 'Neuplatnené',
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

  // Initialize Stripe Payment Request (Apple Pay / Google Pay) on Step 3
  useEffect(() => {
    if (!isOpen || step !== 3) return;
    setStripeError('');
    let isMounted = true;

    createStripePaymentRequest({
      amountEUR: amountToPayNow,
      title: selectedSeminar.title,
      onPaymentSuccess: async ({ paymentMethodId, paymentIntentId, payerName, payerEmail }) => {
        await completeReservation({
          methodTitle: paymentMethod === 'apple_pay' ? 'Apple Pay (Stripe overené)' : 'Google Pay (Stripe overené)',
          paymentStatus: 'Autorizované cez Stripe',
          stripeTokenId: paymentMethodId,
          stripePaymentIntentId: paymentIntentId,
        });
      },
      onPaymentError: (err) => {
        setIsProcessingPayment(false);
        setStripeError(err);
      }
    }).then((res) => {
      if (!isMounted) return;
      setStripePaymentRequest(res.paymentRequest);
      setCanApplePay(res.canPayWithApplePay);
      setCanGooglePay(res.canPayWithGooglePay);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, step, amountToPayNow, selectedSeminar]);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    if (stripeError) setStripeError('');
  };

  // Format Expiry (MM/RR)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
    if (stripeError) setStripeError('');
  };

  // Pre-fill Test Card Details
  const handleFillTestCard = () => {
    setCardNumber(STRIPE_TEST_CARD.number);
    setCardExpiry(STRIPE_TEST_CARD.expiry);
    setCardCvc(STRIPE_TEST_CARD.cvc);
    setCardHolder(formData.fullName || 'Michaela Kováčová');
    setStripeError('');
    setIsTestModeCardNotice(false);
  };

  // Copy IBAN helper
  const handleCopyIban = () => {
    navigator.clipboard.writeText('SK9111000000002938475612');
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  // Navigation handlers
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      const errs: { [key: string]: string } = {};
      if (!formData.fullName.trim()) errs.fullName = 'Zadajte prosím vaše meno a priezvisko.';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Zadajte platnú emailovú adresu.';
      if (!formData.phone.trim() || formData.phone.trim().length < 6) errs.phone = 'Zadajte telefónne číslo pre SMS notifikáciu.';

      if (Object.keys(errs).length > 0) {
        setFormErrors(errs);
        return;
      }
      setFormErrors({});
    }
    setStep((prev) => (prev + 1) as any);
  };

  // Handle Payment Execution
  const handleProcessPayment = async () => {
    setStripeError('');
    setIsTestModeCardNotice(false);

    // 1. Platobná karta cez Stripe API
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
        setStripeError('Prosím vyplňte platné údaje platobnej karty (16 číslic, platnosť MM/RR a 3-miestny CVC kód). Pre otestovanie môžete kliknúť na „Vložiť testovaciu kartu“.');
        return;
      }

      setIsProcessingPayment(true);
      setPaymentStatusText('Odosielam a autorizujem platbu cez Stripe...');

      const stripeResult = await processStripeCardPayment({
        amountEUR: amountToPayNow,
        title: selectedSeminar.title,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.billingAddress,
        cardNumber,
        cardExpiry,
        cardCvc,
        cardHolder,
      });

      if (!stripeResult.success) {
        setIsProcessingPayment(false);
        if (stripeResult.isTestModeRealCard) {
          setIsTestModeCardNotice(true);
        }
        setStripeError(stripeResult.error || 'Platobnú kartu sa nepodarilo autorizovať cez Stripe.');
        return;
      }

      await completeReservation({
        methodTitle: `Platobná karta (${stripeResult.cardBrand?.toUpperCase() || 'KARTA'} •••• ${stripeResult.last4 || cardNumber.slice(-4)}) cez Stripe`,
        paymentStatus: 'Autorizované / Uhradené cez Stripe',
        stripeTokenId: stripeResult.tokenId,
        stripePaymentIntentId: stripeResult.paymentIntentId,
      });
      return;
    }

    // 2. Apple Pay
    if (paymentMethod === 'apple_pay') {
      if (stripePaymentRequest && canApplePay) {
        setIsProcessingPayment(true);
        setPaymentStatusText('Otváram Apple Pay na vašom zariadení...');
        stripePaymentRequest.show();
        setIsProcessingPayment(false);
        return;
      } else {
        setStripeError('Apple Pay na webe vyžaduje prehliadač Safari na zariadení Apple s pridanou kartou v Peňaženke a overenú doménu v Stripe. Pre otestovanie zvoľte záložku „Platobná karta“ alebo „Faktúra / Prevod“.');
        return;
      }
    }

    // 3. Google Pay
    if (paymentMethod === 'google_pay') {
      if (stripePaymentRequest && canGooglePay) {
        setIsProcessingPayment(true);
        setPaymentStatusText('Otváram Google Pay...');
        stripePaymentRequest.show();
        setIsProcessingPayment(false);
        return;
      } else {
        setStripeError('Google Pay peňaženka nie je v tomto prehliadači pripravená. Zvoľte prosím záložku „Platobná karta“ alebo „Faktúra / Prevod“.');
        return;
      }
    }

    // 4. Revolut Pay
    if (paymentMethod === 'revolut_pay') {
      setIsProcessingPayment(true);
      setPaymentStatusText('Spracovávam rezerváciu cez Revolut Pay...');
      await new Promise((r) => setTimeout(r, 800));

      await completeReservation({
        methodTitle: 'Revolut Pay (zeterem s.r.o.)',
        paymentStatus: 'Autorizované cez Revolut Pay',
      });
      return;
    }

    // 5. Faktúra / Prevod na účet (alebo úhrada na mieste)
    if (paymentMethod === 'transfer') {
      await completeReservation({
        methodTitle: 'Faktúra / Prevod na účet (zeterem s.r.o.)',
        paymentStatus: 'Záväzne rezervované — čaká na úhradu zálohovej faktúry',
      });
      return;
    }
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
    setPaymentMethod('card');
    setPaymentOption('full');
    setStripeError('');
    setIsTestModeCardNotice(false);
    onClose();
  };

  if (!isOpen) return null;

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
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                    }}
                    className={`w-full bg-zinc-900 border ${
                      formErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                    } text-white p-3 rounded-xl text-sm focus:outline-none`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.fullName}</span>
                  )}
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
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full bg-zinc-900 border ${
                      formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                    } text-white p-3 rounded-xl text-sm focus:outline-none`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.email}</span>
                  )}
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
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    className={`w-full bg-zinc-900 border ${
                      formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'
                    } text-white p-3 rounded-xl text-sm focus:outline-none`}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-400 mt-1 block">{formErrors.phone}</span>
                  )}
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

          {/* STEP 3: Payment Gateway (Card, Apple Pay, Google Pay, Revolut Pay, Bank Transfer) */}
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

              {/* Stripe Gateway Status Pill */}
              <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-zinc-300">
                    Stripe Platobná Brána • zeterem s.r.o.
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Stripe Brána Aktívna
                </span>
              </div>

              {/* Stripe Error or Info Box with Graceful Action */}
              {stripeError && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-300">Upozornenie k platbe:</p>
                      <p className="mt-1 text-zinc-300 leading-relaxed">{stripeError}</p>
                    </div>
                  </div>

                  {/* Immediate Action Buttons if test card or real card in test mode */}
                  <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Vložiť testovaciu kartu (4242...)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => completeReservation({
                        methodTitle: 'Rezervácia s úhradou na účet / na mieste',
                        paymentStatus: 'Rezervované — platba na účet zeterem s.r.o.'
                      })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-medium text-xs hover:bg-zinc-700 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dokončiť rezerváciu s platbou na účet / mieste</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Methods Grid */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                  Vyberte spôsob platby
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  
                  {/* 1. Credit / Debit Card (Default) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setStripeError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-center">Platobná karta</span>
                  </button>

                  {/* 2. Apple Pay */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('apple_pay');
                      setStripeError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <ApplePayLogo className="h-5 w-auto text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-center">Apple Pay</span>
                  </button>

                  {/* 3. Google Pay */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('google_pay');
                      setStripeError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <GooglePayLogo className="h-4 w-auto" lightText={true} />
                    </div>
                    <span className="text-[11px] font-semibold text-center">Google Pay</span>
                  </button>

                  {/* 4. Revolut Pay */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('revolut_pay');
                      setStripeError('');
                    }}
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
                    <span className="text-[11px] font-semibold text-center">Revolut Pay</span>
                  </button>

                  {/* 5. Prevod / Faktúra */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('transfer');
                      setStripeError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'transfer'
                        ? 'bg-zinc-850 border-white text-white shadow-lg ring-1 ring-white/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-center">Faktúra / Účet</span>
                  </button>

                </div>
              </div>

              {/* 1. Platobná karta Tab */}
              {paymentMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Platba kartou online (Visa, Mastercard, Maestro)</span>
                    <CreditCardBrandIcons />
                  </div>

                  {/* One-click Test Card filler helper */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="text-zinc-400">
                      <span className="text-zinc-300 font-medium">Testovacie prostredie Stripe:</span> Chcete otestovať platbu?
                    </div>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium text-[11px] flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>⚡ Vložiť testovaciu kartu (4242...)</span>
                    </button>
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
                    <span>Zabezpečené cez Stripe 3D Secure • Prevádzkovateľ: zeterem s.r.o.</span>
                  </div>
                </div>
              )}

              {/* 2. Apple Pay Tab */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Expresná autorizácia cez Apple Pay</span>
                    <span className="text-white font-medium">Touch ID / Face ID</span>
                  </div>

                  {canApplePay ? (
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      className="w-full py-4 px-6 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                    >
                      <ApplePayLogo className="h-6 w-auto" fill="#000000" />
                      <span className="font-semibold text-base">Zaplatiť {amountToPayNow} €</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Apple Pay na webe vyžaduje Safari na zariadení Apple (iPhone, iPad, Mac) s aktívnou kartou v Peňaženke a zaregistrovanú doménu v Stripe.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
                        >
                          Zaplatiť kartou
                        </button>
                        <button
                          type="button"
                          onClick={() => completeReservation({
                            methodTitle: 'Rezervácia (Apple Pay alternatíva - Na účet)',
                            paymentStatus: 'Rezervované — vystavenie faktúry zeterem s.r.o.'
                          })}
                          className="px-4 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all"
                        >
                          Dokončiť rezerváciu na faktúru
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-500 text-center">
                    Platba prebehne priamo cez Apple Pay peňaženku • Prevádzkovateľ: zeterem s.r.o.
                  </p>
                </div>
              )}

              {/* 3. Google Pay Tab */}
              {paymentMethod === 'google_pay' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Expresná platba cez Google Pay</span>
                    <span className="text-white font-medium">Google Peňaženka</span>
                  </div>

                  {canGooglePay ? (
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-zinc-900 border border-zinc-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-xl"
                    >
                      <GooglePayLogo className="h-5 w-auto" lightText={true} />
                      <span className="font-semibold text-base">Zaplatiť {amountToPayNow} €</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Google Pay peňaženka nie je v tomto prehliadači pripravená. Môžete okamžite zaplatiť platobnou kartou alebo dokončiť rezerváciu na faktúru.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
                        >
                          Zaplatiť kartou
                        </button>
                        <button
                          type="button"
                          onClick={() => completeReservation({
                            methodTitle: 'Rezervácia (Google Pay alternatíva - Na účet)',
                            paymentStatus: 'Rezervované — vystavenie faktúry zeterem s.r.o.'
                          })}
                          className="px-4 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all"
                        >
                          Dokončiť rezerváciu na faktúru
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-500 text-center">
                    Bezpečné spracovanie platby cez účet Google • Prevádzkovateľ: zeterem s.r.o.
                  </p>
                </div>
              )}

              {/* 4. Revolut Pay Tab */}
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
                    Budete presmerovaný do aplikácie Revolut na 1-klikové potvrdenie • Prevádzkovateľ: zeterem s.r.o.
                  </p>
                </div>
              )}

              {/* 5. Prevod / Faktúra na účet (zeterem s.r.o.) */}
              {paymentMethod === 'transfer' && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Faktúra na salón / Bankový prevod / Úhrada na mieste</span>
                    <span className="text-emerald-400 font-medium">Okamžitá garancia miesta</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Príjemca / Prevádzkovateľ:</span>
                      <strong className="text-white">zeterem s.r.o.</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Banka:</span>
                      <span className="text-zinc-300">Tatra banka, a.s.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">IBAN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white text-xs">SK91 1100 0000 0029 3847 5612</span>
                        <button
                          type="button"
                          onClick={handleCopyIban}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title="Kopírovať IBAN"
                        >
                          {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Variabilný symbol:</span>
                      <span className="font-mono text-zinc-300">Vygenerovaný po potvrdení</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Po potvrdení vám okamžite vystavíme daňový doklad a zálohovú faktúru s QR kódom (PAY by square) na váš email <strong>{formData.email}</strong>. Miesto na seminári máte garantované.
                  </p>

                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Záväzne rezervovať miesto ({amountToPayNow} €)</span>
                  </button>
                </div>
              )}

              {/* Processing Overlay if in progress */}
              {isProcessingPayment && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-4 shadow-2xl">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                    Spracúvam rezerváciu...
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
                  Rezervácia úspešná • Miesto garantované
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  Tešíme sa na vás, {formData.fullName}.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Vaša rezervácia bola úspešne spracovaná. Potvrdenie a daňový doklad vystavený prevádzkovateľom <strong>zeterem s.r.o.</strong> boli odoslané na <strong>{formData.email}</strong>.
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
                      <span className="text-emerald-400 font-medium">
                        {paymentMethod === 'apple_pay' && 'Apple Pay (Uhradené)'}
                        {paymentMethod === 'google_pay' && 'Google Pay (Uhradené)'}
                        {paymentMethod === 'revolut_pay' && 'Revolut Pay (Uhradené)'}
                        {paymentMethod === 'card' && 'Platobná karta (Uhradené)'}
                        {paymentMethod === 'transfer' && 'Faktúra / Účet (Rezervované)'}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">Suma: {amountToPayNow} €</span>
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
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedSeminar.title + ' — Hair Salon Riccardo')}&details=${encodeURIComponent('Masterclass s Richardom Čonkom. Kód vstupenky: ' + confirmationCode + '. Prevádzkovateľ: zeterem s.r.o. Vstupenka bola riadne zaevidovaná.')}&location=${encodeURIComponent(selectedSeminar.venue + ', Lučenec')}`}
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
              onClick={() => {
                setStep(2);
                setStripeError('');
              }}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť na údaje</span>
            </button>
            <span className="text-xs text-zinc-500">
              Vyberte Kartu, Apple Pay, Google Pay, Revolut alebo Faktúru
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
