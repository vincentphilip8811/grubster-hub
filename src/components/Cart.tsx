import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center bg-card/50 backdrop-blur-sm">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Your cart is empty</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sticky top-4 bg-card/80 backdrop-blur-md border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Cart
        </h2>
        <Badge variant="secondary" className="text-lg px-3">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </Badge>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-gradient-to-br from-background/50 to-muted/20 hover:shadow-md transition-all">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
              <p className="text-sm text-primary font-bold">₹{item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-auto text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-foreground">Total:</span>
          <span className="text-primary text-2xl">₹{total.toFixed(2)}</span>
        </div>
        <Button 
          onClick={onCheckout} 
          className="w-full bg-gradient-to-r from-primary to-[hsl(14_100%_57%)] hover:opacity-90 transition-opacity text-lg py-6"
        >
          Checkout
        </Button>
      </div>
    </Card>
  );
};

export default Cart;
