import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Megaphone, 
  Send,
  Users,
  GraduationCap,
  BookOpen,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  created_at: string;
  target_role?: string;
}

export function AnnouncementManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetRole: "all",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Fetch recent announcements (notifications sent by admin)
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("notification_type", "announcement")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Group by unique title+message+created_at to avoid duplicates
      const uniqueAnnouncements = new Map<string, Announcement>();
      data?.forEach(n => {
        const key = `${n.title}-${n.message}-${n.created_at.slice(0, 16)}`;
        if (!uniqueAnnouncements.has(key)) {
          uniqueAnnouncements.set(key, {
            id: n.id,
            title: n.title,
            message: n.message || "",
            notification_type: n.notification_type,
            created_at: n.created_at,
          });
        }
      });

      setAnnouncements(Array.from(uniqueAnnouncements.values()));
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching announcements:", error);
      setLoading(false);
    }
  };

  const sendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    setSending(true);

    try {
      // Get target users based on role
      let targetUsers: string[] = [];

      if (formData.targetRole === "all") {
        const { data: allUsers } = await supabase
          .from("profiles")
          .select("id")
          .neq("id", user?.id);
        targetUsers = allUsers?.map(u => u.id) || [];
      } else {
        const roleValue = formData.targetRole as "admin" | "teacher" | "student" | "parent";
        const { data: roleUsers } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", roleValue);
        targetUsers = roleUsers?.map(u => u.user_id).filter(id => id !== user?.id) || [];
      }

      if (targetUsers.length === 0) {
        toast({
          variant: "destructive",
          title: "No recipients",
          description: "No users found for the selected role",
        });
        setSending(false);
        return;
      }

      // Create notifications for all target users
      const notifications = targetUsers.map(userId => ({
        user_id: userId,
        notification_type: "announcement",
        title: formData.title,
        message: formData.message,
        link: null,
      }));

      const { error } = await supabase.from("notifications").insert(notifications);

      if (error) throw error;

      toast({
        title: "Announcement sent",
        description: `Sent to ${targetUsers.length} users`,
      });

      setFormData({ title: "", message: "", targetRole: "all" });
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send announcement",
      });
    } finally {
      setSending(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <BookOpen className="h-4 w-4" />;
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Send announcements to users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Send Announcement
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={sendAnnouncement} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Announcement title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your announcement..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetRole">Send to</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetRole: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        All Users
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Teachers Only
                      </div>
                    </SelectItem>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Students Only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={sending}>
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? "Sending..." : "Send Announcement"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Announcements</h2>
        {announcements.length === 0 ? (
          <Card className="p-8 text-center">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No announcements sent yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {announcement.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary">
                          {format(new Date(announcement.created_at), "MMM d, yyyy h:mm a")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
