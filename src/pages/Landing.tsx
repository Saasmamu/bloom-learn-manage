import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, GraduationCap, BarChart3, Shield } from "lucide-react";
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
      title: "Digital Learning",
      description: "Access courses, materials, and resources anytime, anywhere"
    },
    {
      icon: Users,
      title: "Collaborative Space",
      description: "Connect with teachers and classmates in real-time"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor performance with detailed analytics and reports"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for all your educational data"
    }
  ];

  const portals = [
    {
      title: "Student Portal",
      description: "Access your classes, assignments, and learning materials",
      icon: GraduationCap,
      path: "/student",
      gradient: "from-primary to-secondary"
    },
    {
      title: "Admin Portal",
      description: "Manage users, classes, and oversee the entire system",
      icon: Shield,
      path: "/admin",
      gradient: "from-secondary to-accent"
    },
    {
      title: "Teacher Portal",
      description: "Create courses, grade assignments, and engage with students",
      icon: Users,
      path: "/teacher",
      gradient: "from-accent to-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EduManage LMS</h1>
          </div>
          <Button onClick={() => navigate("/auth")} variant="default">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Welcome To The
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Future of Learning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive school management and learning platform designed to empower students,
            teachers, and administrators with powerful tools for academic excellence.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Powerful Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for modern education management in one platform
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Portals Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Portal</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access the tools and features designed specifically for your role
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portals.map((portal, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary"
              onClick={() => navigate(portal.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="p-8 space-y-4 relative">
                <portal.icon className="h-16 w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-2xl font-bold text-foreground">{portal.title}</h4>
                <p className="text-muted-foreground">{portal.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Enter Portal →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10,000+", label: "Active Students" },
            { number: "500+", label: "Expert Teachers" },
            { number: "200+", label: "Courses Available" },
            { number: "98%", label: "Success Rate" }
          ].map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-bold text-primary">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 EduManage LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;