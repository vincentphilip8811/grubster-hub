import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <User className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl">My Profile</CardTitle>
              </div>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[hsl(14_100%_57%)] hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
