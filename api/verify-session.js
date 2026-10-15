import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return res.status(500).json({ success: false, error: 'STRIPE_SECRET_KEY chýba.' });
  }

  const stripe = new Stripe(STRIPE_SECRET);

  try {
    const sessionId = req.query.sessionId || req.body?.sessionId;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Chýba sessionId.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      paid: session.payment_status === 'paid',
      status: session.status,
      paymentIntentId: session.payment_intent,
      customerEmail: session.customer_details?.email || session.customer_email,
      customerName: session.customer_details?.name,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Chyba overenia session:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Nepodarilo sa overiť reláciu.'
    });
  }
}
