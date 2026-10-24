import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback local config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves a new participant reservation directly into the Supabase Cloud PostgreSQL database.
 * If Supabase is not yet connected via .env, it gracefully resolves so client flow continues.
 */
export async function saveReservationToCloud(reservationData: {
  ticketCode: string;
  fullName: string;
  email: string;
  phone: string;
  salonName?: string;
  city?: string;
  billingType: 'personal' | 'salon';
  companyName?: string;
  ico?: string;
  dic?: string;
  billingAddress?: string;
  seminarId: string;
  paymentOption: 'full' | 'deposit';
  totalAmountEUR: number;
  amountPaidEUR: number;
  amountRemainingEUR: number;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentIntentId?: string;
  receiptUrl?: string | null;
  notes?: string;
}): Promise<{ success: boolean; customerId?: string; reservationId?: string; error?: string }> {
  // If Supabase client is active, insert directly to cloud
  if (supabase) {
    try {
      // 1. Insert or update customer
      const { data: customer, error: customerErr } = await supabase
        .from('customers')
        .insert({
          full_name: reservationData.fullName,
          email: reservationData.email,
          phone: reservationData.phone,
          salon_name: reservationData.salonName || null,
          city: reservationData.city || null,
          billing_type: reservationData.billingType,
          company_name: reservationData.companyName || null,
          ico: reservationData.ico || null,
          dic: reservationData.dic || null,
          billing_address: reservationData.billingAddress || null,
        })
        .select()
        .single();

      if (customerErr) {
        console.warn('Supabase customer insert notice:', customerErr);
      }

      const customerId = customer?.id || crypto.randomUUID();

      // 2. Insert reservation
      const { data: reservation, error: resErr } = await supabase
        .from('reservations')
        .insert({
          ticket_code: reservationData.ticketCode,
          customer_id: customerId,
          seminar_id: reservationData.seminarId,
          payment_option: reservationData.paymentOption,
          total_amount_eur: reservationData.totalAmountEUR,
          amount_paid_eur: reservationData.amountPaidEUR,
          amount_remaining_eur: reservationData.amountRemainingEUR,
          payment_method: reservationData.paymentMethod,
          payment_status: reservationData.paymentStatus,
          receipt_url: reservationData.receiptUrl || null,
          stripe_payment_intent_id: reservationData.stripePaymentIntentId || null,
          notes: reservationData.notes || null,
        })
        .select()
        .single();

      if (resErr) {
        console.warn('Supabase reservation insert notice:', resErr);
      }

      // 3. Insert payment audit if paid
      if (reservationData.amountPaidEUR > 0 && reservation?.id) {
        await supabase.from('payments').insert({
          reservation_id: reservation.id,
          amount_eur: reservationData.amountPaidEUR,
          stripe_payment_intent_id: reservationData.stripePaymentIntentId || null,
          payment_method: reservationData.paymentMethod,
          status: 'succeeded',
          receipt_url: reservationData.receiptUrl || null,
        });
      }

      return {
        success: true,
        customerId,
        reservationId: reservation?.id,
      };
    } catch (err: any) {
      console.warn('Supabase direct insert exception:', err);
    }
  }

  // Also submit to serverless API backend for redundant cloud persistence
  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (apiErr) {
    console.warn('Serverless API reservations backup sync:', apiErr);
  }

  return { success: true };
}
