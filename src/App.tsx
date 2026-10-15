import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Seminar, PortfolioItem, SEMINARS_DATA, STYLIST_PROFILE } from './data/content';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { SeminarDetailModal } from './components/SeminarDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { PortfolioModal } from './components/PortfolioModal';
import { HomePage } from './pages/HomePage';
import { SeminarsPage } from './pages/SeminarsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AwardsPage } from './pages/AwardsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { Phone, Calendar } from 'lucide-react';
import { verifyStripeSession } from './services/stripeService';
import { sendFormNotification } from './services/formService';

export function App() {
  // Modals
  const [detailSeminar, setDetailSeminar] = useState<Seminar | null>(null);
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSeminar, setBookingSeminar] = useState<Seminar | null>(null);
  const [bookingTierId, setBookingTierId] = useState<string | undefined>(undefined);
  const [initialBookingStep, setInitialBookingStep] = useState<1 | 2 | 3 | 4>(1);
  const [initialConfirmationCode, setInitialConfirmationCode] = useState<string>('');
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Detect return from Stripe Checkout (Apple Pay / Express Checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      window.history.replaceState({}, document.title, window.location.pathname);

      verifyStripeSession(sessionId).then(async (res) => {
        if (res.success && res.paid) {
          const saved = localStorage.getItem('riccardo_pending_booking');
          let bookingData: any = null;
          if (saved) {
            try {
              bookingData = JSON.parse(saved);
            } catch (e) {
              console.error(e);
            }
          }

          const seminar = bookingData?.seminar || SEMINARS_DATA[0];
          const tier = bookingData?.tier || seminar.tiers[0];
          const savedForm = bookingData?.formData || {};
          const customerName = savedForm.fullName || res.customerName || 'Vážený zákazník';
          const customerEmail = savedForm.email || res.customerEmail || '';
          const customerPhone = savedForm.phone || '';
          const ticketCode = bookingData?.randomTicketId || `RIC-${seminar.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

          await sendFormNotification({
            formType: 'Rezervácia seminára',
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            'Názov seminára': seminar.title,
            'Termín konania': seminar.dates,
            'Miesto konania': `${seminar.venue}, ${seminar.city}`,
            'Zvolený balíček': `${tier.name} (${tier.priceEUR} €)`,
            'Spôsob platby': 'Apple Pay (Stripe Checkout)',
            'Stav platby': 'Uhradené cez Apple Pay (Stripe)',
            'Stripe Payment Intent ID': (typeof res.paymentIntentId === 'string' ? res.paymentIntentId : res.paymentIntentId?.id) || sessionId,
            'Platobný režim': 'Celá suma vopred',
            'Uhradená suma teraz': `${res.amountTotal || tier.priceEUR} €`,
            'Kód vstupenky': ticketCode,
            'Prevádzkovateľ eshopu': 'zeterem s.r.o.'
          });

          localStorage.removeItem('riccardo_pending_booking');

          setBookingSeminar(seminar);
          setBookingTierId(tier.id);
          setInitialBookingStep(4);
          setInitialConfirmationCode(ticketCode);
          setInitialFormData({
            ...savedForm,
            fullName: customerName,
            email: customerEmail,
            phone: customerPhone
          });
          setIsBookingOpen(true);
        }
      });
    }
  }, []);

  const handleOpenBooking = (seminar?: Seminar, tierId?: string) => {
    setBookingSeminar(seminar || SEMINARS_DATA[0]);
    setBookingTierId(tierId);
    setInitialBookingStep(1);
    setInitialConfirmationCode('');
    setIsBookingOpen(true);
  };


  const handleSelectTierFromDetail = (seminar: Seminar, tierId: string) => {
    setDetailSeminar(null);
    handleOpenBooking(seminar, tierId);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      <ScrollToTop />

      {/* Global Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Routed Content */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenBooking={() => handleOpenBooking()}
                onSelectPortfolioItem={(item) => setPortfolioItem(item)}
              />
            }
          />
          <Route
            path="/seminare"
            element={
              <SeminarsPage
                onOpenDetail={(sem) => setDetailSeminar(sem)}
                onBookSeminar={(sem) => handleOpenBooking(sem)}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <PortfolioPage
                onSelectItem={(item) => setPortfolioItem(item)}
              />
            }
          />
          <Route path="/ocenenia" element={<AwardsPage />} />
          <Route path="/referencie" element={<TestimonialsPage />} />
          <Route path="/salon" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Action Pill */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <a
          href={`tel:${STYLIST_PROFILE.phone.replace(/\s+/g, '')}`}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium backdrop-blur-md shadow-xl transition-all"
          title="Zavolať do salónu"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{STYLIST_PROFILE.phone}</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Rezervovať</span>
        </button>
      </div>

      {/* Modals */}
      <SeminarDetailModal
        seminar={detailSeminar}
        currency="EUR"
        onClose={() => setDetailSeminar(null)}
        onSelectTier={handleSelectTierFromDetail}
      />

      <ReservationModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setInitialBookingStep(1);
          setInitialConfirmationCode('');
        }}
        currency="EUR"
        initialSeminar={bookingSeminar}
        initialTierId={bookingTierId}
        initialStep={initialBookingStep}
        initialConfirmationCode={initialConfirmationCode}
        initialFormData={initialFormData}
      />

      <PortfolioModal
        item={portfolioItem}
        onClose={() => setPortfolioItem(null)}
      />
    </div>
  );
}

export default App;
