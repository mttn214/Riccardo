/**
 * Deprecated: Stripe Checkout Sessions are completely disabled in favor of
 * the in-place embedded Stripe Elements Console.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(410).json({
    success: false,
    error: 'Externé presmerovanie na Stripe Checkout je zrušené. Platba prebieha priamo na stránke cez Stripe konzolu.'
  });
}
