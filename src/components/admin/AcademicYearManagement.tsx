import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Calendar, CheckCircle } from "lucide-react";
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

interface AcademicYear {
  id: string;
  year_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  school_id: string | null;
}

interface School {
  id: string;
  name: string;
}

export function AcademicYearManagement() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    year_name: "",
    start_date: "",
    end_date: "",
    is_current: false,
    school_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [yearsResult, schoolsResult] = await Promise.all([
      supabase.from("academic_years").select("*").order("start_date", { ascending: false }),
      supabase.from("schools").select("id, name"),
    ]);

    if (yearsResult.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch academic years",
      });
    } else {
      setAcademicYears(yearsResult.data || []);
    }

    if (schoolsResult.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch schools",
      });
    } else {
      setSchools(schoolsResult.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      school_id: formData.school_id || null,
    };

    if (editingYear) {
      const { error } = await supabase
        .from("academic_years")
        .update(dataToSubmit)
        .eq("id", editingYear.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update academic year",
        });
      } else {
        toast({
          title: "Success",
          description: "Academic year updated successfully",
        });
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("academic_years").insert([dataToSubmit]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create academic year",
        });
      } else {
        toast({
          title: "Success",
          description: "Academic year created successfully",
        });
        fetchData();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this academic year?")) return;

    const { error } = await supabase.from("academic_years").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete academic year",
      });
    } else {
      toast({
        title: "Success",
        description: "Academic year deleted successfully",
      });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      year_name: "",
      start_date: "",
      end_date: "",
      is_current: false,
      school_id: "",
    });
    setEditingYear(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (year: AcademicYear) => {
    setEditingYear(year);
    setFormData({
      year_name: year.year_name,
      start_date: year.start_date,
      end_date: year.end_date,
      is_current: year.is_current,
      school_id: year.school_id || "",
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
          <h1 className="text-3xl font-bold text-foreground">Academic Years</h1>
          <p className="text-muted-foreground">Manage academic year periods</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingYear ? "Edit Academic Year" : "Add New Academic Year"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="year_name">Year Name</Label>
                <Input
                  id="year_name"
                  placeholder="e.g., 2024-2025"
                  value={formData.year_name}
                  onChange={(e) =>
                    setFormData({ ...formData, year_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="school_id">School (Optional)</Label>
                <Select
                  value={formData.school_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, school_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) =>
                    setFormData({ ...formData, is_current: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_current">Current Academic Year</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingYear ? "Update" : "Create"}
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
        {academicYears.map((year) => (
          <Card key={year.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{year.year_name}</h3>
                  {year.is_current && (
                    <Badge variant="default" className="mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(year)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(year.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Start: {new Date(year.start_date).toLocaleDateString()}</p>
              <p>End: {new Date(year.end_date).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
