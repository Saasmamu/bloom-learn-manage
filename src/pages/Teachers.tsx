import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Teachers() {
  const navigate = useNavigate();

  const staff = [
    { name: "Ustadh Ibrahim Dahiru", role: "Head of Qur’an" },
    { name: "Malam Sa’idu Umar", role: "Arabic Instructor" },
    { name: "Ustadh Uzairu Isah", role: "Arabic Letters & Pronunciation" },
    { name: "Ustadh Rabi’u Abdulkarim", role: "Head of Islamic Studies (Hadith & Fiqh)" },
    { name: "Ustadh Isma’il Abubakar", role: "Arabic Poetry & Seerah" },
  ];

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-arabic text-gradient-islamic">Nurul Hidaya Karaba</h1>
              <p className="text-xs text-muted-foreground">Teachers & Staff</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-secondary">Sign In</Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">🧭 Teachers & Staff</h2>
          <p className="text-lg text-muted-foreground mt-4">Meet our dedicated instructors guiding students with excellence.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((s, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.role}</div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-2 font-arabic">Teaching Philosophy</h3>
            <p className="text-sm text-muted-foreground">Authenticity, clarity, and compassion—grounded in Qur’an and Sunnah upon the Salaf.</p>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-2 font-arabic">Qualifications</h3>
            <p className="text-sm text-muted-foreground">Strong Tajweed, Arabic language, and Islamic sciences; experience mentoring students of all ages.</p>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-2 font-arabic">Office Hours</h3>
            <p className="text-sm text-muted-foreground">Scheduled by appointment; contact administration to book consultation.</p>
          </Card>
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" className="border-2 border-primary/30" onClick={() => navigate("/courses")}>
            Explore Programs
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50 py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-2 items-center">
            <GraduationCap className="h-4 w-4" />
            <span>Qualified and caring instructors</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


