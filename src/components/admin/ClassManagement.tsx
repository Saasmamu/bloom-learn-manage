import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GraduationCap, Users } from "lucide-react";
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

interface Class {
  id: string;
  name: string;
  level: number | null;
  description: string | null;
  academic_year_id: string | null;
}

interface AcademicYear {
  id: string;
  year_name: string;
}

export function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [sections, setSections] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    description: "",
    academic_year_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [classesResult, yearsResult, sectionsResult] = await Promise.all([
      supabase.from("classes").select("*").order("level", { ascending: true }),
      supabase.from("academic_years").select("id, year_name"),
      supabase.from("sections").select("class_id"),
    ]);

    if (classesResult.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch classes",
      });
    } else {
      setClasses(classesResult.data || []);
    }

    if (yearsResult.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch academic years",
      });
    } else {
      setAcademicYears(yearsResult.data || []);
    }

    if (sectionsResult.data) {
      const sectionCounts: Record<string, number> = {};
      sectionsResult.data.forEach((section) => {
        sectionCounts[section.class_id] = (sectionCounts[section.class_id] || 0) + 1;
      });
      setSections(sectionCounts);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      name: formData.name,
      level: formData.level ? parseInt(formData.level) : null,
      description: formData.description || null,
      academic_year_id: formData.academic_year_id || null,
    };

    if (editingClass) {
      const { error } = await supabase
        .from("classes")
        .update(dataToSubmit)
        .eq("id", editingClass.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update class",
        });
      } else {
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("classes").insert([dataToSubmit]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create class",
        });
      } else {
        toast({
          title: "Success",
          description: "Class created successfully",
        });
        fetchData();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete class",
      });
    } else {
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: "",
      description: "",
      academic_year_id: "",
    });
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      level: classItem.level?.toString() || "",
      description: classItem.description || "",
      academic_year_id: classItem.academic_year_id || "",
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
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage class levels and groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Edit Class" : "Add New Class"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Grade 10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
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
              <div>
                <Label htmlFor="academic_year_id">Academic Year (Optional)</Label>
                <Select
                  value={formData.academic_year_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, academic_year_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.year_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingClass ? "Update" : "Create"}
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
        {classes.map((classItem) => (
          <Card key={classItem.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                  {classItem.level && (
                    <Badge variant="secondary" className="mt-1">
                      Level {classItem.level}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(classItem)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(classItem.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {classItem.description && <p>{classItem.description}</p>}
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <span>{sections[classItem.id] || 0} sections</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
