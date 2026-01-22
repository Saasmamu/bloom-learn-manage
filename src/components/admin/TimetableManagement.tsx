import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Clock, Calendar, MapPin } from "lucide-react";
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

interface TimetableEntry {
  id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number: string | null;
  sections: {
    section_name: string;
    classes: {
      name: string;
    };
  };
  subjects: {
    name: string;
    code: string;
  };
  teacher_name?: string;
}

interface Section {
  id: string;
  section_name: string;
  classes: {
    name: string;
  };
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Teacher {
  id: string;
  full_name: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimetableManagement() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    section_id: "",
    subject_id: "",
    teacher_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    room_number: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch timetable entries
    const { data: timetableData, error: timetableError } = await supabase
      .from("timetables")
      .select(`
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
        room_number,
        sections (
          section_name,
          classes (
            name
          )
        ),
        subjects (
          name,
          code
        )
      `)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (timetableError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch timetable",
      });
    } else {
      // Fetch teacher names
      const teacherIds = [...new Set(timetableData?.map(t => t.teacher_id) || [])];
      const { data: teacherProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", teacherIds);

      const teacherMap = new Map(teacherProfiles?.map(t => [t.id, t.full_name]) || []);

      const timetableWithTeachers = timetableData?.map(entry => ({
        ...entry,
        teacher_name: teacherMap.get(entry.teacher_id) || "Unknown"
      })) || [];

      setTimetable(timetableWithTeachers as TimetableEntry[]);
    }

    // Fetch sections
    const { data: sectionsData } = await supabase
      .from("sections")
      .select(`
        id,
        section_name,
        classes (
          name
        )
      `)
      .order("section_name", { ascending: true });
    setSections(sectionsData as Section[] || []);

    // Fetch subjects
    const { data: subjectsData } = await supabase
      .from("subjects")
      .select("id, name, code")
      .order("name", { ascending: true });
    setSubjects(subjectsData || []);

    // Fetch teachers
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

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate time
    if (formData.start_time >= formData.end_time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "End time must be after start time",
      });
      return;
    }

    const dataToSubmit = {
      section_id: formData.section_id,
      subject_id: formData.subject_id,
      teacher_id: formData.teacher_id,
      day_of_week: parseInt(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      room_number: formData.room_number || null,
    };

    if (editingEntry) {
      const { error } = await supabase
        .from("timetables")
        .update(dataToSubmit)
        .eq("id", editingEntry.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update timetable entry",
        });
      } else {
        toast({
          title: "Success",
          description: "Timetable entry updated successfully",
        });
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("timetables").insert([dataToSubmit]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create timetable entry",
        });
      } else {
        toast({
          title: "Success",
          description: "Timetable entry created successfully",
        });
        fetchData();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) return;

    const { error } = await supabase.from("timetables").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete timetable entry",
      });
    } else {
      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
      });
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      section_id: "",
      subject_id: "",
      teacher_id: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      room_number: "",
    });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      section_id: entry.section_id,
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id,
      day_of_week: entry.day_of_week.toString(),
      start_time: entry.start_time,
      end_time: entry.end_time,
      room_number: entry.room_number || "",
    });
    setIsDialogOpen(true);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredTimetable = timetable.filter(entry => {
    if (selectedSection !== "all" && entry.section_id !== selectedSection) return false;
    if (selectedDay !== "all" && entry.day_of_week.toString() !== selectedDay) return false;
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and time slots</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Edit Schedule" : "Add New Schedule"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="section_id">Section</Label>
                <Select
                  value={formData.section_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, section_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.classes?.name} - {section.section_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject_id">Subject</Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subject_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacher_id">Teacher</Label>
                <Select
                  value={formData.teacher_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teacher_id: value })
                  }
                  required
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
                <Label htmlFor="day_of_week">Day</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(value) =>
                    setFormData({ ...formData, day_of_week: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="room_number">Room Number (Optional)</Label>
                <Input
                  id="room_number"
                  placeholder="e.g., Room 101"
                  value={formData.room_number}
                  onChange={(e) =>
                    setFormData({ ...formData, room_number: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEntry ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label>Section:</Label>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.classes?.name} - {section.section_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Day:</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              {DAYS.map((day, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timetable Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTimetable.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No schedule entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredTimetable.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{DAYS[entry.day_of_week]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {entry.sections?.classes?.name} - {entry.sections?.section_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{entry.subjects?.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({entry.subjects?.code})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.teacher_name}</TableCell>
                  <TableCell>
                    {entry.room_number ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {entry.room_number}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
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
