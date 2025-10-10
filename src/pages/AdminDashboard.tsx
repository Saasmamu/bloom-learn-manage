import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
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

  const recentActivities = [
    { action: "New student enrolled", user: "Ahmed Khan", time: "5 minutes ago" },
    { action: "Assignment submitted", user: "Sara Ahmed", time: "15 minutes ago" },
    { action: "Grade updated", user: "Teacher: Dr. Smith", time: "1 hour ago" },
    { action: "New course created", user: "Admin: John Doe", time: "2 hours ago" }
  ];

  const systemStats = [
    { label: "Server Status", value: "Operational", status: "success" },
    { label: "Database Size", value: "2.4 GB", status: "info" },
    { label: "Active Sessions", value: "247", status: "info" },
    { label: "Pending Actions", value: "3", status: "warning" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
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
            Welcome, {profile?.full_name || 'Admin'}!
          </h2>
          <p className="text-muted-foreground">Manage and oversee the entire education system.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
                <p className="text-3xl font-bold text-foreground">1,247</p>
                <p className="text-sm text-primary mt-1">+12 this week</p>
              </div>
              <Users className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Teachers</p>
                <p className="text-3xl font-bold text-foreground">89</p>
                <p className="text-sm text-secondary mt-1">+3 this month</p>
              </div>
              <Users className="h-10 w-10 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Courses</p>
                <p className="text-3xl font-bold text-foreground">156</p>
                <p className="text-sm text-accent mt-1">12 pending approval</p>
              </div>
              <BookOpen className="h-10 w-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Engagement Rate</p>
                <p className="text-3xl font-bold text-foreground">87%</p>
                <p className="text-sm text-primary mt-1">+5% this month</p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="default">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Teachers
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Course
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Set Timetable
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Activities
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all border-l-4 border-l-primary">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{activity.action}</h4>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* System Status */}
          <Card className="lg:col-span-3 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              System Status
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {systemStats.map((stat, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <Badge 
                      variant={
                        stat.status === "success" ? "default" : 
                        stat.status === "warning" ? "destructive" : 
                        "secondary"
                      }
                      className="text-xs"
                    >
                      {stat.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Performance Overview */}
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Overview
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">This Week</Button>
                <Button variant="outline" size="sm">This Month</Button>
                <Button variant="default" size="sm">This Year</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Average Attendance</p>
                <p className="text-3xl font-bold text-primary">92%</p>
                <p className="text-xs text-muted-foreground mt-1">↑ 3% from last month</p>
              </Card>
              <Card className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Average Grade</p>
                <p className="text-3xl font-bold text-secondary">B+</p>
                <p className="text-xs text-muted-foreground mt-1">↑ Improving</p>
              </Card>
              <Card className="p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Course Completion</p>
                <p className="text-3xl font-bold text-accent">78%</p>
                <p className="text-xs text-muted-foreground mt-1">↑ 5% from last month</p>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;