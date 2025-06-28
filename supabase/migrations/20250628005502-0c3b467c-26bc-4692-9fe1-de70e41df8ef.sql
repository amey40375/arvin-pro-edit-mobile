
-- Update users table to match the current structure
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP DEFAULT NOW();

-- Create table for marquee text and promo settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.app_settings (key, value) 
VALUES 
  ('marque_text', '"Selamat datang di ARVIN PROFESSIONAL EDITING - Layanan terbaik untuk kebutuhan editing Anda!"'::jsonb),
  ('promo_settings', '{"enabled": false, "title": "", "content": "", "image": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Update orders table structure
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Update chat_messages table structure to match LiveChat component
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS sender TEXT,
ADD COLUMN IF NOT EXISTS sender_email TEXT,
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS reply_to TEXT;

-- Add RLS policies for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert new users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update users" ON public.users FOR UPDATE USING (true);

-- RLS policies for orders table
CREATE POLICY "Users can view all orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update orders" ON public.orders FOR UPDATE USING (true);

-- RLS policies for invoices table
CREATE POLICY "Users can view all invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Users can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);

-- RLS policies for chat_messages table
CREATE POLICY "Users can view all chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- RLS policies for app_settings table
CREATE POLICY "Users can view app settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update app settings" ON public.app_settings FOR UPDATE USING (true);
CREATE POLICY "Admins can insert app settings" ON public.app_settings FOR INSERT WITH CHECK (true);
