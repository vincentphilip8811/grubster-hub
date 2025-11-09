import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { ShoppingBag, Package, Clock } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  order_items: {
    quantity: number;
    item_price: number;
    menu_items: {
      name: string;
      image_url: string | null;
    };
  }[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            item_price,
            menu_items (
              name,
              image_url
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
              <ShoppingBag className="h-10 w-10 text-primary" />
              My Orders
            </h1>
            <p className="text-muted-foreground">Track and manage your food orders</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                <a href="/" className="text-primary hover:underline">
                  Start ordering now
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">Order #{order.id.slice(0, 8)}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(order.created_at), "PPp")}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.order_items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          {item.menu_items.image_url && (
                            <img
                              src={item.menu_items.image_url}
                              alt={item.menu_items.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.menu_items.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} × ₹{item.item_price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              ₹{(item.quantity * item.item_price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary text-2xl">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
