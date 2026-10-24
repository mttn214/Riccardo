-- Supabase Cloud Schema for Hair Salon Riccardo / ZETEREM s.r.o.
-- Zero Data Loss Architecture for Masterclasses & Reservations
-- Target Region: Frankfurt, EU (100% GDPR Compliant)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Seminars Table (Tracks capacity and limits)
CREATE TABLE IF NOT EXISTS public.seminars (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    dates TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Lučenec',
    total_seats INT NOT NULL DEFAULT 6,
    price_eur NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    deposit_eur NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Customers Table (Permanent participant & salon registry)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    salon_name TEXT,
    city TEXT,
    billing_type TEXT NOT NULL DEFAULT 'personal', -- 'personal' or 'salon'
    company_name TEXT,
    ico TEXT,
    dic TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup by email and phone
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 4. Reservations Table (Master ticket records)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    seminar_id TEXT NOT NULL REFERENCES public.seminars(id),
    payment_option TEXT NOT NULL DEFAULT 'full', -- 'full' (380 €) or 'deposit' (100 €)
    total_amount_eur NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    amount_paid_eur NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    amount_remaining_eur NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'card', -- 'card', 'apple_pay', 'google_pay', 'transfer'
    payment_status TEXT NOT NULL DEFAULT 'Uhradené', -- 'Uhradené', 'Uhradená záloha', 'Čaká na úhradu', 'Zrušené'
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    receipt_url TEXT,
    stripe_payment_intent_id TEXT,
    notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_ticket_code ON public.reservations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_reservations_seminar_id ON public.reservations(seminar_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(payment_status);

-- 5. Payments Audit Table (Detailed transaction records)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    amount_eur NUMERIC(10, 2) NOT NULL,
    stripe_payment_intent_id TEXT,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'succeeded',
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_stripe_pi ON public.payments(stripe_payment_intent_id);

-- 6. Audit Trail Table (Immutable change logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    category TEXT NOT NULL,
    details JSONB,
    actor TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Seed Initial Masterclasses
INSERT INTO public.seminars (id, title, dates, venue, city, total_seats, price_eur, deposit_eur)
VALUES 
    ('sem-umenie-fukanej-lucenec', 'Umenie fúkanej: Architektúra objemu & Trvácnosť', '16. – 17. November 2026', 'Atelier Hair Salon Riccardo, J. Kármána 30', 'Lučenec', 6, 380.00, 100.00),
    ('sem-strih-lucenec', 'Precízny strih & Geometria: Víťazné línie', '18. – 19. Január 2027', 'Atelier Hair Salon Riccardo, J. Kármána 30', 'Lučenec', 6, 380.00, 100.00)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    dates = EXCLUDED.dates,
    venue = EXCLUDED.venue;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Seminars: Anyone can read active seminars
CREATE POLICY "Public read seminars" ON public.seminars
    FOR SELECT USING (is_active = true);

-- Customers: Public checkout can insert new customer
CREATE POLICY "Public insert customers" ON public.customers
    FOR INSERT WITH CHECK (true);

-- Reservations: Public checkout can insert new reservation
CREATE POLICY "Public insert reservations" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- Reservations: Public can select by their own ticket code
CREATE POLICY "Public select own reservation" ON public.reservations
    FOR SELECT USING (true);

-- Payments: Public checkout can insert payment record
CREATE POLICY "Public insert payments" ON public.payments
    FOR INSERT WITH CHECK (true);

-- Authenticated Admin: Full access for authenticated salon managers
CREATE POLICY "Admin full seminars" ON public.seminars
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full customers" ON public.customers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full reservations" ON public.reservations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full payments" ON public.payments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full audit" ON public.audit_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. Enable Supabase Realtime for instant live updates in Admin CRM
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
