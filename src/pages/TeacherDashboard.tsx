import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  Bell,
  LogOut,
  CheckSquare,
  Clock,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
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

  const myClasses = [
    { name: "Mathematics 101", students: 32, time: "Mon, Wed, Fri - 10:00 AM", room: "Room 301" },
    { name: "Advanced Calculus", students: 24, time: "Tue, Thu - 2:00 PM", room: "Room 405" },
    { name: "Statistics", students: 28, time: "Mon, Wed - 4:00 PM", room: "Lab B" }
  ];

  const pendingGrading = [
    { assignment: "Mid-term Exam", class: "Mathematics 101", submissions: 32, deadline: "Tomorrow" },
    { assignment: "Problem Set 5", class: "Advanced Calculus", submissions: 20, deadline: "2 days" },
    { assignment: "Lab Report", class: "Statistics", submissions: 15, deadline: "1 week" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Teacher Portal</h1>
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
            Welcome, {profile?.full_name || 'Teacher'}!
          </h2>
          <p className="text-muted-foreground">Manage your classes and engage with students.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">My Classes</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
                <p className="text-3xl font-bold text-foreground">84</p>
              </div>
              <Users className="h-10 w-10 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Grading</p>
                <p className="text-3xl font-bold text-foreground">67</p>
              </div>
              <CheckSquare className="h-10 w-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Messages</p>
                <p className="text-3xl font-bold text-foreground">12</p>
              </div>
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Classes */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                My Classes
              </h3>
              <Button variant="outline" size="sm">Create New</Button>
            </div>
            <div className="space-y-4">
              {myClasses.map((classItem, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all border-l-4 border-l-primary">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-foreground">{classItem.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {classItem.students} students
                        </p>
                      </div>
                      <Badge variant="secondary">{classItem.room}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {classItem.time}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="default">View Class</Button>
                      <Button size="sm" variant="outline">Materials</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="default">
                <FileText className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Upload Materials
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Class
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Students
              </Button>
            </div>
          </Card>

          {/* Pending Grading */}
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Pending Grading
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {pendingGrading.map((item, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.assignment}</h4>
                      <p className="text-sm text-muted-foreground">{item.class}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{item.submissions} submissions</Badge>
                      <Badge variant="destructive">Due {item.deadline}</Badge>
                    </div>
                    <Button size="sm" className="w-full">
                      Start Grading
                    </Button>
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

export default TeacherDashboard;