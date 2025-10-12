import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Subject {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  credit_hours: number | null;
  department: string | null;
}

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credit_hours: "",
    department: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch subjects",
      });
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      name: formData.name,
      code: formData.code || null,
      description: formData.description || null,
      credit_hours: formData.credit_hours ? parseInt(formData.credit_hours) : null,
      department: formData.department || null,
    };

    if (editingSubject) {
      const { error } = await supabase
        .from("subjects")
        .update(dataToSubmit)
        .eq("id", editingSubject.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update subject",
        });
      } else {
        toast({
          title: "Success",
          description: "Subject updated successfully",
        });
        fetchSubjects();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("subjects").insert([dataToSubmit]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create subject",
        });
      } else {
        toast({
          title: "Success",
          description: "Subject created successfully",
        });
        fetchSubjects();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subject",
      });
    } else {
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });
      fetchSubjects();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      credit_hours: "",
      department: "",
    });
    setEditingSubject(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || "",
      description: subject.description || "",
      credit_hours: subject.credit_hours?.toString() || "",
      department: subject.department || "",
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
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects and courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Subject Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., MATH-101"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Science"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="credit_hours">Credit Hours</Label>
                <Input
                  id="credit_hours"
                  type="number"
                  placeholder="e.g., 3"
                  value={formData.credit_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, credit_hours: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSubject ? "Update" : "Create"}
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
        {subjects.map((subject) => (
          <Card key={subject.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{subject.name}</h3>
                  {subject.code && (
                    <Badge variant="secondary" className="mt-1">
                      {subject.code}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(subject)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(subject.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {subject.department && <p>Department: {subject.department}</p>}
              {subject.credit_hours && <p>Credits: {subject.credit_hours}</p>}
              {subject.description && (
                <p className="line-clamp-2">{subject.description}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
