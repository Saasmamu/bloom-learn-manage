import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Loader2,
  Shield
} from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    phone: "",
    address: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        bio: data.bio || "",
        phone: data.phone || "",
        address: data.address || "",
        date_of_birth: data.date_of_birth || "",
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          bio: formData.bio || null,
          phone: formData.phone || null,
          address: formData.address || null,
          date_of_birth: formData.date_of_birth || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and update your personal information</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {profile ? getInitials(profile.full_name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="capitalize flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {userRole || "User"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </Badge>
              </div>
              {profile?.bio && (
                <p className="text-muted-foreground max-w-md">{profile.bio}</p>
              )}
            </div>
            <div className="md:ml-auto">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{profile?.full_name || "-"}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {profile?.date_of_birth 
                    ? format(new Date(profile.date_of_birth), "MMMM d, yyyy") 
                    : "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm py-2">{profile?.bio || "No bio added yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription>How to reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm py-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user?.email}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {profile?.phone || "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  placeholder="Your address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              ) : (
                <p className="text-sm py-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {profile?.address || "Not set"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="font-medium mt-1">
                {profile?.created_at 
                  ? format(new Date(profile.created_at), "MMMM d, yyyy") 
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="font-medium mt-1">
                {profile?.updated_at 
                  ? format(new Date(profile.updated_at), "MMMM d, yyyy") 
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Account Status</Label>
              <div className="mt-1">
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
