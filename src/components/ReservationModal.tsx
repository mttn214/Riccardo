import React, { useState, useEffect, useRef } from 'react';
import { Seminar, SEMINARS_DATA, COMPANY_DETAILS } from '../data/content';
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
  Sparkles,
  Download,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendFormNotification } from '../services/formService';
import { ApplePayLogo, GooglePayLogo, CreditCardBrandIcons } from './PaymentIcons';
import {
  getStripe,
  processStripeCardPayment,
  createStripePaymentRequest,
  mountStripePaymentRequestButton,
  STRIPE_TEST_CARD,
  DEFAULT_STRIPE_LIVE_KEY
} from '../services/stripeService';
import { adminStore } from '../services/adminStore';
import { generateLuxuryTicketPDF } from '../services/ticketService';
import { saveReservationToCloud } from '../services/supabaseClient';


interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  initialSeminar?: Seminar | null;
  initialTierId?: string;
  initialStep?: 1 | 2 | 3 | 4;
  initialConfirmationCode?: string;
  initialFormData?: any;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  currency,
  initialSeminar,
  initialTierId,
  initialStep,
  initialConfirmationCode,
  initialFormData,
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
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Add-ons
  const [addOnBrush, setAddOnBrush] = useState(false);
  const [addOnAudit, setAddOnAudit] = useState(false);

  // Payment Options
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'transfer'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Payment Processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [stripeReceiptUrl, setStripeReceiptUrl] = useState<string | null>(null);

  // Stripe & Wallet integration states
  const [stripePaymentRequest, setStripePaymentRequest] = useState<any>(null);
  const lastClickedWallet = useRef<'apple' | 'google'>('apple');
  const walletCapabilities = useRef<{ applePay: boolean; googlePay: boolean }>({ applePay: false, googlePay: false });
  const [canApplePay, setCanApplePay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent) || Boolean((window as any).ApplePaySession);
  });
  const [canGooglePay, setCanGooglePay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /Android|Chrome/.test(navigator.userAgent) && !/Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);
  });
  const [isApplePayReady, setIsApplePayReady] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent) || Boolean((window as any).ApplePaySession);
  });
  const [isCheckingApplePay, setIsCheckingApplePay] = useState<boolean>(false);
  const applePayMountRef = useRef<HTMLDivElement>(null);
  const [stripeError, setStripeError] = useState<string>('');
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [copiedTicketCode, setCopiedTicketCode] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Reset or initialize on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 1);
      if (initialConfirmationCode) {
        setConfirmationCode(initialConfirmationCode);
      }
      if (initialFormData) {
        setFormData((prev) => ({ ...prev, ...initialFormData }));
      }
      setStripeError('');
      setStripeReceiptUrl(null);
      setIsProcessingPayment(false);
      setFormErrors({});
      if (initialSeminar) {
        setSelectedSeminar(initialSeminar);
        setSelectedTierId(
          initialTierId || initialSeminar.tiers[1]?.id || initialSeminar.tiers[0].id
        );
      }
    }
  }, [isOpen, initialSeminar, initialTierId, initialStep, initialConfirmationCode, initialFormData]);


  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'instant' });
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
    receiptUrl,
  }: {
    methodTitle: string;
    paymentStatus: string;
    stripeTokenId?: string;
    stripePaymentIntentId?: string;
    receiptUrl?: string | null;
  }) => {
    setIsProcessingPayment(true);
    if (receiptUrl) {
      setStripeReceiptUrl(receiptUrl);
    }
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
      'Stripe Doklad': receiptUrl || 'Neuplatnené',
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
      'Prevádzkovateľ eshopu': COMPANY_DETAILS.legalName
    });

    // Record booking into Admin Store for live attendee visibility
    try {
      const paymentStatusText = paymentOption === 'deposit'
        ? 'Uhradená záloha (100 €)'
        : methodTitle.includes('Prevod') || methodTitle.includes('Faktúra')
        ? 'Čaká na prevod / faktúru'
        : 'Uhradené (Plná suma)';

      adminStore.addParticipant({
        seminarId: selectedSeminar.id,
        seminarTitle: selectedSeminar.title,
        seminarDates: selectedSeminar.dates,
        seminarCity: selectedSeminar.city,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        salonName: formData.salonName || undefined,
        city: formData.city || undefined,
        experience: formData.experience,
        tierId: currentTier.id,
        tierName: currentTier.name,
        tierPriceEUR: totalPackagePriceEUR,
        paymentOption,
        amountPaidEUR: amountToPayNow,
        amountRemainingEUR: paymentOption === 'deposit' ? totalPackagePriceEUR - 100 : 0,
        paymentMethod: methodTitle,
        paymentStatus: paymentStatusText as any,
        stripePaymentIntentId,
        stripeTokenId,
        receiptUrl: receiptUrl || undefined,
        ticketCode: randomId,
        billingType: formData.billingType,
        companyName: formData.companyName || formData.salonName || undefined,
        ico: formData.ico || undefined,
        dic: formData.dic || undefined,
        billingAddress: formData.billingAddress || undefined,
        notes: formData.notes || undefined,
        internalNotes: `Online rezervácia z webu (${methodTitle})`
      });
    } catch (storeErr) {
      console.warn('Could not record participant into admin store:', storeErr);
    }

    // Direct synchronization to Supabase Cloud PostgreSQL database
    saveReservationToCloud({
      ticketCode: randomId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      salonName: formData.salonName || undefined,
      city: formData.city || undefined,
      billingType: formData.billingType,
      companyName: formData.companyName || formData.salonName || undefined,
      ico: formData.ico || undefined,
      dic: formData.dic || undefined,
      billingAddress: formData.billingAddress || undefined,
      seminarId: selectedSeminar.id,
      paymentOption,
      totalAmountEUR: totalPackagePriceEUR,
      amountPaidEUR: amountToPayNow,
      amountRemainingEUR: paymentOption === 'deposit' ? totalPackagePriceEUR - 100 : 0,
      paymentMethod: methodTitle,
      paymentStatus: paymentOption === 'deposit' ? 'Uhradená záloha (100 €)' : 'Uhradené (Plná suma)',
      stripePaymentIntentId,
      receiptUrl: receiptUrl || null,
      notes: formData.notes || undefined,
    }).catch((cloudErr) => console.warn('Cloud sync background error:', cloudErr));

    setIsProcessingPayment(false);
    setStep(4);
  };

  // Setup and mount native Apple Pay if supported on this device/browser
  useEffect(() => {
    if (!isOpen || step !== 3) return;
    setStripeError('');
    let isMounted = true;
    let cleanupButton: (() => void) | null = null;

    // Check device / browser Apple Pay support
    setIsCheckingApplePay(true);
    getStripe().then(async (stripe) => {
      if (!stripe || !isMounted) {
        setIsCheckingApplePay(false);
        setIsApplePayReady(false);
        return;
      }

      try {
        const pr = stripe.paymentRequest({
          country: 'SK',
          currency: 'eur',
          total: {
            label: `${selectedSeminar.title} • ZETEREM s.r.o.`,
            amount: Math.round(amountToPayNow * 100),
          },
          requestPayerName: true,
          requestPayerEmail: true,
          requestPayerPhone: true,
        });

        const res = await pr.canMakePayment();
        if (!isMounted) return;

        walletCapabilities.current = {
          applePay: Boolean(res && (res as any).applePay),
          googlePay: Boolean(res && (res as any).googlePay),
        };

        // Dynamic Smart Wallet Detection (Apple Pay vs Google Pay)
        const isAppleDevice = typeof window !== 'undefined' && (/Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent) || Boolean((window as any).ApplePaySession));
        const isAndroidOrGoogleDevice = typeof window !== 'undefined' && /Android|Chrome/.test(navigator.userAgent) && !/Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);

        const appleAvailable = Boolean(res && res.applePay) || isAppleDevice;
        const googleAvailable = Boolean(res && res.googlePay) || isAndroidOrGoogleDevice;

        setCanApplePay(appleAvailable);
        setCanGooglePay(googleAvailable);
        setIsApplePayReady(appleAvailable || googleAvailable);
        setIsCheckingApplePay(false);
        setStripePaymentRequest(pr);

        // Attach payment listener on PaymentRequest
        pr.on('paymentmethod', async (ev) => {
          setIsProcessingPayment(true);
          const isGoogle = lastClickedWallet.current === 'google';
          const walletLabel = isGoogle ? 'Google Pay' : 'Apple Pay';
          setPaymentStatusText(`Autorizujem platbu cez ${walletLabel} v systéme Stripe...`);
          try {
            const stripeConfig = adminStore.getStripeConfig();
            const apiRes = await fetch('/api/pay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amountEUR: amountToPayNow,
                paymentMethodId: ev.paymentMethod.id,
                customerName: ev.payerName || formData.fullName,
                customerEmail: ev.payerEmail || formData.email,
                customerPhone: ev.payerPhone || formData.phone,
                seminarTitle: selectedSeminar.title,
                ticketId: confirmationCode,
                paymentType: isGoogle ? 'google_pay' : 'apple_pay',
                customSecretKey: stripeConfig.secretKey || undefined
              })
            });

            const data = await apiRes.json();
            if (data.success) {
              ev.complete('success');
              await completeReservation({
                methodTitle: `${walletLabel} (Biometrická autorizácia)`,
                paymentStatus: `Autorizované a uhradené cez ${walletLabel}`,
                stripeTokenId: ev.paymentMethod.id,
                stripePaymentIntentId: data.paymentIntentId,
                receiptUrl: data.receiptUrl || null,
              });
            } else {
              ev.complete('fail');
              setIsProcessingPayment(false);
              setStripeError(data.error || `Platba cez ${walletLabel} bola zamietnutá bankou alebo Stripe.`);
            }
          } catch (err: any) {
            ev.complete('fail');
            setIsProcessingPayment(false);
            setStripeError(`Nastala chyba pri spracovaní ${walletLabel}: ` + (err?.message || 'Chyba siete.'));
          }
        });

        pr.on('cancel', () => {
          setIsProcessingPayment(false);
          setPaymentStatusText('');
        });

      } catch (err) {
        console.warn('Apple Pay check error:', err);
        if (isMounted) {
          setIsCheckingApplePay(false);
          setIsApplePayReady(false);
        }
      }
    });

    return () => {
      isMounted = false;
      if (cleanupButton) cleanupButton();
    };
  }, [isOpen, step, paymentMethod, amountToPayNow, selectedSeminar, formData.fullName, formData.email, formData.phone, confirmationCode]);

  // Safety timeout: Ensure payment processing overlay never hangs indefinitely
  useEffect(() => {
    if (!isProcessingPayment) return;
    const timeout = setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentStatusText('');
      setStripeError('Spracovanie platby trvalo neobvykle dlho. Ak vám platba neprešla, skúste to znova alebo zvoľte platbu platobnou kartou či prevodom.');
    }, 12000);
    return () => clearTimeout(timeout);
  }, [isProcessingPayment]);

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
    if (stripeError) setStripeError('');
  };

  // Copy IBAN helper
  const handleCopyIban = () => {
    navigator.clipboard.writeText(COMPANY_DETAILS.bankAccount.ibanRaw);
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
      if (!termsAccepted) errs.terms = 'Pre pokračovanie k platbe musíte potvrdiť súhlas so Všeobecnými obchodnými podmienkami (VOP) a Zásadami ochrany osobných údajov.';

      if (Object.keys(errs).length > 0) {
        setFormErrors(errs);
        return;
      }
      setFormErrors({});
    }
    setStep((prev) => (prev + 1) as any);
  };

  // Handle Card Payment execution directly in-place
  const handleProcessCardPayment = async () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvc) {
      setStripeError('Prosím vyplňte všetky údaje platobnej karty (číslo karty, platnosť MM/RR a bezpečnostný kód CVC).');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStatusText('Odosielam a autorizujem platbu cez Stripe...');
    setStripeError('');

    try {
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
        cardHolder: cardHolder || formData.fullName,
      });

      if (!stripeResult.success) {
        setIsProcessingPayment(false);
        setStripeError(stripeResult.error || 'Platobnú kartu sa nepodarilo autorizovať cez Stripe.');
        return;
      }

      await completeReservation({
        methodTitle: `Platobná karta (${stripeResult.cardBrand?.toUpperCase() || 'KARTA'} •••• ${stripeResult.last4 || cardNumber.slice(-4)})`,
        paymentStatus: 'Autorizované / Uhradené cez Stripe',
        stripeTokenId: stripeResult.tokenId,
        stripePaymentIntentId: stripeResult.paymentIntentId,
        receiptUrl: stripeResult.receiptUrl,
      });
    } catch (err: any) {
      setIsProcessingPayment(false);
      setStripeError(err.message || 'Nastala neočakávaná chyba pri spracovaní platby.');
    }
  };

  // Handle Google Pay payment execution
  const handleProcessGooglePayPayment = async () => {
    lastClickedWallet.current = 'google';
    setStripeError('');

    const hasGooglePaySupport = Boolean(walletCapabilities.current?.googlePay);

    if (hasGooglePaySupport && stripePaymentRequest) {
      try {
        await stripePaymentRequest.show();
        return;
      } catch (err: any) {
        setIsProcessingPayment(false);
        setPaymentStatusText('');
        if (err?.message && !err.message.includes('abort') && !err.message.includes('cancel')) {
          setStripeError('Google Pay dialóg bol prerušený. Môžete okamžite zaplatiť platobnou kartou nižšie.');
        }
        return;
      }
    }

    // Inform user cleanly without opening Apple Pay and without any popup error
    setIsProcessingPayment(false);
    setPaymentStatusText('');
    setStripeError('Google Pay je k dispozícii v prehliadači Google Chrome a na zariadeniach so systémom Android. Na zariadeniach Apple zvoľte prosím Apple Pay (tlačidlo vľavo) alebo zadajte platobnú kartu nižšie.');
  };

  // Handle Apple Pay payment execution
  const handleProcessApplePayPayment = async () => {
    lastClickedWallet.current = 'apple';
    setStripeError('');

    const isAppleDevice = typeof window !== 'undefined' && (/Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent) || Boolean((window as any).ApplePaySession));
    const hasApplePaySupport = Boolean(walletCapabilities.current?.applePay) || isAppleDevice;

    if (hasApplePaySupport && stripePaymentRequest) {
      try {
        await stripePaymentRequest.show();
        return;
      } catch (err: any) {
        setIsProcessingPayment(false);
        setPaymentStatusText('');
        console.warn('Apple Pay dialog error:', err);
        if (err?.message && !err.message.includes('abort') && !err.message.includes('cancel')) {
          setStripeError('Autorizácia Apple Pay nebola dokončená. Pre okamžitú úhradu prosím zvoľte platbu platobnou kartou (Visa / Mastercard).');
        }
        return;
      }
    }

    setIsProcessingPayment(false);
    setPaymentStatusText('');
    setStripeError('Apple Pay je podporované iba na zariadeniach Apple (iPhone, iPad, Mac) v prehliadači Safari. Použite prosím Google Pay vpravo alebo platobnú kartu nižšie.');
  };

  // Handle Bank Transfer confirmation
  const handleProcessTransferPayment = async () => {
    await completeReservation({
      methodTitle: `Faktúra / Prevod na účet (${COMPANY_DETAILS.legalName})`,
      paymentStatus: 'Záväzne rezervované — čaká na úhradu zálohovej faktúry',
    });
  };

  // Copy Ticket Code helper
  const handleCopyTicketCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopiedTicketCode(true);
    setTimeout(() => setCopiedTicketCode(false), 2500);
  };

  // Download official luxury VIP Ticket PDF
  const handleDownloadTicketPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateLuxuryTicketPDF({
        confirmationCode: confirmationCode || 'RIC-2026-VIP',
        seminarTitle: selectedSeminar.title,
        dates: selectedSeminar.dates,
        city: selectedSeminar.city,
        venue: selectedSeminar.venue || COMPANY_DETAILS.salonAddress,
        attendeeName: formData.fullName || 'Vážený účastník',
        salonName: formData.salonName || formData.city || 'Atelier Riccardo',
        email: formData.email,
        tierName: currentTier.name,
        amountPaidEUR: amountToPayNow,
        paymentMethod: paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'card' ? 'Platobná karta' : 'Faktúra / Prevod',
        paymentStatus: paymentMethod === 'transfer' ? 'Rezervované na faktúru' : 'Garantované & Uhradené',
      });
    } catch (err) {
      console.error('Chyba pri generovaní PDF vstupenky:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };



  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hair Salon Riccardo//Masterclass Reservations//SK\r\nBEGIN:VEVENT\r\nSUMMARY:${selectedSeminar.title} — Hair Salon Riccardo\r\nDESCRIPTION:Masterclass s Richardom Čonkom. Kód rezervácie: ${confirmationCode}. Prevádzkovateľ: ${COMPANY_DETAILS.legalName}.\r\nLOCATION:${selectedSeminar.venue}, ${selectedSeminar.city}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR`;
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
    setTermsAccepted(false);
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl text-white animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-zinc-950 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden my-4 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Progress */}
        <div className="p-5 sm:p-6 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300">
                Krok {step} zo 4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {step === 1 && 'Výber balíčka'}
              {step === 2 && 'Údaje účastníka'}
              {step === 3 && 'Platba'}
              {step === 4 && 'Potvrdenie rezervácie'}
            </h2>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetAndClose();
            }}
            className="p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
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
        <div ref={modalBodyRef} className={`overflow-y-auto ${step === 3 ? 'p-4 sm:p-6 space-y-4' : 'p-6 sm:p-8 space-y-6'}`}>
          
          {/* STEP 1: Package Selection (Clean Apple Luxury Style) */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Seminar Summary Card — Identical luxury styling to Step 3 */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 flex items-start sm:items-center justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-white">{selectedSeminar.dates}</span>
                    <span>•</span>
                    <span>{selectedSeminar.city} (Atelier)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    {selectedSeminar.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-[11px] text-zinc-300 font-medium">
                      {currentTier.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[11px] text-emerald-400 font-medium">
                      Limitované na 6 miest
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                    {formatPrice(currentTier.priceEUR, currency)}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selection — Clean Luxury Segmented Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium block">
                  Možnosť úhrady
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('full')}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      paymentOption === 'full'
                        ? 'bg-white text-black shadow-lg ring-1 ring-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold">Celá suma</span>
                    <span className={`text-base sm:text-lg font-bold ${paymentOption === 'full' ? 'text-black' : 'text-white'}`}>
                      {totalPackagePriceEUR} €
                    </span>
                    <span className={`text-[10px] ${paymentOption === 'full' ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      Bezstarostný príchod
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('deposit')}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      paymentOption === 'deposit'
                        ? 'bg-white text-black shadow-lg ring-1 ring-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold">Iba záloha</span>
                    <span className={`text-base sm:text-lg font-bold ${paymentOption === 'deposit' ? 'text-black' : 'text-white'}`}>
                      100 €
                    </span>
                    <span className={`text-[10px] ${paymentOption === 'deposit' ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      Doplatok {totalPackagePriceEUR - 100} € na mieste
                    </span>
                  </button>
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
                    className={`w-full bg-zinc-950/80 ${
                      formErrors.fullName ? 'ring-1 ring-red-500' : 'focus:ring-1 focus:ring-white/20'
                    } text-white p-3 rounded-xl text-sm focus:outline-none border-0`}
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
                    className={`w-full bg-zinc-950/80 ${
                      formErrors.email ? 'ring-1 ring-red-500' : 'focus:ring-1 focus:ring-white/20'
                    } text-white p-3 rounded-xl text-sm focus:outline-none border-0`}
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
                    className={`w-full bg-zinc-950/80 ${
                      formErrors.phone ? 'ring-1 ring-red-500' : 'focus:ring-1 focus:ring-white/20'
                    } text-white p-3 rounded-xl text-sm focus:outline-none border-0`}
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
                    className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-white/20 border-0"
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
                    className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-white/20 border-0"
                  />
                </div>
              </div>

              {/* Billing Details Selector */}
              <div className="pt-2">
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium block mb-2.5">
                  Fakturačné údaje pre daňový doklad
                </label>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, billingType: 'salon' })}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      formData.billingType === 'salon'
                        ? 'bg-white text-black shadow-lg ring-1 ring-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${formData.billingType === 'salon' ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="text-xs sm:text-sm font-semibold">Faktúra na IČO</span>
                    <span className={`text-[10px] ${formData.billingType === 'salon' ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      Pre firmu / salón
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, billingType: 'private' })}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      formData.billingType === 'private'
                        ? 'bg-white text-black shadow-lg ring-1 ring-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
                    }`}
                  >
                    <Receipt className={`w-5 h-5 ${formData.billingType === 'private' ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="text-xs sm:text-sm font-semibold">Súkromná osoba</span>
                    <span className={`text-[10px] ${formData.billingType === 'private' ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      Doklad bez IČO
                    </span>
                  </button>
                </div>

                {formData.billingType === 'salon' && (
                  <div className="p-4 rounded-2xl bg-zinc-900/40 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Názov spoločnosti / Živnosti</label>
                        <input
                          type="text"
                          placeholder="Firma s.r.o. / Meno a priezvisko"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-xs sm:text-sm border-0 focus:ring-1 focus:ring-white/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Fakturačná adresa</label>
                        <input
                          type="text"
                          placeholder="Hlavná 12, 811 01 Bratislava"
                          value={formData.billingAddress}
                          onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                          className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-xs sm:text-sm border-0 focus:ring-1 focus:ring-white/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">IČO *</label>
                        <input
                          type="text"
                          placeholder="12345678"
                          value={formData.ico}
                          onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                          className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-xs sm:text-sm font-sans border-0 focus:ring-1 focus:ring-white/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">DIČ / IČ DPH</label>
                        <input
                          type="text"
                          placeholder="SK20..."
                          value={formData.dic}
                          onChange={(e) => setFormData({ ...formData, dic: e.target.value })}
                          className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-xs sm:text-sm font-sans border-0 focus:ring-1 focus:ring-white/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-1">
                      Daňový doklad a faktúru pre váš salón vystavuje: <strong className="text-zinc-300">{COMPANY_DETAILS.legalName}</strong> (IČO: {COMPANY_DETAILS.ico}, {COMPANY_DETAILS.vatStatus})
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
                  className="w-full bg-zinc-950/80 text-white p-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-white/20 border-0"
                />
              </div>

              {/* Statutory Legal Consent Box (Interactive Checkbox) */}
              <div
                id="terms-consent-box"
                role="checkbox"
                aria-checked={termsAccepted}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setTermsAccepted((prev) => {
                      const next = !prev;
                      if (next && formErrors.terms) {
                        setFormErrors((curr) => {
                          const copy = { ...curr };
                          delete copy.terms;
                          return copy;
                        });
                      }
                      return next;
                    });
                  }
                }}
                onClick={() => {
                  setTermsAccepted((prev) => {
                    const next = !prev;
                    if (next && formErrors.terms) {
                      setFormErrors((curr) => {
                        const copy = { ...curr };
                        delete copy.terms;
                        return copy;
                      });
                    }
                    return next;
                  });
                }}
                className={`p-4 rounded-2xl transition-all cursor-pointer select-none space-y-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 ${
                  formErrors.terms
                    ? 'bg-red-950/30 ring-1 ring-red-500/50 shadow-lg'
                    : termsAccepted
                    ? 'bg-zinc-900/90 ring-1 ring-white/20 shadow-md'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                      termsAccepted
                        ? 'bg-white text-black shadow'
                        : formErrors.terms
                        ? 'bg-red-950/80 ring-1 ring-red-400'
                        : 'bg-zinc-950/80 ring-1 ring-zinc-700 hover:ring-zinc-500'
                    }`}
                  >
                    {termsAccepted && (
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[11px] leading-relaxed transition-colors ${termsAccepted ? 'text-zinc-200' : 'text-zinc-300'}`}>
                      Odoslaním a úhradou rezervácie záväzne potvrdzujem, že som sa oboznámil/a a súhlasím so{' '}
                      <a
                        href="/obchodne-podmienky"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white underline hover:text-zinc-200 font-medium"
                      >
                        Všeobecnými obchodnými podmienkami (VOP)
                      </a>{' '}
                      a{' '}
                      <a
                        href="/ochrana-udajov"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white underline hover:text-zinc-200 font-medium"
                      >
                        Zásadami ochrany osobných údajov
                      </a>{' '}
                      prevádzkovateľa <strong>{COMPANY_DETAILS.legalName}</strong> (IČO: {COMPANY_DETAILS.ico}).
                    </p>
                  </div>
                </div>

                {formErrors.terms && (
                  <div className="pt-1 flex items-center gap-1.5 text-red-400 text-[11px] font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{formErrors.terms}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-850/60 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="text-zinc-400">100% garancia spokojnosti po 1. dni</span>
                  <a
                    href="/reklamacny-poriadok"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-zinc-300 underline"
                  >
                    Storno & Reklamačný poriadok
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Payment Gateway (Clean Apple Pay & Card - Photo 2 style) */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Clean Order Summary Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    {selectedSeminar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {selectedSeminar.dates} • {paymentOption === 'deposit' ? 'Záloha na kurz' : 'Celá úhrada'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                    {amountToPayNow} €
                  </span>
                </div>
              </div>

              {/* Stripe Error or Info Box (if any) */}
              {stripeError && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                  <p className="text-zinc-200 leading-relaxed">{stripeError}</p>
                </div>
              )}

              {/* Digital Wallets: Side-by-side Apple Pay & Google Pay */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleProcessApplePayPayment}
                    disabled={isProcessingPayment}
                    className="h-14 rounded-2xl bg-black text-white hover:bg-zinc-900 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-xl ring-1 ring-white/20 hover:ring-white/40 disabled:opacity-50"
                    style={{ minHeight: '52px' }}
                    aria-label="Apple Pay"
                  >
                    <ApplePayLogo className="h-7 w-auto text-white" />
                  </button>

                  <button
                    type="button"
                    onClick={handleProcessGooglePayPayment}
                    disabled={isProcessingPayment}
                    className="h-14 rounded-2xl bg-black text-white hover:bg-zinc-900 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-xl ring-1 ring-white/20 hover:ring-white/40 disabled:opacity-50"
                    style={{ minHeight: '52px' }}
                    aria-label="Google Pay"
                  >
                    <GooglePayLogo className="h-6 w-auto" lightText={true} />
                  </button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800/80" />
                  </div>
                  <span className="relative px-4 bg-zinc-950 text-xs text-zinc-500 font-medium">
                    alebo zaplatiť platobnou kartou
                  </span>
                </div>
              </div>

              {/* Clean Card Payment Form */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                    Číslo karty
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full bg-zinc-900 text-white pl-4 pr-24 py-3.5 rounded-xl text-sm font-sans font-medium tracking-wide focus:outline-none focus:ring-1 focus:ring-white/30 border-0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <CreditCardBrandIcons />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                      Platnosť
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/RR"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      maxLength={5}
                      className="w-full bg-zinc-900 text-white p-3.5 rounded-xl text-sm font-sans font-medium text-center focus:outline-none focus:ring-1 focus:ring-white/30 border-0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                      CVC kód
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => {
                        setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
                        if (stripeError) setStripeError('');
                      }}
                      maxLength={4}
                      className="w-full bg-zinc-900 text-white p-3.5 rounded-xl text-sm font-sans font-medium text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-white/30 border-0"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessCardPayment}
                  disabled={isProcessingPayment}
                  className="w-full h-14 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-sm sm:text-base transition-all active:scale-[0.99] shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                      <span>Spracúvam platbu...</span>
                    </div>
                  ) : (
                    <span>Zaplatiť {amountToPayNow} € kartou</span>
                  )}
                </button>
              </div>

              {/* Optional Bank Transfer Toggle */}
              <div className="pt-2 text-center">
                {paymentMethod !== 'transfer' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('transfer');
                      setStripeError('');
                    }}
                    className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Potrebujete faktúru na firmu? Úhrada bankovým prevodom
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-zinc-900/60 space-y-4 text-left animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Údaje pre bankový prevod</h4>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                      >
                        Zatvoriť
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Príjemca:</span>
                        <strong className="text-white">{COMPANY_DETAILS.legalName}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Banka:</span>
                        <span className="text-white">{COMPANY_DETAILS.bankAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">IBAN:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-white text-xs">{COMPANY_DETAILS.bankAccount.iban}</span>
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
                        <span className="text-zinc-400">SWIFT / BIC:</span>
                        <span className="font-mono text-zinc-300">{COMPANY_DETAILS.bankAccount.swift}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleProcessTransferPayment}
                      disabled={isProcessingPayment}
                      className="w-full h-12 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs sm:text-sm transition-all active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Záväzne rezervovať na faktúru ({amountToPayNow} €)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Processing Overlay if in progress */}
              {isProcessingPayment && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-4 shadow-2xl">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                    Spracúvam rezerváciu...
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6 max-w-sm">{paymentStatusText}</p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProcessingPayment(false);
                      setPaymentStatusText('');
                    }}
                    className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-white text-xs font-medium transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    Zrušiť a vrátiť sa k výberu platby
                  </button>
                </div>
              )}

            </div>
          )}

          {/* STEP 4: Confirmation & Luxury VIP Ticket */}
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
                  Vaša rezervácia a platba boli úspešne spracované. Potvrdenie s kódom vstupenky a daňový doklad vystavený prevádzkovateľom <strong>{COMPANY_DETAILS.legalName}</strong> boli odoslané na <strong>{formData.email}</strong>.
                </p>
              </div>

              {/* Prominent High-Contrast Reservation Code Box */}
              <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-zinc-900/60 ring-1 ring-[#c5a059]/40 space-y-2 text-center shadow-2xl">
                <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-[#c5a059] block">
                  Váš oficiálny kód vstupenky
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest select-all">
                    {confirmationCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTicketCode}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                    title="Kopírovať kód"
                  >
                    {copiedTicketCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedTicketCode ? 'Skopírované!' : 'Kopírovať'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Tento kód je vašou záväznou vstupenkou na seminár. Predložte ho na recepcii.
                </p>
              </div>

              {/* Minimal Luxury Ticket Card */}
              <div
                id="printable-ticket"
                className="max-w-md mx-auto p-6 rounded-3xl bg-zinc-950/90 ring-1 ring-[#c5a059]/30 text-left space-y-4 shadow-2xl relative overflow-hidden"
              >
                <div className="flex justify-between items-baseline pb-3">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#c5a059] uppercase block">
                      RICCARDO ACADEMY • VIP VSTUPENKA
                    </span>
                    <span className="text-[11px] text-zinc-500">Prevádzkovateľ: {COMPANY_DETAILS.legalName}</span>
                  </div>
                  <span className="font-mono text-xs text-[#c5a059] bg-[#c5a059]/15 px-2.5 py-1 rounded-lg font-bold">
                    {confirmationCode}
                  </span>
                </div>

                <div className="space-y-3 text-xs relative z-10">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-semibold">Seminár</span>
                    <strong className="text-sm sm:text-base text-white font-semibold block leading-tight">
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
                      <span className="font-medium text-white">{selectedSeminar.city} (Atelier Riccardo)</span>
                    </div>
                  </div>

                  <div className="pt-2 bg-zinc-900/40 p-3 rounded-xl grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Účastník</span>
                      <span className="font-medium text-white text-sm">{formData.fullName}</span>
                      <span className="text-[10px] text-zinc-500 block">{formData.salonName || formData.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Spôsob platby</span>
                      <span className="text-emerald-400 font-medium block">
                        {paymentMethod === 'card' && 'Platobná karta (Uhradené)'}
                        {paymentMethod === 'apple_pay' && 'Apple Pay (Uhradené)'}
                        {paymentMethod === 'transfer' && 'Faktúra / Účet (Rezervované)'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-mono">Uhradená suma: {amountToPayNow} €</span>
                    </div>
                  </div>

                  {/* Scannable Crisp QR Code */}
                  <div className="pt-3 flex flex-col items-center justify-center gap-2">
                    <div className="p-2.5 bg-white rounded-2xl shadow-md">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(confirmationCode || 'RIC-VIP')}&color=000000&bgcolor=ffffff`}
                        alt={`QR Vstupenka ${confirmationCode}`}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 text-center">
                      Predložte tento QR kód alebo kód {confirmationCode} pri vstupe
                    </span>
                  </div>
                </div>

                {/* Official Supplier & Tax Notice for Salons / Accounting */}
                <div className="pt-3 bg-zinc-900/40 p-3 rounded-xl text-[10px] text-zinc-500 font-mono space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-zinc-300 font-sans font-semibold">{COMPANY_DETAILS.legalName}</span>
                    <span>IČO: {COMPANY_DETAILS.ico} | DIČ: {COMPANY_DETAILS.dic}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans">Sídlo: {COMPANY_DETAILS.registeredOffice}</div>
                  <div className="text-[10px] text-zinc-500 font-sans">Prevádzka: {COMPANY_DETAILS.salonAddress}</div>
                  <div className="text-[9px] text-zinc-600 font-sans leading-relaxed">{COMPANY_DETAILS.courtRegistration} • {COMPANY_DETAILS.vatStatus}</div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span>Platná elektronická vstupenka</span>
                  <span className="font-semibold text-white">Balíček: {currentTier.name} ({totalPackagePriceEUR} €)</span>
                </div>
              </div>

              {/* Single Official Luxury VIP Ticket PDF Download Action */}
              <div className="max-w-md mx-auto pt-1">
                <button
                  type="button"
                  onClick={handleDownloadTicketPdf}
                  disabled={isGeneratingPdf}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c5a059] text-black font-bold text-sm tracking-wide transition-all hover:brightness-110 active:scale-[0.99] shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Generujem oficiálnu VIP vstupenku...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Stiahnuť oficiálnu VIP vstupenku (PDF)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Official Stripe Payment Receipt (if available) */}
              {stripeReceiptUrl && (
                <div className="max-w-md mx-auto pt-1">
                  <a
                    href={stripeReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-emerald-500/40 text-emerald-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Zobraziť oficiálny doklad o platbe (Stripe Doklad)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              )}

              {/* Add to Calendar Action Buttons */}
              <div className="space-y-2 pt-2">
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
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedSeminar.title + ' — Hair Salon Riccardo')}&details=${encodeURIComponent('Masterclass s Richardom Čonkom. Kód vstupenky: ' + confirmationCode + '. Prevádzkovateľ: ' + COMPANY_DETAILS.legalName + '. Vstupenka bola riadne zaevidovaná.')}&location=${encodeURIComponent(selectedSeminar.venue + ', Lučenec')}`}
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
          <div className={`p-4 sm:p-5 flex items-center ${step === 1 ? 'justify-end' : 'justify-between'} bg-zinc-950/90 backdrop-blur-md`}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Späť</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className={`px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer ${
                step === 1 ? 'w-full sm:w-auto justify-center' : ''
              } ${
                step === 2 && !termsAccepted
                  ? 'bg-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <span>{step === 1 ? 'Pokračovať na údaje' : 'Prejsť k platbe'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 3 back button */}
        {step === 3 && (
          <div className="p-4 sm:p-5 flex items-center justify-start bg-zinc-950/90 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setStripeError('');
              }}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť na údaje</span>
            </button>
          </div>
        )}

        {/* Step 4 close */}
        {step === 4 && (
          <div className="p-4 sm:p-5 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md">
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
