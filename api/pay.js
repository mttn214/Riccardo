import Stripe from 'stripe';

// Read secret key securely from environment variables (configured in Vercel & .env.local)
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET || '', {
  apiVersion: '2024-12-18.acacia'
});

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metóda nepovolená' });
  }

  if (!STRIPE_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'STRIPE_SECRET_KEY nie je nakonfigurovaný v prostredí.'
    });
  }

  try {
    const {
      amountEUR,
      tokenId,
      paymentMethodId,
      customerName,
      customerEmail,
      customerPhone,
      seminarTitle,
      ticketId,
      paymentType
    } = req.body;

    if (!amountEUR || amountEUR <= 0) {
      return res.status(400).json({ success: false, error: 'Neplatná suma platby.' });
    }

    const amountInCents = Math.round(Number(amountEUR) * 100);

    let paymentIntent;

    if (paymentMethodId) {
      // 1. Authorize via Stripe PaymentMethod ID (Apple Pay / Google Pay)
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: 'https://riccardo-zednici.vercel.app',
        description: `Hair Salon Riccardo — ${seminarTitle || 'Masterclass'} (${customerName || 'Zákazník'})`,
        receipt_email: customerEmail || undefined,
        metadata: {
          prevadzkovatel: 'zeterem s.r.o.',
          zakaznik: customerName || 'Neuvedené',
          email: customerEmail || 'Neuvedené',
          telefon: customerPhone || 'Neuvedené',
          seminar: seminarTitle || 'Neuvedené',
          vstupenka_kod: ticketId || 'Neuvedené',
          sposob_platby: paymentType || 'apple_pay'
        }
      });
    } else if (tokenId) {
      // 2. Authorize via Stripe Card Token ID
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        payment_method_data: {
          type: 'card',
          card: { token: tokenId }
        },
        confirm: true,
        return_url: 'https://riccardo-zednici.vercel.app',
        description: `Hair Salon Riccardo — ${seminarTitle || 'Masterclass'} (${customerName || 'Zákazník'})`,
        receipt_email: customerEmail || undefined,
        metadata: {
          prevadzkovatel: 'zeterem s.r.o.',
          zakaznik: customerName || 'Neuvedené',
          email: customerEmail || 'Neuvedené',
          telefon: customerPhone || 'Neuvedené',
          seminar: seminarTitle || 'Neuvedené',
          vstupenka_kod: ticketId || 'Neuvedené',
          sposob_platby: 'platobna_karta'
        }
      });
    } else {
      // 3. Create fresh PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        description: `Hair Salon Riccardo — ${seminarTitle || 'Masterclass'} (${customerName || 'Zákazník'})`,
        receipt_email: customerEmail || undefined,
        metadata: {
          prevadzkovatel: 'zeterem s.r.o.',
          zakaznik: customerName || 'Neuvedené',
          email: customerEmail || 'Neuvedené',
          telefon: customerPhone || 'Neuvedené',
          seminar: seminarTitle || 'Neuvedené',
          vstupenka_kod: ticketId || 'Neuvedené'
        }
      });
    }

    return res.status(200).json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Chyba Stripe spracovania:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Nastala chyba pri autorizácii platby v systéme Stripe.'
    });
  }
}
