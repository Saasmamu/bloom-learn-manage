import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  status: string;
  section_id: string;
  sections: {
    section_name: string;
    classes: {
      name: string;
    };
  };
}

interface Section {
  id: string;
  section_name: string;
  classes: {
    name: string;
  };
}

export function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    due_date: string;
    max_points: number;
    section_id: string;
    status: "draft" | "published" | "closed";
  }>({
    title: "",
    description: "",
    due_date: "",
    max_points: 100,
    section_id: "",
    status: "draft",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch teacher's sections
    const { data: sectionsData } = await supabase
      .from("sections")
      .select(`
        id,
        section_name,
        classes (name)
      `)
      .eq("teacher_id", user.id);

    setSections(sectionsData || []);

    // Fetch assignments
    const { data: assignmentsData, error } = await supabase
      .from("assignments")
      .select(`
        *,
        sections (
          section_name,
          classes (name)
        )
      `)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assignments",
      });
    } else {
      setAssignments(assignmentsData || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("assignments").insert([
      {
        ...formData,
        teacher_id: user.id,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create assignment",
      });
    } else {
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        due_date: "",
        max_points: 100,
        section_id: "",
        status: "draft",
      });
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Section</Label>
                <Select
                  required
                  value={formData.section_id}
                  onValueChange={(value) => setFormData({ ...formData, section_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.classes.name} - Section {section.section_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Max Points</Label>
                <Input
                  type="number"
                  required
                  value={formData.max_points}
                  onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "draft" | "published" | "closed" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Create Assignment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <Badge variant={assignment.status === "published" ? "default" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{assignment.sections.classes.name} - Section {assignment.sections.section_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{assignment.max_points}</div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No assignments created yet</p>
        </Card>
      )}
    </div>
  );
}
