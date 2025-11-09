-- Create profiles tableTraditional Indian ice cream
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update orders table to link to users
ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update orders RLS policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Authenticated users can create orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Update order_items RLS to allow viewing
CREATE POLICY "Users can view order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Add more menu items
INSERT INTO public.menu_items (name, description, price, category, image_url) VALUES
('Butter Chicken', 'Tender chicken in creamy tomato and butter gravy', 180.00, 'Main Course', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400'),
('Dal Makhani', 'Creamy black lentils slow-cooked with spices', 110.00, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400'),
('Tandoori Roti', 'Whole wheat flatbread cooked in tandoor', 20.00, 'Breads', 'https://images.unsplash.com/photo-1619970498254-b4cb7293d42b?auto=format&fit=crop&w=400'),
('Garlic Naan', 'Leavened bread with garlic and butter', 35.00, 'Breads', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400'),
('Samosa', 'Crispy pastry filled with spiced potatoes', 30.00, 'Starters', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400'),
('Paneer Tikka', 'Marinated cottage cheese grilled to perfection', 140.00, 'Starters', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400'),
('Raita', 'Yogurt with cucumber and spices', 40.00, 'Sides', 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=400'),
('Mango Lassi', 'Sweet yogurt drink with mango', 50.00, 'Beverages', 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?auto=format&fit=crop&w=400'),
('Ras Malai', 'Soft cheese dumplings in sweet milk', 60.00, 'Desserts', 'https://images.unsplash.com/photo-1631177146820-a40b8f936b18?auto=format&fit=crop&w=400'),
('Kulfi', 'Traditional Indian ice cream', 45.00, 'Desserts', 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?auto=format&fit=crop&w=400'),
('Chicken Biryani', 'Aromatic rice with tender chicken pieces', 200.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400'),
('Palak Paneer', 'Cottage cheese in spinach gravy', 150.00, 'Main Course', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400'),
('Chole Bhature', 'Chickpeas curry with fried bread', 120.00, 'Main Course', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400'),
('Masala Dosa', 'Crispy rice crepe with potato filling', 90.00, 'Breakfast', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400'),
('Idli Sambar', 'Steamed rice cakes with lentil soup', 70.00, 'Breakfast', 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400'),
('Pav Bhaji', 'Mixed vegetable curry with bread rolls', 100.00, 'Snacks', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400'),
('Vada Pav', 'Spiced potato fritter in bread bun', 40.00, 'Snacks', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400'),
('Gulab Jamun', 'Sweet milk dumplings in sugar syrup', 50.00, 'Desserts', 'https://images.unsplash.com/photo-1589119908995-c6c1f8b9ccc4?auto=format&fit=crop&w=400'),
('Chai', 'Indian spiced tea', 20.00, 'Beverages', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=400'),
('Lassi', 'Sweet yogurt drink', 40.00, 'Beverages', 'https://images.unsplash.com/photo-1564385494738-009769e803e4?auto=format&fit=crop&w=400'),
('Aloo Paratha', 'Stuffed potato flatbread', 60.00, 'Breads', 'https://images.unsplash.com/photo-1619970499969-b078b7e34aa5?auto=format&fit=crop&w=400'),
('Butter Naan', 'Leavened bread with butter', 30.00, 'Breads', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400'),
('Paneer Butter Masala', 'Cottage cheese in rich tomato gravy', 170.00, 'Main Course', 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=400');