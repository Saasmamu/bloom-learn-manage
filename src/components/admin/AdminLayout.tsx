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
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Settings,
  LogOut,
  Shield,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "Schools", icon: Building2, path: "/admin/schools" },
  { title: "Academic Years", icon: Calendar, path: "/admin/academic-years" },
  { title: "Classes", icon: GraduationCap, path: "/admin/classes" },
  { title: "Subjects", icon: BookOpen, path: "/admin/subjects" },
  { title: "Users", icon: Users, path: "/admin/users" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
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
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <h1 className="text-lg font-bold text-sidebar-foreground">Admin Portal</h1>
            </div>
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
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

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
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
