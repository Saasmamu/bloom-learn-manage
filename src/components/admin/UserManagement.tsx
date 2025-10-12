import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, GraduationCap, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface UserWithRole {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name");

    if (profilesError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
      setLoading(false);
      return;
    }

    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch roles",
      });
      setLoading(false);
      return;
    }

    const usersWithRoles: UserWithRole[] = profilesData.map((profile) => {
      const roleData = rolesData.find((r) => r.user_id === profile.id);

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: "User email", // Email display removed for privacy
        role: roleData?.role || "student",
      };
    });

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId: string, newRole: "student" | "teacher" | "admin") => {
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
      return;
    }

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role: newRole as any }]);

    if (insertError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User role updated successfully",
    });

    fetchUsers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "teacher":
        return <BookOpen className="h-4 w-4" />;
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "teacher":
        return "secondary";
      case "student":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </div>

              <div>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as "student" | "teacher" | "admin")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Change role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}
