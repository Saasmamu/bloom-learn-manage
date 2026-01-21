import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Users, GraduationCap, BookOpen, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  full_name: string;
}

interface Section {
  id: string;
  section_name: string;
  classes: {
    name: string;
  } | null;
}

interface Enrollment {
  id: string;
  student_id: string;
  section_id: string;
  enrollment_date: string;
  student_name: string;
  section_name: string;
  class_name: string;
}

export function EnrollmentManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch students (users with student role)
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "student");

      const studentIds = rolesData?.map(r => r.user_id) || [];

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      setStudents(profilesData || []);

      // Fetch sections
      const { data: sectionsData } = await supabase
        .from("sections")
        .select(`
          id,
          section_name,
          classes (name)
        `);

      setSections(sectionsData || []);

      // Fetch enrollments
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("id, student_id, section_id, enrollment_date")
        .order("enrollment_date", { ascending: false });

      // Enrich enrollments with names
      const enrichedEnrollments = (enrollmentsData || []).map(enrollment => {
        const student = profilesData?.find(p => p.id === enrollment.student_id);
        const section = sectionsData?.find(s => s.id === enrollment.section_id);
        return {
          ...enrollment,
          student_name: student?.full_name || "Unknown",
          section_name: section?.section_name || "Unknown",
          class_name: section?.classes?.name || "Unknown",
        };
      });

      setEnrollments(enrichedEnrollments);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedSection) {
      toast({
        title: "Error",
        description: "Please select both a student and a section",
        variant: "destructive",
      });
      return;
    }

    // Check if already enrolled
    const existing = enrollments.find(
      e => e.student_id === selectedStudent && e.section_id === selectedSection
    );

    if (existing) {
      toast({
        title: "Error",
        description: "Student is already enrolled in this section",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("enrollments").insert({
        student_id: selectedStudent,
        section_id: selectedSection,
        enrollment_date: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });

      setSelectedStudent("");
      setSelectedSection("");
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error enrolling student",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveEnrollment = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Enrollment removed",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error removing enrollment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">Manage student enrollments in classes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Enroll Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll Student</DialogTitle>
              <DialogDescription>
                Select a student and a section to create an enrollment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.classes?.name} - {section.section_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEnroll}>Enroll</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Enrollments</CardTitle>
          <CardDescription>All student enrollments across sections</CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No enrollments found. Click "Enroll Student" to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map(enrollment => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">{enrollment.student_name}</TableCell>
                    <TableCell>{enrollment.class_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{enrollment.section_name}</Badge>
                    </TableCell>
                    <TableCell>{new Date(enrollment.enrollment_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEnrollment(enrollment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
