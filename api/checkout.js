import Stripe from 'stripe';

export default async function handler(req, res) {
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

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'STRIPE_SECRET_KEY nie je nastavený.'
    });
  }

  const stripe = new Stripe(STRIPE_SECRET);

  try {
    const {
      amountEUR,
      seminarTitle,
      customerName,
      customerEmail,
      customerPhone,
      ticketId,
      tierName,
      paymentMethod = 'apple_pay'
    } = req.body || {};

    if (!amountEUR || amountEUR <= 0) {
      return res.status(400).json({ success: false, error: 'Neplatná suma platby.' });
    }

    const origin = req.headers.origin || 'https://riccardo-zednici.vercel.app';
    const amountInCents = Math.round(Number(amountEUR) * 100);

    const session = await stripe.checkout.sessions.create({
      line_items: [

        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Hair Salon Riccardo — ${seminarTitle || 'Masterclass'}`,
              description: `Rezervácia kurzu (${tierName || 'Účasť'}). Prevádzkovateľ: zeterem s.r.o. Kód: ${ticketId || 'RIC-VIP'}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      metadata: {
        prevadzkovatel: 'zeterem s.r.o.',
        zakaznik: customerName || 'Neuvedené',
        email: customerEmail || 'Neuvedené',
        telefon: customerPhone || 'Neuvedené',
        seminar: seminarTitle || 'Neuvedené',
        vstupenka_kod: ticketId || 'Neuvedené',
        sposob_platby: paymentMethod
      },
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Chyba vytvorenia Stripe Checkout session:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Nepodarilo sa vytvoriť platobnú reláciu.'
    });
  }
}
