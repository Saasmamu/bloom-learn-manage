import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Award, 
  Bell,
  Clock,
  TrendingUp,
  Users,
  LogOut,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingClasses = [
    { subject: "Mathematics", time: "10:00 AM", teacher: "Dr. Sarah Johnson", room: "Room 301" },
    { subject: "Physics", time: "2:00 PM", teacher: "Prof. Michael Chen", room: "Lab A" },
    { subject: "English Literature", time: "4:00 PM", teacher: "Ms. Emily Davis", room: "Room 205" }
  ];

  const assignments = [
    { title: "Calculus Problem Set", subject: "Mathematics", due: "Tomorrow", status: "pending" },
    { title: "Lab Report - Newton's Laws", subject: "Physics", due: "3 days", status: "in-progress" },
    { title: "Essay on Shakespeare", subject: "English", due: "1 week", status: "not-started" }
  ];

  const recentGrades = [
    { subject: "Mathematics", assignment: "Mid-term Exam", grade: "A", percentage: 92 },
    { subject: "Physics", assignment: "Lab Practical", grade: "A-", percentage: 88 },
    { subject: "Chemistry", assignment: "Quiz 3", grade: "B+", percentage: 85 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Student Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || 'Student'}!
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your classes today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Courses</p>
                <p className="text-3xl font-bold text-foreground">6</p>
              </div>
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Assignments</p>
                <p className="text-3xl font-bold text-foreground">8</p>
              </div>
              <FileText className="h-10 w-10 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Attendance Rate</p>
                <p className="text-3xl font-bold text-foreground">94%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overall GPA</p>
                <p className="text-3xl font-bold text-foreground">3.8</p>
              </div>
              <Award className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all border-l-4 border-l-primary">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{classItem.subject}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {classItem.teacher}
                      </p>
                      <p className="text-sm text-muted-foreground">{classItem.room}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {classItem.time}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Assignments
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Grades
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Timetable
              </Button>
            </div>
          </Card>

          {/* Pending Assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Pending Assignments
              </h3>
            </div>
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-foreground text-sm">{assignment.title}</h4>
                      <Badge 
                        variant={assignment.status === "pending" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {assignment.due}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Recent Grades */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Grades
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-foreground">{grade.subject}</h4>
                        <p className="text-sm text-muted-foreground">{grade.assignment}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{grade.grade}</div>
                        <p className="text-sm text-muted-foreground">{grade.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={grade.percentage} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;