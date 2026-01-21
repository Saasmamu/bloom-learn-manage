import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Folder, File, Video, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  material_type: string | null;
  created_at: string;
  section_id: string | null;
  sections: {
    section_name: string;
    classes: {
      name: string;
    } | null;
  } | null;
  subjects: {
    name: string;
  } | null;
}

export function StudentMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      // Get student's enrolled sections
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("section_id")
        .eq("student_id", user?.id);

      if (enrollError) throw enrollError;

      const sectionIds = enrollments?.map(e => e.section_id) || [];

      if (sectionIds.length === 0) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      // Get materials for those sections
      const { data, error } = await supabase
        .from("learning_materials")
        .select(`
          id,
          title,
          description,
          file_url,
          material_type,
          created_at,
          section_id,
          sections (
            section_name,
            classes (name)
          ),
          subjects (name)
        `)
        .in("section_id", sectionIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMaterials((data as unknown as Material[]) || []);
    } catch (error: any) {
      toast({
        title: "Error fetching materials",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (materialType: string | null) => {
    if (materialType === "video") return <Video className="h-5 w-5" />;
    if (materialType === "presentation") return <Image className="h-5 w-5" />;
    if (materialType === "document") return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  if (loading) {
    return <div>Loading materials...</div>;
  }

  // Group materials by class
  const groupedMaterials = materials.reduce((acc, material) => {
    const className = material.sections?.classes?.name || "Unknown Class";
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Materials</h1>
        <p className="text-muted-foreground">Access course materials and resources</p>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No materials available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMaterials).map(([className, classMaterials]) => (
            <div key={className}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                {className}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classMaterials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(material.material_type)}
                          <CardTitle className="text-base">{material.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {material.material_type || "document"}
                        </Badge>
                      </div>
                      {material.description && (
                        <CardDescription className="mt-2">
                          {material.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {material.subjects?.name && (
                          <p className="text-xs text-muted-foreground">
                            Subject: {material.subjects.name}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(material.created_at), "PPP")}
                          </span>
                          {material.file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
