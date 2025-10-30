import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, GraduationCap, BarChart3, Shield, Star, Award, Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading, getUserRole } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      getUserRole().then((role) => {
        if (role === 'student') navigate('/student');
        else if (role === 'teacher') navigate('/teacher');
        else if (role === 'admin') navigate('/admin');
      });
    }
  }, [user, loading, getUserRole, navigate]);

  const features = [
    {
      icon: BookOpen,
      title: "Qur'anic Studies",
      description: "Master the recitation, memorization, and understanding of the Holy Qur'an with expert guidance",
      gradient: "from-primary/10 to-primary/5"
    },
    {
      icon: Star,
      title: "Arabic Language",
      description: "Learn the beautiful language of the Qur'an from beginner to advanced levels",
      gradient: "from-accent/10 to-accent/5"
    },
    {
      icon: Heart,
      title: "Islamic Values",
      description: "Build strong character through the teachings of Prophet Muhammad (ﷺ)",
      gradient: "from-secondary/10 to-secondary/5"
    },
    {
      icon: Award,
      title: "Structured Learning",
      description: "Progress tracking with detailed analytics and personalized feedback",
      gradient: "from-primary/10 to-accent/5"
    }
  ];

  const portals = [
    {
      title: "Student Portal",
      description: "Access your Islamic classes, assignments, and spiritual learning materials",
      icon: GraduationCap,
      path: "/student",
      gradient: "from-primary to-secondary",
      arabicText: "طالب"
    },
    {
      title: "Teacher Portal",
      description: "Guide and inspire students in their journey of Islamic knowledge",
      icon: Users,
      path: "/teacher",
      gradient: "from-accent to-primary",
      arabicText: "معلم"
    },
    {
      title: "Admin Portal",
      description: "Manage the Islamic learning center with comprehensive oversight",
      icon: Shield,
      path: "/admin",
      gradient: "from-secondary to-accent",
      arabicText: "إدارة"
    }
  ];

  const stats = [
    { number: "5,000+", label: "Blessed Students", icon: Users },
    { number: "150+", label: "Dedicated Teachers", icon: GraduationCap },
    { number: "100+", label: "Islamic Courses", icon: BookOpen },
    { number: "95%", label: "Success Rate", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-gradient-islamic">Nurul Hidaya Karaba</h1>
              <p className="text-xs text-muted-foreground">Islamic Learning Center</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-primary transition-colors">About</button>
            <button onClick={() => navigate('/courses')} className="text-muted-foreground hover:text-primary transition-colors">Programs</button>
            <button onClick={() => navigate('/events')} className="text-muted-foreground hover:text-primary transition-colors">News</button>
            <button onClick={() => navigate('/admissions')} className="text-muted-foreground hover:text-primary transition-colors">Admissions</button>
            <button onClick={() => navigate('/teachers')} className="text-muted-foreground hover:text-primary transition-colors">Teachers</button>
            <button onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-primary transition-colors">Contact</button>
          </div>
          <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-5xl mx-auto text-center space-y-8 animate-in fade-in duration-1000">
            {/* Arabic Bismillah */}
            <div className="text-4xl md:text-5xl font-arabic text-gradient-islamic mb-4">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold font-arabic leading-tight">
                <span className="block text-foreground">Enlightening Minds,</span>
                <span className="block text-gradient-islamic mt-2">Nurturing Souls</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A comprehensive Islamic learning management system dedicated to teaching the Qur'an, 
                Arabic, and essential Islamic knowledge in a structured and nurturing environment.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6 h-auto"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-primary/30 hover:bg-primary/5 text-lg px-8 py-6 h-auto"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Authentic Islamic Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                <span>Certified Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-secondary" />
                <span>Nurturing Environment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Introduction */}
      <section id="about" className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">
              Welcome to Nurul Hidaya Karaba (NHK)
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              “NHK is an Islamic learning center dedicated to teaching the Qur'an, Arabic, and essential Islamic knowledge for all ages in a structured and nurturing environment.”
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Learn more about our mission to nurture a generation firmly grounded in the Qur’an, Sunnah, and the understanding of the righteous predecessors (Salaf).
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#programs">
                <Button className="bg-gradient-to-r from-primary to-secondary">Explore Programs</Button>
              </a>
              <a href="#admissions">
                <Button variant="outline" className="border-2 border-primary/30">Admissions</Button>
              </a>
            </div>
          </div>
          <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="space-y-4">
              <h4 className="text-2xl font-bold font-arabic">Our Commitment</h4>
              <p className="text-muted-foreground leading-relaxed">
                We empower students with authentic Islamic knowledge, excellent character, and academic discipline—within a nurturing environment that values spiritual growth and community.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                  <span className="block text-sm text-muted-foreground">Focus</span>
                  <span className="font-semibold">Qur’an • Arabic • Islamic Studies</span>
                </div>
                <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                  <span className="block text-sm text-muted-foreground">Approach</span>
                  <span className="font-semibold">Structured • Authentic • Nurturing</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Our Programs</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Explore Qur’an memorization (Hifz), Arabic language classes, Islamic Studies, and adult learning programs tailored to every learner.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { title: "Qur’an Memorization (Hifz)", desc: "Structured memorization with Tajweed and consistent supervision." },
            { title: "Arabic Language", desc: "Reading, writing, conversation—grounded in classical Arabic." },
            { title: "Islamic Studies", desc: "Aqeedah, Fiqh, Seerah, Tafsir, and Adab for all levels." },
            { title: "Adult Learning", desc: "Flexible programs for working adults and new learners." },
          ].map((p, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10 hover:border-primary/30 transition-all bg-card">
              <h4 className="font-bold text-lg mb-2 font-arabic">{p.title}</h4>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest News & Events */}
      <section id="news" className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Latest News & Events</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Stay updated with our upcoming Daurah sessions, Tafsir lectures, graduation ceremonies, and community outreach programs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Weekend Daurah: Purification of the Heart", date: "Nov 15, 2025", tag: "Daurah" },
            { title: "Monthly Tafsir: Surah Maryam", date: "Nov 28, 2025", tag: "Lecture" },
            { title: "Hifz Graduation Ceremony", date: "Dec 10, 2025", tag: "Ceremony" },
          ].map((e, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{e.tag}</span>
                <span className="text-sm text-muted-foreground">{e.date}</span>
              </div>
              <h4 className="font-bold text-lg font-arabic">{e.title}</h4>
              <Button variant="outline" className="mt-4 border-2 border-primary/30">Learn More</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Admissions Info */}
      <section id="admissions" className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Admissions</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Join our community of learners. View application details, requirements, and key dates for enrollment.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="p-8 border-2 border-primary/10">
            <h4 className="text-xl font-bold mb-4 font-arabic">How to Apply</h4>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Complete the online application form.</li>
              <li>Prepare required documents (ID, prior transcripts if applicable).</li>
              <li>Placement evaluation for appropriate level.</li>
              <li>Receive admission decision and onboarding details.</li>
            </ol>
            <div className="flex gap-3 pt-6">
              <Button className="bg-gradient-to-r from-primary to-secondary">Start Application</Button>
              <Button variant="outline" className="border-2 border-primary/30">View Requirements</Button>
            </div>
          </Card>
          <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <h4 className="text-xl font-bold mb-4 font-arabic">Key Dates</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Spring Intake</div>
                <div className="font-semibold">Opens Jan 10</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Deadline</div>
                <div className="font-semibold">Feb 15</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Evaluations</div>
                <div className="font-semibold">Late Feb</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Classes Begin</div>
                <div className="font-semibold">Mar 5</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Teachers */}
      <section id="teachers" className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Our Teachers</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Meet our experienced and dedicated instructors who guide students in Qur’an, Arabic, and Islamic disciplines.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ustadh Ahmad", role: "Qur’an & Tajweed" },
            { name: "Ustadha Maryam", role: "Arabic Language" },
            { name: "Shaykh Yusuf", role: "Islamic Studies" },
          ].map((t, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Curriculum Overview */}
      <section id="curriculum" className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Curriculum Overview</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">A structured pathway from foundations to mastery, combining Qur’an, Arabic, and Islamic Sciences.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { level: "Foundation", items: ["Noorani/Qa'ida", "Basic Tajweed", "Arabic Letters", "Daily Du'a" ] },
            { level: "Intermediate", items: ["Juz' Amma", "Applied Tajweed", "Arabic Grammar 1", "Seerah Basics" ] },
            { level: "Advanced", items: ["Hifz Program", "Arabic Grammar 2", "Tafsir Intro", "Aqeedah & Fiqh" ] },
          ].map((c, i) => (
            <Card key={i} className="p-8 border-2 border-primary/10">
              <h4 className="text-xl font-bold mb-4 font-arabic">{c.level}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {c.items.map((it, idx) => (
                  <li key={idx} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary"/> {it}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Student Pathways */}
      <section id="pathways" className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Student Pathways</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Choose a learning path that suits your goals and schedule.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: "Weekend Islamic School", desc: "Ideal for school-aged children—balanced Qur’an, Arabic, and manners.", duration: "Saturdays", intensity: "2–4 hrs" },
            { title: "After-School Program", desc: "Daily reinforcement for Qur’an recitation, memorization, and Arabic.", duration: "Mon–Thu", intensity: "1–2 hrs/day" },
            { title: "Adult Evening Classes", desc: "Flexible learning for working adults: Tajweed, Arabic, and Fiqh.", duration: "Evenings", intensity: "2–3 days/week" },
          ].map((p, i) => (
            <Card key={i} className="p-8 border-2 border-primary/10">
              <h4 className="text-xl font-bold font-arabic">{p.title}</h4>
              <p className="text-muted-foreground mt-2">{p.desc}</p>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary">{p.duration}</div>
                <div className="px-3 py-1 rounded-full bg-accent/10 text-accent-foreground">{p.intensity}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose NHK */}
      <section id="why" className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Why Choose NHK?</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { t: "Authentic Manhaj", d: "Qur’an and Sunnah upon the understanding of the Salaf." },
            { t: "Qualified Teachers", d: "Experienced instructors with strong Tajweed and Islamic sciences." },
            { t: "Structured Learning", d: "Clear milestones, assessments, and feedback." },
            { t: "Community Focus", d: "Programs for families, youth, and adults." },
          ].map((x, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <h4 className="font-bold font-arabic mb-2">{x.t}</h4>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Testimonials</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">What parents and students say about NHK.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { q: "My child’s Tajweed improved remarkably in just a few months.", a: "Parent of Level 2 student" },
            { q: "The Arabic classes made classical texts approachable.", a: "Adult learner" },
            { q: "I love the nurturing environment and clear structure.", a: "Parent, Weekend School" },
          ].map((t, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <p className="italic">“{t.q}”</p>
              <p className="text-sm text-muted-foreground mt-3">— {t.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">Frequently Asked Questions</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: "What age groups do you accept?", a: "We welcome learners from age 5 and up, including adult programs." },
            { q: "Do you offer part-time options?", a: "Yes—weekend, after-school, and evening classes are available." },
            { q: "Is there an evaluation?", a: "A short placement helps us place students at the right level." },
            { q: "How do I enroll?", a: "Visit the Admissions section to apply online and view key dates." },
          ].map((f, i) => (
            <Card key={i} className="p-6 border-2 border-primary/10">
              <h4 className="font-bold mb-1 font-arabic">{f.q}</h4>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section (renamed visually but kept for continuity) */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic mb-4">
            Comprehensive Islamic Education
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for spiritual growth and Islamic knowledge in one blessed platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br ${feature.gradient} border-2 border-primary/10 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 font-arabic">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Portals Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic mb-4">
            Choose Your Portal
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access the tools designed specifically for your role in our Islamic learning community
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portals.map((portal, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary bg-card"
              onClick={() => navigate(portal.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="absolute top-4 right-4 text-6xl font-arabic text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                {portal.arabicText}
              </div>
              
              <div className="p-8 space-y-6 relative">
                <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <portal.icon className="h-12 w-12 text-white" />
                </div>
                
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-2 font-arabic">{portal.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{portal.description}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:text-white group-hover:border-transparent transition-all duration-300 border-2"
                >
                  Enter Portal →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-3 p-6 rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-all duration-300">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-gradient-islamic font-arabic">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Islamic Values Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">
              Built on Islamic Principles
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              "And say: My Lord, increase me in knowledge." - Qur'an 20:114
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              { icon: Heart, title: "Compassion", desc: "Teaching with mercy and understanding" },
              { icon: Shield, title: "Integrity", desc: "Upholding Islamic values in education" },
              { icon: Star, title: "Excellence", desc: "Striving for the highest standards" }
            ].map((value, i) => (
              <div key={i} className="p-6 bg-card rounded-xl border-2 border-primary/10 hover:border-primary/30 transition-all">
                <value.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2 font-arabic">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contact" className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-3xl font-bold font-arabic mb-4 text-gradient-islamic">Contact Us</h3>
            <p className="text-muted-foreground mb-6">Reach out to us for inquiries, admissions, or support.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><span className="text-primary">Address:</span><span className="text-muted-foreground">123 Knowledge Way, Faith City</span></div>
              <div className="flex items-center gap-3"><span className="text-primary">Phone:</span><span className="text-muted-foreground">(123) 456-7890</span></div>
              <div className="flex items-center gap-3"><span className="text-primary">Email:</span><span className="text-muted-foreground">contact@nhkcenter.org</span></div>
            </div>
            <div className="pt-6">
              <Button className="bg-gradient-to-r from-primary to-secondary">Send Inquiry</Button>
            </div>
          </Card>
          <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <h4 className="text-xl font-bold mb-4 font-arabic">Visit Hours</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Mon - Thu</div>
                <div className="font-semibold">9:00 AM - 5:00 PM</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Fri - Sat</div>
                <div className="font-semibold">10:00 AM - 2:00 PM</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-arabic text-gradient-islamic">Nurul Hidaya Karaba</h2>
                  <p className="text-xs text-muted-foreground">Islamic Learning Center</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                A place for spiritual and intellectual growth, rooted in Islamic tradition and 
                dedicated to nurturing the next generation of knowledgeable Muslims.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-arabic">Quick Links</h4>
              <nav className="flex flex-col gap-2 text-sm">
                <button onClick={() => navigate('/about')} className="text-left text-muted-foreground hover:text-primary transition-colors">About Us</button>
                <button onClick={() => navigate('/courses')} className="text-left text-muted-foreground hover:text-primary transition-colors">Courses</button>
                <button onClick={() => navigate('/admissions')} className="text-left text-muted-foreground hover:text-primary transition-colors">Admissions</button>
                <button onClick={() => navigate('/contact')} className="text-left text-muted-foreground hover:text-primary transition-colors">Contact</button>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-arabic">Connect</h4>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-all">
                    <div className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Bloom Learn Islamic Education Center. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-arabic">
              جَزَاكَ ٱللَّٰهُ خَيْرًا - May Allah reward you with goodness
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
