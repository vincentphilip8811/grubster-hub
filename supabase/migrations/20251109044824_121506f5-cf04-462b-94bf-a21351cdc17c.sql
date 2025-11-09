-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view menu)
CREATE POLICY "Anyone can view menu items" 
ON public.menu_items 
FOR SELECT 
USING (available = true);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting order items
CREATE POLICY "Anyone can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Insert sample menu items
INSERT INTO public.menu_items (name, description, price, category, image_url) VALUES
('Veg Biryani', 'Aromatic basmati rice cooked with mixed vegetables and spices', 70.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400'),
('Paneer Butter Masala', 'Creamy tomato-based curry with soft paneer cubes', 120.00, 'Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400'),
('Chicken Tikka', 'Marinated chicken pieces grilled to perfection', 150.00, 'Starters', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400'),
('Masala Dosa', 'Crispy rice crepe filled with spiced potato filling', 60.00, 'South Indian', 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400'),
('Gulab Jamun', 'Sweet milk-solid dumplings soaked in rose-flavored syrup', 40.00, 'Desserts', 'https://images.unsplash.com/photo-1643484365271-e1e037e93a8e?auto=format&fit=crop&w=400');