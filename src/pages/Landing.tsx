import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, BarChart3, Shield, Mail, Phone, MapPin } from "lucide-react";

const Landing = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

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
    <div className="bg-white font-lexend text-nhk-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-nhk-light px-10 py-3 bg-white">
        <div className="flex items-center gap-4">
          <div className="size-4 text-nhk-dark">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">NHK Islamic Learning Center</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-sm font-medium leading-normal" href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
            <a className="text-sm font-medium leading-normal" href="#courses" onClick={(e) => handleScroll(e, 'courses')}>Courses</a>
            <a className="text-sm font-medium leading-normal" href="#events" onClick={(e) => handleScroll(e, 'events')}>Events</a>
            <a className="text-sm font-medium leading-normal" href="#admissions" onClick={(e) => handleScroll(e, 'admissions')}>Admissions</a>
            <a className="text-sm font-medium leading-normal" href="#teachers" onClick={(e) => handleScroll(e, 'teachers')}>Teachers</a>
            <a className="text-sm font-medium leading-normal" href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Contact</a>
          </div>
          <div className="flex gap-2">
            <Button className="bg-nhk-green text-nhk-dark font-bold hover:bg-nhk-green/90" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
              View Courses
            </Button>
            <Button className="bg-nhk-light text-nhk-dark font-bold hover:bg-nhk-light/90" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      <main className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* Hero Section */}
          <div id="hero" className="min-h-[480px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-lg items-center justify-center p-4" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/assets/hero-background.png")`}}>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">
                NHK Islamic Learning Center
              </h1>
              <h2 className="text-white text-base font-normal leading-normal">
                Dedicated to teaching the Qur'an, Arabic, and essential Islamic knowledge for all ages in a structured and nurturing environment.
              </h2>
            </div>
            <div className="flex-wrap gap-3 flex justify-center">
              <Button className="h-12 px-5 bg-nhk-green text-nhk-dark text-base font-bold hover:bg-nhk-green/90" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                View Courses
              </Button>
              <Button className="h-12 px-5 bg-nhk-light text-nhk-dark text-base font-bold hover:bg-nhk-light/90" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
                Apply Now
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">About</h2>
            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              NHK Islamic Learning Center is committed to providing high-quality Islamic education that is accessible to all. Our programs are designed to foster a deep
              understanding of Islamic principles and practices, promoting spiritual growth and community engagement.
            </p>
          </div>

          {/* Courses Section */}
          <div id="courses" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Courses</h2>
            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {/* Placeholder Course 1 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Qur'an Studies</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Learn the recitation and interpretation of the Holy Qur'an.</p>
                  </div>
                </div>
                {/* Placeholder Course 2 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Arabic Language</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Master the Arabic language for better understanding of Islamic texts.</p>
                  </div>
                </div>
                {/* Placeholder Course 3 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Islamic Essentials</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Gain essential knowledge about Islamic beliefs and practices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div id="events" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Events</h2>
            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {/* Placeholder Event 1 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Islamic Art Exhibition</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Explore the beauty of Islamic art and calligraphy.</p>
                  </div>
                </div>
                {/* Placeholder Event 2 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Community Prayer Gathering</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Join our community for congregational prayers and spiritual reflection.</p>
                  </div>
                </div>
                {/* Placeholder Event 3 */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col bg-gray-200"></div>
                  <div>
                    <p className="text-base font-medium leading-normal">Islamic Lecture Series</p>
                    <p className="text-nhk-muted text-sm font-normal leading-normal">Attend insightful lectures on various Islamic topics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admissions Section */}
          <div id="admissions" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Admissions</h2>
            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              Our admissions process is designed to ensure that all students are placed in the appropriate courses based on their age and prior knowledge. We offer flexible
              scheduling options to accommodate different needs.
            </p>
            <div className="flex px-4 py-3 justify-start">
              <Button className="bg-nhk-green text-nhk-dark font-bold hover:bg-nhk-green/90" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
                Apply Now
              </Button>
            </div>
          </div>

          {/* Teachers Section */}
          <div id="teachers" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Teachers</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {/* Placeholder Teacher 1 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <p className="text-base font-medium leading-normal">Imam Omar</p>
                  <p className="text-nhk-muted text-sm font-normal leading-normal">Expert in Qur'anic studies with over 10 years of experience.</p>
                </div>
              </div>
              {/* Placeholder Teacher 2 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <p className="text-base font-medium leading-normal">Sister Aisha</p>
                  <p className="text-nhk-muted text-sm font-normal leading-normal">Specialist in Arabic language and Islamic literature.</p>
                </div>
              </div>
              {/* Placeholder Teacher 3 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <p className="text-base font-medium leading-normal">Brother Yusuf</p>
                  <p className="text-nhk-muted text-sm font-normal leading-normal">Knowledgeable in Islamic essentials and community outreach.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Portals Section - Re-integrated and Restyled */}
          <div id="portals" className="py-5">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-nhk-dark mb-4">Choose Your Portal</h3>
              <p className="text-nhk-muted max-w-2xl mx-auto">
                Access the tools and features designed specifically for your role
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {portals.map((portal, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-nhk-green"
                  onClick={() => window.location.href = portal.path}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="p-8 space-y-4 relative">
                    <portal.icon className="h-16 w-16 text-nhk-green group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-2xl font-bold text-nhk-dark">{portal.title}</h4>
                    <p className="text-nhk-muted">{portal.description}</p>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-nhk-green group-hover:text-nhk-dark transition-colors"
                    >
                      Enter Portal →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section - Re-integrated and Restyled */}
          <div id="stats" className="py-20 bg-nhk-light/30">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Active Students" },
                { number: "500+", label: "Expert Teachers" },
                { number: "200+", label: "Courses Available" },
                { number: "98%", label: "Success Rate" }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl font-bold text-nhk-green">{stat.number}</div>
                  <div className="text-nhk-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="py-5">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contact</h2>
            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              For inquiries and further information, please contact us at the details provided below. We are here to assist you with any questions you may have.
            </p>
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
              <div className="text-nhk-dark flex items-center justify-center rounded-lg bg-nhk-light shrink-0 size-12">
                <Mail size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium leading-normal line-clamp-1">Email</p>
                <p className="text-nhk-muted text-sm font-normal leading-normal line-clamp-2">info@nhkislamiccenter.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
              <div className="text-nhk-dark flex items-center justify-center rounded-lg bg-nhk-light shrink-0 size-12">
                <Phone size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium leading-normal line-clamp-1">Phone</p>
                <p className="text-nhk-muted text-sm font-normal leading-normal line-clamp-2">+1-555-123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
              <div className="text-nhk-dark flex items-center justify-center rounded-lg bg-nhk-light shrink-0 size-12">
                <MapPin size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium leading-normal line-clamp-1">Address</p>
                <p className="text-nhk-muted text-sm font-normal leading-normal line-clamp-2">123 Islamic Way, New Haven, CT 06510</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center bg-nhk-light/30">
        <div className="flex max-w-[960px] flex-1 flex-col">
          <footer className="flex flex-col gap-6 px-5 py-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a>
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#courses" onClick={(e) => handleScroll(e, 'courses')}>Courses</a>
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#events" onClick={(e) => handleScroll(e, 'events')}>Events</a>
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#admissions" onClick={(e) => handleScroll(e, 'admissions')}>Admissions</a>
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#teachers" onClick={(e) => handleScroll(e, 'teachers')}>Teachers</a>
              <a className="text-nhk-muted text-base font-normal leading-normal min-w-40" href="#contact" onClick={(e) => handleScroll(e, 'contact')}>Contact</a>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#">
                <div className="text-nhk-muted">
                  {/* Placeholder for Facebook Icon */}
                </div>
              </a>
              <a href="#">
                <div className="text-nhk-muted">
                  {/* Placeholder for Twitter Icon */}
                </div>
              </a>
              <a href="#">
                <div className="text-nhk-muted">
                  {/* Placeholder for Instagram Icon */}
                </div>
              </a>
            </div>
            <p className="text-nhk-muted text-base font-normal leading-normal">© 2024 NHK Islamic Learning Center. All rights reserved.</p>
          </footer>
        </div>
      </footer>
    </div>
  )
}

export default Landing;