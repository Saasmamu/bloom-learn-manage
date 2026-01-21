import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalEnrollments: number;
  recentEnrollments: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalEnrollments: 0,
    recentEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Count students
      const { data: studentRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "student");

      // Count teachers
      const { data: teacherRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");

      // Count classes
      const { count: classCount } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true });

      // Count enrollments
      const { count: enrollmentCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true });

      // Count recent enrollments (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: recentCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .gte("enrollment_date", weekAgo.toISOString().split("T")[0]);

      setStats({
        totalStudents: studentRoles?.length || 0,
        totalTeachers: teacherRoles?.length || 0,
        totalClasses: classCount || 0,
        totalEnrollments: enrollmentCount || 0,
        recentEnrollments: recentCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}

export function DashboardStatsCards() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Students</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
            <p className="text-sm text-primary mt-1">
              {stats.recentEnrollments > 0 ? `+${stats.recentEnrollments} this week` : "No new enrollments"}
            </p>
          </div>
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-secondary/10 to-secondary/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Teachers</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalTeachers}</p>
            <p className="text-sm text-secondary mt-1">Active instructors</p>
          </div>
          <Users className="h-10 w-10 text-secondary" />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Classes</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalClasses}</p>
            <p className="text-sm text-accent mt-1">Active classes</p>
          </div>
          <BookOpen className="h-10 w-10 text-accent" />
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Enrollments</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalEnrollments}</p>
            <p className="text-sm text-primary mt-1">Across all sections</p>
          </div>
          <TrendingUp className="h-10 w-10 text-primary" />
        </div>
      </Card>
    </div>
  );
}
