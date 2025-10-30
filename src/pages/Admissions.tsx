import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admissions() {
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
              <p className="text-xs text-muted-foreground">Admissions</p>
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
          <h2 className="text-4xl md:text-5xl font-bold font-arabic text-gradient-islamic">🧑‍🎓 Admissions</h2>
          <p className="text-lg text-muted-foreground mt-4">Join NHK Today! Our admission process is simple and open to students of all backgrounds.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-primary/10 lg:col-span-2">
            <h3 className="text-xl font-bold mb-3 font-arabic">Application Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Visit our school or complete the online application form.</li>
              <li>Submit required documents (see list).</li>
              <li>Attend placement/evaluation if required.</li>
              <li>Receive admission decision and onboarding details.</li>
            </ol>
            <div className="mt-6">
              <Button className="bg-gradient-to-r from-primary to-secondary">Apply Online</Button>
            </div>
          </Card>

          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Fees</h3>
            <p className="text-muted-foreground">Vary depending on the selected program or section.</p>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Required Documents</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>1 passport photo</li>
              <li>Copy of birth certificate or ID</li>
              <li>Previous school record (if applicable)</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Admission Period</h3>
            <div className="space-y-2 text-muted-foreground">
              <div><span className="text-primary font-semibold">Opens:</span> January</div>
              <div><span className="text-primary font-semibold">Closes:</span> 3 weeks after term begins</div>
            </div>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Support</h3>
            <p className="text-muted-foreground">Need help? Contact our office for guidance on programs and placement.</p>
          </Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Eligibility</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ages 5+ welcome; adult programs available</li>
              <li>Hifz track requires interview and placement</li>
              <li>Basic Arabic reading for Tajweed classes</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Scholarships & Assistance</h3>
            <p className="text-muted-foreground">Limited scholarships available based on need and merit. Please inquire during application.</p>
          </Card>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 border-2 border-primary/10 lg:col-span-2">
            <h3 className="text-xl font-bold mb-3 font-arabic">FAQs</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><span className="text-foreground font-semibold">Do you accept beginners?</span> Yes, we have foundational tracks.</li>
              <li><span className="text-foreground font-semibold">Can I switch programs?</span> Transfers are possible after evaluation.</li>
              <li><span className="text-foreground font-semibold">When do classes start?</span> See key dates in the calendar and program section.</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-primary/10">
            <h3 className="text-xl font-bold mb-3 font-arabic">Contact Admissions</h3>
            <p className="text-muted-foreground">Email: admissions@nhkcenter.org • Phone: [Insert]</p>
          </Card>
        </div>
      </section>
    </div>
  );
}


