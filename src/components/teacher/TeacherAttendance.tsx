import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Section {
  id: string;
  section_name: string;
  classes: {
    name: string;
  };
}

interface Student {
  id: string;
  profiles: {
    full_name: string;
  };
  attendance?: Array<{
    status: string;
    attendance_date: string;
  }>;
}

export function TeacherAttendance() {
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSections();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSection) {
      fetchStudents();
    }
  }, [selectedSection, selectedDate]);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from("sections")
        .select(`
          id,
          section_name,
          classes (
            name
          )
        `)
        .eq("teacher_id", user?.id);

      if (error) throw error;
      setSections(data || []);
      if (data && data.length > 0) {
        setSelectedSection(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching sections",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          student_id
        `)
        .eq("section_id", selectedSection);

      if (error) throw error;

      // Fetch student profiles separately
      const studentIds = data?.map(e => e.student_id) || [];
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      // Fetch attendance for selected date
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("*")
        .eq("section_id", selectedSection)
        .eq("attendance_date", selectedDate)
        .in("student_id", studentIds);

      const profileMap = new Map(profileData?.map(p => [p.id, p]));

      const studentsWithAttendance = data?.map(enrollment => ({
        id: enrollment.student_id,
        profiles: profileMap.get(enrollment.student_id) || { full_name: "Unknown" },
        attendance: attendanceData?.filter(a => a.student_id === enrollment.student_id) || []
      })) || [];

      setStudents(studentsWithAttendance);
    } catch (error: any) {
      toast({
        title: "Error fetching students",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      // Check if attendance already exists
      const existingAttendance = students.find(s => s.id === studentId)?.attendance?.[0];

      if (existingAttendance) {
        // Update existing
        const { error } = await supabase
          .from("attendance")
          .update({ status, marked_by: user?.id })
          .eq("student_id", studentId)
          .eq("section_id", selectedSection)
          .eq("attendance_date", selectedDate);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("attendance")
          .insert({
            student_id: studentId,
            section_id: selectedSection,
            attendance_date: selectedDate,
            status,
            marked_by: user?.id,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Error marking attendance",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>;
    
    const variants: Record<string, { icon: any; className: string }> = {
      present: { icon: CheckCircle2, className: "bg-green-500" },
      absent: { icon: XCircle, className: "bg-red-500" },
      late: { icon: Clock, className: "bg-yellow-500" },
    };

    const config = variants[status] || variants.present;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const selectedSectionData = sections.find(s => s.id === selectedSection);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">Mark and track student attendance</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Section</label>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.classes.name} - {section.section_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedSectionData?.classes.name} - {selectedSectionData?.section_name}
            </CardTitle>
            <CardDescription>
              Attendance for {format(new Date(selectedDate), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.profiles?.full_name}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.attendance?.[0]?.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(student.id, 'present')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(student.id, 'late')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAttendance(student.id, 'absent')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
