import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users } from "lucide-react";

interface Section {
  id: string;
  section_name: string;
  max_students: number;
  class_id: string;
  classes: {
    name: string;
    level: number;
  };
  _count?: {
    enrollments: number;
  };
}

export function TeacherClasses() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeacherSections();
  }, []);

  const fetchTeacherSections = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("sections")
      .select(`
        id,
        section_name,
        max_students,
        class_id,
        classes (
          name,
          level
        )
      `)
      .eq("teacher_id", user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your classes",
      });
      setLoading(false);
      return;
    }

    // Fetch enrollment counts
    const sectionsWithCounts = await Promise.all(
      (data || []).map(async (section) => {
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("section_id", section.id);

        return {
          ...section,
          _count: { enrollments: count || 0 },
        };
      })
    );

    setSections(sectionsWithCounts as Section[]);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">Manage your assigned sections</p>
      </div>

      {sections.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No classes assigned yet</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Card key={section.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {section.classes.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Section {section.section_name}
                      </p>
                    </div>
                  </div>
                  <Badge>Level {section.classes.level}</Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {section._count?.enrollments || 0} / {section.max_students} students
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
