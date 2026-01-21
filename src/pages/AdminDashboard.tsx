import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  UserPlus,
  BarChart3,
  Shield,
  Loader2,
  GraduationCap,
  Building2,
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardStatsCards } from "@/components/admin/DashboardStats";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Fetch recent notifications as activities
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivities(notifications || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {profile?.full_name || 'Admin'}!
          </h2>
          <p className="text-muted-foreground">Manage and oversee the entire education system.</p>
        </div>

        {/* Stats Cards - Now with real data */}
        <div className="mb-8">
          <DashboardStatsCards />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="default"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/enrollments')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Enrollments
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/schools')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Schools
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/academic-years')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Academic Years
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/classes')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Classes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/subjects')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Subjects
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
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activities</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-all border-l-4 border-l-primary">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.message}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          {/* System Status */}
          <Card className="lg:col-span-3 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              System Status
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Server Status</p>
                  <p className="text-xl font-bold text-foreground">Operational</p>
                  <Badge className="text-xs">Active</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="text-xl font-bold text-foreground">Connected</p>
                  <Badge variant="secondary" className="text-xs">Healthy</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Auth Service</p>
                  <p className="text-xl font-bold text-foreground">Running</p>
                  <Badge className="text-xs">Active</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Storage</p>
                  <p className="text-xl font-bold text-foreground">Available</p>
                  <Badge variant="secondary" className="text-xs">Ready</Badge>
                </div>
              </Card>
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