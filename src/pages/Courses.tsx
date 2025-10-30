import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();

  const offerings = [
    { title: "Qur’an Memorization (Hifz) & Recitation", desc: "Structured Hifz with daily Muraja’ah and teacher supervision." },
    { title: "Arabic Language (Grammar, Reading, and Poetry)", desc: "Nahw, Sarf, reading fluency, and classical poetry appreciation." },
    { title: "Islamic Studies (Hadith, Fiqh, Aqeedah, Seerah)", desc: "Comprehensive study across core Islamic disciplines." },
    { title: "Tajweed Classes", desc: "Rules and application for precise Qur’an recitation." },
    { title: "Weekend Islamic School", desc: "Balanced program for school-aged children." },
    { title: "Adult Learning Program", desc: "Flexible evening sessions for working adults." },
    { title: "Special Classes for Married Women", desc: "Focused learning environment tailored to sisters." },
  ];

  const requirements = [
    "Basic Arabic reading skills (for Tajweed)",
    "Admission interview for Hifz program",
  ];

  const duration = "Classes run weekly, daily, or per semester based on section and level.";

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
              <p className="text-xs text-muted-foreground">Courses & Programs</p>
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
          <h2 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">🕌 Courses / Programs</h2>
          <p className="text-lg text-muted-foreground mt-4">Our offerings are designed to nurture authentic knowledge, character, and consistent practice.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((o, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <h3 className="font-bold text-lg mb-2 font-arabic">{o.title}</h3>
              <p className="text-sm text-muted-foreground">{o.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-primary/10 lg:col-span-2">
            <h3 className="text-xl font-bold mb-3 font-arabic">Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <h4 className="text-lg font-bold mt-6 mb-2 font-arabic">Suggested Placement</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Beginners: Qa’ida, Basic Tajweed</li>
              <li>Intermediate: Juz’ Amma, Arabic Grammar 1</li>
              <li>Advanced: Hifz Track, Arabic Grammar 2, Tafsir Intro</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Duration</h3>
            <p className="text-muted-foreground">{duration}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-card border-2 border-primary/10">Weekend School: Saturdays • 2–4 hrs</div>
              <div className="p-3 rounded-xl bg-card border-2 border-primary/10">After-School: Mon–Thu • 1–2 hrs/day</div>
              <div className="p-3 rounded-xl bg-card border-2 border-primary/10">Adults: Evenings • 2–3 days/week</div>
            </div>
          </Card>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Hifz Track Syllabus (Sample)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Noorani → Juz’ Amma → Selected Ajza’ → Full Hifz</li>
              <li>Daily Muraja’ah, Weekly Assessment</li>
              <li>Tajweed Application: Makharij, Sifaat</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Arabic Track Syllabus (Sample)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Reading Fluency • Vocabulary • Conversation</li>
              <li>Nahw/Sarf Basics • Short Texts</li>
              <li>Poetry Appreciation</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Islamic Studies (Sample)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Aqeedah & Tawheed</li>
              <li>Fiqh of Worship • Seerah</li>
              <li>Adab & Akhlaq</li>
            </ul>
          </Card>
        </div>
        <div className="text-center mt-8 flex flex-wrap gap-3 justify-center">
          <Button className="bg-gradient-to-r from-primary to-secondary" onClick={() => navigate("/admissions")}>Apply Now</Button>
          <Button variant="outline" className="border-2 border-primary/30" onClick={() => navigate("/teachers")}>Meet Instructors</Button>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50 py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-2 items-center">
            <GraduationCap className="h-4 w-4" />
            <span>Programs tailored for all levels</span>
            <Users className="h-4 w-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}


