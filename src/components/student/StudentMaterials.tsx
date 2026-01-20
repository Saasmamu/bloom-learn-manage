import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Folder, File, Video, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Material {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  sections: {
    section_name: string;
    classes: {
      name: string;
    };
  };
  profiles: {
    full_name: string;
  };
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
        .from("materials")
        .select(`
          id,
          title,
          description,
          file_url,
          file_type,
          uploaded_at,
          section_id
        `)
        .in("section_id", sectionIds)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      // Fetch section and teacher details separately
      const materialsWithDetails = await Promise.all(
        (data || []).map(async (material) => {
          const { data: sectionData } = await supabase
            .from("sections")
            .select(`
              section_name,
              classes (name)
            `)
            .eq("id", material.section_id)
            .single();

          return {
            ...material,
            sections: sectionData || { section_name: "Unknown", classes: { name: "Unknown" } },
            profiles: { full_name: "Teacher" },
          };
        })
      );

      setMaterials(materialsWithDetails as Material[]);
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

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("video")) return <Video className="h-5 w-5" />;
    if (fileType?.includes("image")) return <Image className="h-5 w-5" />;
    if (fileType?.includes("pdf")) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const handleDownload = (fileUrl: string, title: string) => {
    window.open(fileUrl, "_blank");
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
                          {getFileIcon(material.file_type)}
                          <CardTitle className="text-base">{material.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {material.sections?.section_name}
                        </Badge>
                      </div>
                      {material.description && (
                        <CardDescription className="mt-2">
                          {material.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(material.uploaded_at), "PPP")}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(material.file_url, material.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
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
