import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentDialog = ({ open, onOpenChange, orderId, amount, onPaymentComplete }: PaymentDialogProps) => {
  const [method, setMethod] = useState<"card" | "upi" | "payapps">("card");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!orderId) return;
    setLoading(true);

    try {
      // In a real app you'd redirect to a payment gateway here.
      // For demo purposes we update the order status to `paid`.
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid", payment_method: method })
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Payment successful", {
        description: `Paid ₹${amount.toFixed(2)} via ${method.toUpperCase()}`,
      });

      onOpenChange(false);
      onPaymentComplete();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>
            Pay ₹{amount.toFixed(2)} for your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="mb-2">Select method</Label>
            <div className="flex gap-2">
              <Button variant={method === "card" ? "default" : "outline"} onClick={() => setMethod("card")}>
                Card
              </Button>
              <Button variant={method === "upi" ? "default" : "outline"} onClick={() => setMethod("upi")}>
                UPI
              </Button>
              <Button variant={method === "payapps" ? "default" : "outline"} onClick={() => setMethod("payapps")}>
                PayApps
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handlePay} className="w-full bg-gradient-to-r from-primary to-[hsl(14_100%_57%)]" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)} via ${method.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
