import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, GraduationCap, UserCheck } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Section {
  id: string;
  section_name: string;
  class_id: string;
  teacher_id: string | null;
  max_students: number | null;
  classes: {
    name: string;
    level: number | null;
  };
  profiles: {
    full_name: string;
  } | null;
}

interface Class {
  id: string;
  name: string;
  level: number | null;
}

interface Teacher {
  id: string;
  full_name: string;
}

export function SectionManagement() {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    class_id: "",
    teacher_id: "",
    max_students: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch sections with class and teacher info
    const { data: sectionsData, error: sectionsError } = await supabase
      .from("sections")
      .select(`
        id,
        section_name,
        class_id,
        teacher_id,
        max_students,
        classes (
          name,
          level
        )
      `)
      .order("section_name", { ascending: true });

    if (sectionsError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sections",
      });
    } else {
      // Fetch teacher profiles separately
      const teacherIds = [...new Set(sectionsData?.filter(s => s.teacher_id).map(s => s.teacher_id) || [])];
      const { data: teacherProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", teacherIds);

      const teacherMap = new Map(teacherProfiles?.map(t => [t.id, t.full_name]) || []);

      const sectionsWithTeachers = sectionsData?.map(section => ({
        ...section,
        profiles: section.teacher_id ? { full_name: teacherMap.get(section.teacher_id) || "Unknown" } : null
      })) || [];

      setSections(sectionsWithTeachers as Section[]);
    }

    // Fetch classes
    const { data: classesData } = await supabase
      .from("classes")
      .select("id, name, level")
      .order("level", { ascending: true });
    setClasses(classesData || []);

    // Fetch teachers (users with teacher role)
    const { data: teacherRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "teacher");

    if (teacherRoles && teacherRoles.length > 0) {
      const teacherIds = teacherRoles.map(r => r.user_id);
      const { data: teacherProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", teacherIds);
      setTeachers(teacherProfiles || []);
    }

    // Fetch enrollment counts
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("section_id");

    if (enrollments) {
      const counts: Record<string, number> = {};
      enrollments.forEach(e => {
        counts[e.section_id] = (counts[e.section_id] || 0) + 1;
      });
      setEnrollmentCounts(counts);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      section_name: formData.name,
      class_id: formData.class_id,
      teacher_id: formData.teacher_id || null,
      max_students: formData.max_students ? parseInt(formData.max_students) : null,
    };

    if (editingSection) {
      const { error } = await supabase
        .from("sections")
        .update(dataToSubmit)
        .eq("id", editingSection.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update section",
        });
      } else {
        toast({
          title: "Success",
          description: "Section updated successfully",
        });
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("sections").insert([dataToSubmit]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create section",
        });
      } else {
        toast({
          title: "Success",
          description: "Section created successfully",
        });
        fetchData();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section? All related enrollments and timetable entries will also be deleted.")) return;

    const { error } = await supabase.from("sections").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete section",
      });
    } else {
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      class_id: "",
      teacher_id: "",
      max_students: "",
    });
    setEditingSection(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.section_name,
      class_id: section.class_id,
      teacher_id: section.teacher_id || "",
      max_students: section.max_students?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const filteredSections = selectedClass === "all"
    ? sections
    : sections.filter(s => s.class_id === selectedClass);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sections</h1>
          <p className="text-muted-foreground">Manage class sections and assign teachers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSection ? "Edit Section" : "Add New Section"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Section Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Section A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="class_id">Class</Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, class_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.level ? `(Level ${cls.level})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacher_id">Assigned Teacher (Optional)</Label>
                <Select
                  value={formData.teacher_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teacher_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max_students">Max Students (Optional)</Label>
                <Input
                  id="max_students"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.max_students}
                  onChange={(e) =>
                    setFormData({ ...formData, max_students: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSection ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter by Class */}
      <div className="flex items-center gap-4">
        <Label>Filter by Class:</Label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sections Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No sections found
                </TableCell>
              </TableRow>
            ) : (
              filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="font-medium">{section.section_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {section.classes?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {section.profiles ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        {section.profiles.full_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {enrollmentCounts[section.id] || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {section.max_students ? (
                      <Badge variant={
                        (enrollmentCounts[section.id] || 0) >= section.max_students
                          ? "destructive"
                          : "outline"
                      }>
                        {enrollmentCounts[section.id] || 0}/{section.max_students}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No limit</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(section)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(section.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
