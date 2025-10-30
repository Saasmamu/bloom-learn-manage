import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const navigate = useNavigate();

  const activities = [
    "Qur’an Graduation",
    "Ramadan Tafsir & Lectures",
    "Weekly Halaqah",
    "Special Dawah Seminars",
    "Community Awareness Programs",
  ];

  const upcoming = [
    { title: "Quarterly Daurah", date: "December 2025" },
    { title: "Yearly Outing & Camping Trip", date: "Mid-December 2025" },
    { title: "Yearly Musabaqa (Qur’an Competition)", date: "January 2025" },
    { title: "End-of-Term Visitation", date: "December 2025" },
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
              <p className="text-xs text-muted-foreground">Events & News</p>
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
          <h2 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">📅 Events & News</h2>
          <p className="text-lg text-muted-foreground mt-4">Join our regular activities and upcoming programs designed for community growth.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Regular Activities</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {activities.map((a, i) => (<li key={i}>{a}</li>))}
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Upcoming Events</h3>
            <div className="space-y-3">
              {upcoming.map((e, i) => (
                <div key={i} className="p-4 rounded-xl bg-card border-2 border-primary/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.date}</div>
                  </div>
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 border-2 border-primary/10 lg:col-span-2">
            <h3 className="text-xl font-bold mb-3 font-arabic">Gallery (Coming Soon)</h3>
            <p className="text-muted-foreground">Photos and videos from past events will be showcased here.</p>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Subscribe for Updates</h3>
            <p className="text-muted-foreground">Get the latest events and news in your inbox.</p>
            <div className="mt-4"><Button className="bg-gradient-to-r from-primary to-secondary">Subscribe</Button></div>
          </Card>
        </div>
      </section>
    </div>
  );
}


