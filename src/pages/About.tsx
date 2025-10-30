import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold font-arabic text-gradient-islamic">Nurul Hidaya Karaba</h1>
              <p className="text-xs text-muted-foreground">About Us</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-secondary">Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="text-3xl md:text-4xl font-arabic text-gradient-islamic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <h2 className="text-4xl md:text-6xl font-bold font-arabic leading-tight">
            📖 About Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            NHK (Nurul Hidaya Karaba) is committed to authentic Islamic education rooted in the Qur’an and Sunnah.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="p-8 border-2 border-primary/10 bg-card">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic text-gradient-islamic">Our Story</h3>
            <p className="text-muted-foreground leading-relaxed">
              NHK (Nurul Hidaya Karaba) began as a small circle of students learning the Qur’an under one teacher, Malam Abdulkarimu. Over time, under the leadership of Abu-Mukhtar Ibrahim Dahiru, NHK evolved into a structured learning institute offering comprehensive Islamic education.
            </p>
          </Card>

          <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Founder</div>
                <div className="font-semibold">Abu-Mukhtar Ibrahim Dahiru</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Current Director</div>
                <div className="font-semibold">Abu-Mukhtar Ibrahim Dahiru</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Established</div>
                <div className="font-semibold">May 2018</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Community</div>
                <div className="font-semibold">Students • Families • Instructors</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To nurture students who are grounded in the Qur’an, Sunnah, and the authentic understanding of the Salaf, fostering moral integrity, discipline, and spiritual excellence.
            </p>
          </Card>
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be a leading Islamic learning center that produces knowledgeable, practicing Muslims who positively impact their communities.
            </p>
          </Card>
        </div>
      </section>

  {/* Methodology & Teaching Approach */}
  <section className="container mx-auto px-4 pb-12">
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-8 border-2 border-primary/10">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Our Methodology (Manhaj)</h3>
        <p className="text-muted-foreground leading-relaxed">
          We teach upon the Qur’an and Sunnah as understood by the righteous predecessors (Salaf). Our programs emphasize correct creed (Aqeedah), sound jurisprudence (Fiqh), noble character (Akhlaq), and adherence to authentic sources.
        </p>
      </Card>
      <Card className="p-8 border-2 border-primary/10">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Teaching Approach</h3>
        <p className="text-muted-foreground leading-relaxed">
          A balanced approach combining memorization, understanding, and application: Tajweed practice, interactive Arabic sessions, scaffolded Islamic studies, and continuous assessment with personalized feedback.
        </p>
      </Card>
    </div>
  </section>

  {/* Curriculum Framework */}
  <section className="container mx-auto px-4 pb-12">
    <div className="text-center mb-8">
      <h3 className="text-3xl md:text-4xl font-bold font-arabic text-gradient-islamic">Curriculum Framework</h3>
      <p className="text-muted-foreground">From foundations to advanced mastery in Qur’an, Arabic, and Islamic sciences.</p>
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      {[{ t: "Qur’an", items: ["Qa’ida/Noorani", "Tajweed Rules", "Hifz & Muraja’ah", "Tafsir Basics"] }, { t: "Arabic", items: ["Alphabet & Reading", "Vocabulary & Conversation", "Nahw/Sarf Basics", "Texts & Comprehension"] }, { t: "Islamic Studies", items: ["Aqeedah & Tawheed", "Fiqh of Worship", "Seerah & History", "Adab & Akhlaq"] }].map((b, i) => (
        <Card key={i} className="p-8 border-2 border-primary/10">
          <h4 className="text-xl font-bold mb-3 font-arabic">{b.t}</h4>
          <ul className="space-y-2 text-muted-foreground">
            {b.items.map((x, idx) => (
              <li key={idx} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary"/> {x}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  </section>

  {/* Timeline */}
  <section className="container mx-auto px-4 pb-12">
    <div className="text-center mb-8">
      <h3 className="text-3xl md:text-4xl font-bold font-arabic text-gradient-islamic">Our Journey</h3>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[{ y: "2018", d: "Founded as a small Qur’an circle under Malam Abdulkarimu." }, { y: "2020", d: "Formal programs established with dedicated tracks." }, { y: "2023", d: "Expanded adult learning and community outreach." }].map((e, i) => (
        <Card key={i} className="p-6 border-2 border-primary/10">
          <div className="text-2xl font-bold font-arabic">{e.y}</div>
          <div className="text-muted-foreground mt-2">{e.d}</div>
        </Card>
      ))}
    </div>
  </section>

  {/* Leadership & Community */}
  <section className="container mx-auto px-4 pb-24">
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-8 border-2 border-primary/10">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Leadership</h3>
        <p className="text-muted-foreground">Founder & Director: Abu-Mukhtar Ibrahim Dahiru — guiding the institute with a vision of authentic knowledge and character-building.</p>
      </Card>
      <Card className="p-8 border-2 border-primary/10">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-arabic">Community Outreach</h3>
        <p className="text-muted-foreground">Daurah sessions, Tafsir circles, youth programs, and charitable initiatives that strengthen families and the wider community.</p>
      </Card>
    </div>
    <div className="text-center mt-10">
      <Button className="bg-gradient-to-r from-primary to-secondary" onClick={() => navigate("/auth")}>
        Join Our Community
      </Button>
    </div>
  </section>
      {/* Values */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Shield, title: "Authenticity", desc: "Grounded in Qur’an and Sunnah upon the Salaf." }, { icon: Users, title: "Community", desc: "A nurturing environment for all ages." }, { icon: Calendar, title: "Discipline", desc: "Structured learning with clear milestones." }].map((v, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl w-fit mb-4">
                <v.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-1 font-arabic">{v.title}</h4>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" className="border-2 border-primary/30" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}


