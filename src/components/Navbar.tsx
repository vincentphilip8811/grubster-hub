import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, User, ShoppingBag, LogOut, Home, MessageSquare, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors">
            <Utensils className="h-8 w-8 text-primary" />
            <span>FIRE CRAFT</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link to="/#menu">
              <Button variant="ghost" className="gap-2">
                <Menu className="h-4 w-4" />
                <span className="hidden md:inline">Menu</span>
              </Button>
            </Link>
            <Link to="/feedback">
              <Button variant="ghost" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:inline">Feedback</span>
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="hidden md:inline">My Orders</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Profile</span>
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-[hsl(14_100%_57%)] hover:opacity-90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
