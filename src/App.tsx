import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Admissions from "./pages/Admissions";
import Events from "./pages/Events";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { SchoolManagement } from "./components/admin/SchoolManagement";
import { AcademicYearManagement } from "./components/admin/AcademicYearManagement";
import { ClassManagement } from "./components/admin/ClassManagement";
import { SubjectManagement } from "./components/admin/SubjectManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { EnrollmentManagement } from "./components/admin/EnrollmentManagement";
import { SectionManagement } from "./components/admin/SectionManagement";
import { TimetableManagement } from "./components/admin/TimetableManagement";
import { AnnouncementManagement } from "./components/admin/AnnouncementManagement";
import { MessagesPage } from "./components/shared/MessagesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/schools" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SchoolManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/academic-years" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AcademicYearManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/classes" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ClassManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/subjects" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SubjectManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/enrollments" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <EnrollmentManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/sections" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <SectionManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/timetable" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <TimetableManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/announcements" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AnnouncementManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <MessagesPage />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
