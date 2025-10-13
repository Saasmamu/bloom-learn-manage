import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
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
          <Route 
            path="/student" 
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
