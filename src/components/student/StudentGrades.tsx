import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Grade {
  id: string;
  points_earned: number;
  feedback: string;
  graded_at: string;
  submissions: {
    assignments: {
      title: string;
      max_points: number;
    };
  };
}

export function StudentGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageGrade, setAverageGrade] = useState(0);

  useEffect(() => {
    if (user) {
      fetchGrades();
    }
  }, [user]);

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from("grades")
        .select(`
          id,
          points_earned,
          feedback,
          graded_at,
          submissions!inner (
            student_id,
            assignments (
              title,
              max_points
            )
          )
        `)
        .eq("submissions.student_id", user?.id)
        .order("graded_at", { ascending: false });

      if (error) throw error;

      const gradesData = data || [];
      setGrades(gradesData);

      // Calculate average grade
      if (gradesData.length > 0) {
        const avg = gradesData.reduce((sum, grade) => {
          const percentage = (grade.points_earned / grade.submissions.assignments.max_points) * 100;
          return sum + percentage;
        }, 0) / gradesData.length;
        setAverageGrade(avg);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching grades",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-500">A</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-500">B</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-500">C</Badge>;
    if (percentage >= 60) return <Badge className="bg-orange-500">D</Badge>;
    return <Badge variant="destructive">F</Badge>;
  };

  if (loading) {
    return <div>Loading grades...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Grades</h1>
        <p className="text-muted-foreground">Track your academic performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Average Grade</CardTitle>
                <CardDescription>Your overall performance</CardDescription>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{averageGrade.toFixed(1)}%</div>
            <div className="mt-2">{getGradeBadge(averageGrade)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Total Assignments</CardTitle>
                <CardDescription>Graded submissions</CardDescription>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{grades.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Completed assignments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade History</CardTitle>
          <CardDescription>Detailed view of your graded assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No grades available yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => {
                  const percentage = (grade.points_earned / grade.submissions.assignments.max_points) * 100;
                  return (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {grade.submissions.assignments.title}
                      </TableCell>
                      <TableCell>
                        {grade.points_earned} / {grade.submissions.assignments.max_points}
                      </TableCell>
                      <TableCell>{getGradeBadge(percentage)}</TableCell>
                      <TableCell>{format(new Date(grade.graded_at), "PPP")}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {grade.feedback || "No feedback"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
