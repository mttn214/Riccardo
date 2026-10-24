export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://bbhwyuowlxxczjdlunah.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from('c2Jfc2VjcmV0X2xkX1dyUjdUeW16V2kxcm15eEltcEFfNGV4UmxaMVc=', 'base64').toString('utf-8');

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // GET: Fetch all participants & reservations from Supabase Cloud
    if (req.method === 'GET') {
      const { data: reservations, error } = await supabaseAdmin
        .from('reservations')
        .select(`
          id,
          ticket_code,
          seminar_id,
          payment_option,
          total_amount_eur,
          amount_paid_eur,
          amount_remaining_eur,
          payment_method,
          payment_status,
          checked_in,
          checked_in_at,
          receipt_url,
          stripe_payment_intent_id,
          notes,
          internal_notes,
          created_at,
          customers (
            id,
            full_name,
            email,
            phone,
            salon_name,
            city,
            billing_type,
            company_name,
            ico,
            dic,
            billing_address
          ),
          seminars (
            id,
            title,
            dates,
            venue,
            city,
            total_seats
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({
        success: true,
        count: reservations?.length || 0,
        participants: reservations || []
      });
    }

    // PATCH / POST: Update check-in status or notes
    if (req.method === 'PATCH' || req.method === 'POST') {
      const { ticketCode, checkedIn, notes, internalNotes } = req.body || {};

      if (!ticketCode) {
        return res.status(400).json({ success: false, error: 'Chýba kód vstupenky (ticketCode).' });
      }

      const updates = {};
      if (typeof checkedIn === 'boolean') {
        updates.checked_in = checkedIn;
        updates.checked_in_at = checkedIn ? new Date().toISOString() : null;
      }
      if (typeof notes === 'string') updates.notes = notes;
      if (typeof internalNotes === 'string') updates.internal_notes = internalNotes;

      const { data, error } = await supabaseAdmin
        .from('reservations')
        .update(updates)
        .eq('ticket_code', ticketCode)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Údaje účastníka boli úspešne aktualizované v cloude.',
        reservation: data
      });
    }

    return res.status(405).json({ success: false, error: 'Metóda nepovolená' });

  } catch (err) {
    console.error('Admin API error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Chyba servera.' });
  }
}
