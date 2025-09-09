-- Create products table for food events
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  event_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out', 'upcoming')),
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  max_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT DEFAULT 'pix',
  pix_key TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to active products
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

-- Create policies for orders (customers can view their own orders by email)
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Admin policies (will be restricted later with proper auth)
CREATE POLICY "Admin can manage products" 
ON public.products 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage orders" 
ON public.orders 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample product for "Marmitas de Churrasco"
INSERT INTO public.products (name, description, price, event_date, slug, status) VALUES (
  'Marmitas de Churrasco',
  'Deliciosas marmitas com churrasco completo: carne, linguiça, acompanhamentos e sobremesa',
  25.00,
  now() + interval '7 days',
  'marmitas-churrasco',
  'active'
);