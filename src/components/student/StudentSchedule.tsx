import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimetableEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number: string;
  subjects: {
    name: string;
    code: string;
  };
  profiles: {
    full_name: string;
  };
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StudentSchedule() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTimetable();
    }
  }, [user]);

  const fetchTimetable = async () => {
    try {
      // Get student's enrolled sections
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("section_id")
        .eq("student_id", user?.id);

      if (enrollError) throw enrollError;

      const sectionIds = enrollments?.map(e => e.section_id) || [];

      // Get timetable for those sections
      const { data, error } = await supabase
        .from("timetables")
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
          room_number,
          teacher_id,
          subjects (
            name,
            code
          )
        `)
        .in("section_id", sectionIds)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Fetch teacher profiles separately
      const teacherIds = [...new Set(data?.map(t => t.teacher_id))];
      const { data: teacherData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", teacherIds);

      const teacherMap = new Map(teacherData?.map(t => [t.id, t.full_name]));

      const timetableWithTeachers = data?.map(entry => ({
        ...entry,
        profiles: {
          full_name: teacherMap.get(entry.teacher_id) || "Unknown"
        }
      })) || [];

      setTimetable(timetableWithTeachers);
    } catch (error: any) {
      toast({
        title: "Error fetching schedule",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (entries: TimetableEntry[]) => {
    return entries.reduce((acc, entry) => {
      const day = entry.day_of_week;
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry);
      return acc;
    }, {} as Record<number, TimetableEntry[]>);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  const groupedTimetable = groupByDay(timetable);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">View your weekly class timetable</p>
      </div>

      {timetable.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No schedule available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTimetable).map(([day, entries]) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {DAYS[parseInt(day)]}
                </CardTitle>
                <CardDescription>{entries.length} classes scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {entry.subjects.name}
                              </h3>
                              <Badge variant="secondary">{entry.subjects.code}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                                </span>
                              </div>
                              
                              {entry.room_number && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{entry.room_number}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{entry.profiles?.full_name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
