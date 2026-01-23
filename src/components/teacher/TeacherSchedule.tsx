import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, BookOpen, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimetableEntry {
  id: string;
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
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TeacherSchedule() {
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
      const { data, error } = await supabase
        .from("timetables")
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
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
        .eq("teacher_id", user?.id)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setTimetable(data as TimetableEntry[] || []);
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

  const getTodaySchedule = () => {
    const today = new Date().getDay();
    return timetable.filter(entry => entry.day_of_week === today);
  };

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  const groupedTimetable = groupByDay(timetable);
  const todaySchedule = getTodaySchedule();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">View your weekly teaching timetable</p>
      </div>

      {/* Today's Schedule Highlight */}
      {todaySchedule.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Classes ({DAYS[new Date().getDay()]})
            </CardTitle>
            <CardDescription>{todaySchedule.length} classes scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaySchedule.map((entry) => (
                <Card key={entry.id} className="p-4 bg-background">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{entry.subjects?.name}</Badge>
                      <span className="text-xs text-muted-foreground">{entry.subjects?.code}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{entry.sections?.classes?.name} - {entry.sections?.section_name}</span>
                    </div>
                    {entry.room_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.room_number}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {timetable.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No schedule assigned yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Weekly Schedule</h2>
          {Object.entries(groupedTimetable).map(([day, entries]) => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  {DAYS[parseInt(day)]}
                  {parseInt(day) === new Date().getDay() && (
                    <Badge variant="secondary" className="ml-2">Today</Badge>
                  )}
                </CardTitle>
                <CardDescription>{entries.length} classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.subjects?.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.subjects?.code}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {entry.sections?.classes?.name} - {entry.sections?.section_name}
                            </span>
                            {entry.room_number && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {entry.room_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                        </div>
                      </div>
                    </div>
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
