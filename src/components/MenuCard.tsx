import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: () => void;
}

const MenuCard = ({ name, description, price, imageUrl, onAddToCart }: MenuCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="aspect-video overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{price}</span>
          <Button
            onClick={onAddToCart}
            className="bg-gradient-to-r from-primary to-[hsl(14_100%_57%)] hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuCard;
