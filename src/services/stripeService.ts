import { loadStripe, Stripe, PaymentRequest } from '@stripe/stripe-js';

/**
 * Stripe Service for Hair Salon Riccardo / zeterem s.r.o.
 * Configured with user's Stripe Publishable Key.
 */
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51UQoDrHFKYzQN3E7Y5Fix2WRZT4EhqLQzqnlN40yTvdFbCxHnAiU2oSG15CxZoEQeF1lPKO6yuBaimp2vw3Ag32R00tzYoVzmA';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface CreateStripePaymentParams {
  amountEUR: number;
  title: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolder?: string;
}

/**
 * Creates and authorizes a payment via Stripe card tokenization.
 */
export async function processStripeCardPayment(params: CreateStripePaymentParams): Promise<{
  success: boolean;
  tokenId?: string;
  cardBrand?: string;
  last4?: string;
  error?: string;
}> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      return { success: false, error: 'Stripe platobná brána sa nedala načítať.' };
    }

    const [expMonthStr, expYearStr] = params.cardExpiry.split('/');
    const expMonth = parseInt(expMonthStr?.trim(), 10);
    let expYear = parseInt(expYearStr?.trim(), 10);
    if (expYear < 100) {
      expYear = 2000 + expYear;
    }

    const { token, error } = await stripe.createToken('card', {
      number: params.cardNumber.replace(/\s/g, ''),
      exp_month: expMonth,
      exp_year: expYear,
      cvc: params.cardCvc,
      name: params.cardHolder || params.name,
      address_city: params.city || undefined,
      address_line1: params.address || undefined,
      address_country: 'SK',
    });

    if (error || !token) {
      return {
        success: false,
        error: error?.message || 'Platobnú kartu sa nepodarilo autorizovať cez Stripe.'
      };
    }

    return {
      success: true,
      tokenId: token.id,
      cardBrand: token.card?.brand,
      last4: token.card?.last4
    };
  } catch (err: any) {
    console.error('Chyba Stripe:', err);
    return {
      success: false,
      error: err.message || 'Nastala neočakávaná chyba pri komunikácii so Stripe.'
    };
  }
}

/**
 * Setup native Apple Pay / Google Pay PaymentRequest using Stripe.
 */
export async function createStripePaymentRequest({
  amountEUR,
  title,
  onPaymentSuccess,
  onPaymentError
}: {
  amountEUR: number;
  title: string;
  onPaymentSuccess: (result: { paymentMethodId: string; payerName?: string; payerEmail?: string }) => void;
  onPaymentError: (errorMsg: string) => void;
}): Promise<{
  paymentRequest: PaymentRequest | null;
  canPayWithApplePay: boolean;
  canPayWithGooglePay: boolean;
}> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      return { paymentRequest: null, canPayWithApplePay: false, canPayWithGooglePay: false };
    }

    const pr = stripe.paymentRequest({
      country: 'SK',
      currency: 'eur',
      total: {
        label: `${title} (zeterem s.r.o.)`,
        amount: Math.round(amountEUR * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    const result = await pr.canMakePayment();

    if (!result) {
      return { paymentRequest: null, canPayWithApplePay: false, canPayWithGooglePay: false };
    }

    // Attach payment listener
    pr.on('paymentmethod', async (ev) => {
      try {
        ev.complete('success');
        onPaymentSuccess({
          paymentMethodId: ev.paymentMethod.id,
          payerName: ev.payerName,
          payerEmail: ev.payerEmail
        });
      } catch (err: any) {
        ev.complete('fail');
        onPaymentError(err.message || 'Zlyhala autorizácia Apple Pay / Google Pay.');
      }
    });

    return {
      paymentRequest: pr,
      canPayWithApplePay: Boolean(result.applePay),
      canPayWithGooglePay: Boolean(result.googlePay)
    };
  } catch (err) {
    console.warn('Stripe PaymentRequest inicializácia zlyhala:', err);
    return { paymentRequest: null, canPayWithApplePay: false, canPayWithGooglePay: false };
  }
}
