import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  status: string;
  submissions?: Array<{
    id: string;
    status: string;
    submitted_at: string;
  }>;
}

export function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      // Get student's enrolled sections
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("section_id")
        .eq("student_id", user?.id);

      if (enrollError) throw enrollError;

      const sectionIds = enrollments?.map(e => e.section_id) || [];

      // Get assignments for those sections
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          id,
          title,
          description,
          due_date,
          max_points,
          status,
          submissions!submissions_assignment_id_fkey (
            id,
            status,
            submitted_at
          )
        `)
        .in("section_id", sectionIds)
        .eq("status", "published")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching assignments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !submissionContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter your submission content",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("submissions")
        .insert({
          assignment_id: selectedAssignment.id,
          student_id: user?.id,
          content: submissionContent,
          status: "submitted",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      });

      setSubmissionContent("");
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error submitting assignment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Assignments</h1>
        <p className="text-muted-foreground">View and submit your assignments</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No assignments available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submission = assignment.submissions?.[0];
            const isSubmitted = !!submission;
            const isOverdue = new Date(assignment.due_date) < new Date();

            return (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={isSubmitted ? "default" : isOverdue ? "destructive" : "secondary"}>
                        {isSubmitted ? "Submitted" : isOverdue ? "Overdue" : "Pending"}
                      </Badge>
                      <Badge variant="outline">{assignment.max_points} points</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {format(new Date(assignment.due_date), "PPP")}</span>
                    </div>
                    {!isSubmitted && !isOverdue && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAssignment(assignment)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>
                              Submit your work for: {assignment.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Enter your submission here..."
                              value={submissionContent}
                              onChange={(e) => setSubmissionContent(e.target.value)}
                              rows={8}
                            />
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSubmit}>Submit Assignment</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    {isSubmitted && (
                      <Badge variant="outline">
                        Submitted on {format(new Date(submission.submitted_at), "PPP")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
