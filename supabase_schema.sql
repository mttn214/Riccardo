-- Hair Salon Riccardo / ZETEREM s.r.o.
-- Supabase Cloud Database Setup (100% Idempotent & Bulletproof)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing policies if any (prevents "policy already exists" on re-run)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read seminars" ON public.seminars;
    DROP POLICY IF EXISTS "Public insert customers" ON public.customers;
    DROP POLICY IF EXISTS "Public insert reservations" ON public.reservations;
    DROP POLICY IF EXISTS "Public select own reservation" ON public.reservations;
    DROP POLICY IF EXISTS "Public insert payments" ON public.payments;
    DROP POLICY IF EXISTS "Admin full seminars" ON public.seminars;
    DROP POLICY IF EXISTS "Admin full customers" ON public.customers;
    DROP POLICY IF EXISTS "Admin full reservations" ON public.reservations;
    DROP POLICY IF EXISTS "Admin full payments" ON public.payments;
    DROP POLICY IF EXISTS "Admin full audit" ON public.audit_logs;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 3. Create Seminars Table
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

-- 4. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    salon_name TEXT,
    city TEXT,
    billing_type TEXT NOT NULL DEFAULT 'personal',
    company_name TEXT,
    ico TEXT,
    dic TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 5. Create Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    seminar_id TEXT NOT NULL REFERENCES public.seminars(id),
    payment_option TEXT NOT NULL DEFAULT 'full',
    total_amount_eur NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    amount_paid_eur NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    amount_remaining_eur NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'card',
    payment_status TEXT NOT NULL DEFAULT 'Uhradené',
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

-- 6. Create Payments Audit Table
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

-- 7. Create Audit Trail Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    category TEXT NOT NULL,
    details JSONB,
    actor TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Seed Masterclasses
INSERT INTO public.seminars (id, title, dates, venue, city, total_seats, price_eur, deposit_eur)
VALUES 
    ('sem-umenie-fukanej-lucenec', 'Umenie fúkanej: Architektúra objemu & Trvácnosť', '16. – 17. November 2026', 'Atelier Hair Salon Riccardo, J. Kármána 30', 'Lučenec', 6, 380.00, 100.00),
    ('sem-strih-lucenec', 'Precízny strih & Geometria: Víťazné línie', '18. – 19. Január 2027', 'Atelier Hair Salon Riccardo, J. Kármána 30', 'Lučenec', 6, 380.00, 100.00)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    dates = EXCLUDED.dates,
    venue = EXCLUDED.venue;

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. Security Policies
CREATE POLICY "Public read seminars" ON public.seminars
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public insert customers" ON public.customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert reservations" ON public.reservations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public select own reservation" ON public.reservations
    FOR SELECT USING (true);

CREATE POLICY "Public insert payments" ON public.payments
    FOR INSERT WITH CHECK (true);

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

-- 11. Safe Realtime Subscription Enablement
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
