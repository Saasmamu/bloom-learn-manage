import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

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
              <p className="text-xs text-muted-foreground">Contact Us</p>
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
          <h2 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">☎️ Contact Us</h2>
          <p className="text-lg text-muted-foreground mt-4">Get in Touch</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-4 font-arabic">Contact Information</h3>
            <div className="space-y-3 text-muted-foreground">
              <div><span className="text-primary font-semibold">Address:</span> [Insert location or city if available]</div>
              <div><span className="text-primary font-semibold">Phone:</span> [Insert phone number]</div>
              <div><span className="text-primary font-semibold">Email:</span> [Insert official email]</div>
              <div><span className="text-primary font-semibold">Social Media:</span> [Facebook / WhatsApp / Instagram links]</div>
            </div>
            <div className="pt-6">
              <Button className="bg-gradient-to-r from-primary to-secondary">Send Message</Button>
            </div>
          </Card>

          <Card className="p-8 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-xl font-bold mb-4 font-arabic">Office Hours</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Monday – Friday</div>
                <div className="font-semibold">8:00 AM – 5:00 PM</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Saturday</div>
                <div className="font-semibold">9:00 AM – 2:00 PM</div>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-primary/10">
                <div className="text-muted-foreground">Sunday</div>
                <div className="font-semibold">Closed</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-4 font-arabic">Send Us a Message</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <input className="w-full h-10 px-3 rounded-md bg-background border border-border" placeholder="Full Name" />
              <input className="w-full h-10 px-3 rounded-md bg-background border border-border" placeholder="Email" type="email" />
              <input className="w-full h-10 px-3 rounded-md bg-background border border-border md:col-span-2" placeholder="Subject" />
              <textarea className="w-full h-32 p-3 rounded-md bg-background border border-border md:col-span-2" placeholder="Your Message"></textarea>
            </div>
            <div className="pt-4"><Button className="bg-gradient-to-r from-primary to-secondary">Submit</Button></div>
          </Card>
          <Card className="p-8 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-4 font-arabic">Map (Coming Soon)</h3>
            <div className="w-full h-64 rounded-xl bg-muted/50 border border-border" />
          </Card>
        </div>
      </section>
    </div>
  );
}


