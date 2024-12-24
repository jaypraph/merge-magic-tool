import { Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FileImage, Maximize2, Gauge, Wrench, Merge, Plus } from "lucide-react";

export function AppSidebar() {
  const items = [
    { title: "JPG", icon: FileImage },
    { title: "Resize", icon: Maximize2 },
    { title: "DPI", icon: Gauge },
    { title: "WM", icon: Wrench },
    { title: "M", icon: Merge },
    { title: "MS", icon: Merge },
    { title: "+", icon: Plus },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 hover:bg-transparent"
          >
            <Menu className="w-6 h-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          </Button>
        </SidebarTrigger>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}