import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface School {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
}

export function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch schools",
      });
    } else {
      setSchools(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSchool) {
      const { error } = await supabase
        .from("schools")
        .update(formData)
        .eq("id", editingSchool.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update school",
        });
      } else {
        toast({
          title: "Success",
          description: "School updated successfully",
        });
        fetchSchools();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("schools").insert([formData]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create school",
        });
      } else {
        toast({
          title: "Success",
          description: "School created successfully",
        });
        fetchSchools();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return;

    const { error } = await supabase.from("schools").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete school",
      });
    } else {
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
      fetchSchools();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", phone: "", email: "" });
    setEditingSchool(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address || "",
      phone: school.phone || "",
      email: school.email || "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schools</h1>
          <p className="text-muted-foreground">Manage school information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchool ? "Edit School" : "Add New School"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSchool ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <Card key={school.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{school.name}</h3>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(school)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(school.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {school.address && <p>{school.address}</p>}
              {school.phone && <p>Phone: {school.phone}</p>}
              {school.email && <p>Email: {school.email}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
