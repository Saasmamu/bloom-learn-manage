import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Submission {
  id: string;
  content: string;
  submitted_at: string;
  status: string;
  student_id: string;
  assignment_id: string;
  profiles: {
    full_name: string;
  };
  assignments: {
    title: string;
    max_points: number;
  };
  grades: Array<{
    points_earned: number;
    feedback: string;
  }>;
}

export function TeacherGrading() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ points: 0, feedback: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // First, get submissions for this teacher's assignments
    const { data: submissionsData, error: submissionsError } = await supabase
      .from("submissions")
      .select(`
        *,
        assignments!inner (
          title,
          max_points,
          teacher_id
        ),
        grades (
          points_earned,
          feedback
        )
      `)
      .eq("assignments.teacher_id", user.id)
      .order("submitted_at", { ascending: false });

    if (submissionsError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch submissions",
      });
      setLoading(false);
      return;
    }

    // Get student profiles for all submissions
    const studentIds = submissionsData?.map(s => s.student_id) || [];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", studentIds);

    // Merge the data
    const submissionsWithProfiles = submissionsData?.map(submission => ({
      ...submission,
      profiles: profilesData?.find(p => p.id === submission.student_id) || { full_name: "Unknown" },
    })) || [];

    setSubmissions(submissionsWithProfiles as any);
    setLoading(false);
  };

  const handleGrade = async () => {
    if (!selectedSubmission) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("grades").insert([
      {
        submission_id: selectedSubmission.id,
        points_earned: gradeData.points,
        feedback: gradeData.feedback,
        graded_by: user.id,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit grade",
      });
    } else {
      // Update submission status
      await supabase
        .from("submissions")
        .update({ status: "graded" })
        .eq("id", selectedSubmission.id);

      toast({
        title: "Success",
        description: "Grade submitted successfully",
      });
      setSelectedSubmission(null);
      setGradeData({ points: 0, feedback: "" });
      fetchSubmissions();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grading</h1>
        <p className="text-muted-foreground">Review and grade student submissions</p>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{submission.assignments.title}</h3>
                  <Badge variant={submission.status === "graded" ? "default" : "secondary"}>
                    {submission.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">Student: {submission.profiles.full_name}</p>
                <p className="text-sm">Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                {submission.grades.length > 0 && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="font-semibold">
                      Grade: {submission.grades[0].points_earned} / {submission.assignments.max_points}
                    </p>
                    {submission.grades[0].feedback && (
                      <p className="text-sm mt-1">{submission.grades[0].feedback}</p>
                    )}
                  </div>
                )}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={submission.grades.length > 0 ? "outline" : "default"}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      if (submission.grades.length > 0) {
                        setGradeData({
                          points: submission.grades[0].points_earned,
                          feedback: submission.grades[0].feedback,
                        });
                      }
                    }}
                  >
                    {submission.grades.length > 0 ? "Update Grade" : "Grade"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Submission Content:</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded">
                        {submission.content}
                      </p>
                    </div>
                    <div>
                      <Label>Points (Max: {submission.assignments.max_points})</Label>
                      <Input
                        type="number"
                        max={submission.assignments.max_points}
                        value={gradeData.points}
                        onChange={(e) => setGradeData({ ...gradeData, points: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Feedback</Label>
                      <Textarea
                        value={gradeData.feedback}
                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                        placeholder="Provide feedback to the student..."
                      />
                    </div>
                    <Button onClick={handleGrade} className="w-full">Submit Grade</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No submissions to grade</p>
        </Card>
      )}
    </div>
  );
}
