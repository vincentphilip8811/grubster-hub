import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MenuCard from "@/components/MenuCard";
import Cart, { CartItem } from "@/components/Cart";
import CheckoutDialog from "@/components/CheckoutDialog";
import { Utensils } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  available: boolean;
}

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("category");

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.image_url || undefined
      }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <header className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
          <Utensils className="h-16 w-16 text-primary mb-4 animate-float" />
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Delicious Food
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md">
            Order your favorite meals and get them delivered hot & fresh
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading menu...</p>
              </div>
            ) : (
              Object.entries(groupedMenuItems).map(([category, items]) => (
                <section key={category} className="animate-slide-up">
                  <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                    <span className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    {category}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <MenuCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description || undefined}
                        price={item.price}
                        imageUrl={item.image_url || undefined}
                        onAddToCart={() => addToCart(item)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartItems={cartItems}
        total={cartTotal}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
};

export default Index;
