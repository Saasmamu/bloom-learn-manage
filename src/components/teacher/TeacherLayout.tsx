import { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  ClipboardList,
  Users,
  Calendar,
  FileText,
  LogOut,
  GraduationCap,
  Bell,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface TeacherLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "My Classes", icon: GraduationCap, path: "/teacher/classes" },
  { title: "Assignments", icon: ClipboardList, path: "/teacher/assignments" },
  { title: "Grading", icon: FileText, path: "/teacher/grading" },
  { title: "Attendance", icon: Calendar, path: "/teacher/attendance" },
  { title: "Materials", icon: BookOpen, path: "/teacher/materials" },
  { title: "Students", icon: Users, path: "/teacher/students" },
  { title: "Messages", icon: MessageCircle, path: "/teacher/messages" },
];

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-sidebar-primary" />
              <h1 className="text-lg font-bold text-sidebar-foreground">Teacher Portal</h1>
            </div>
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Teaching</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        isActive={isActive(item.path)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="h-full px-4 flex items-center justify-between">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <NotificationBell />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
