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
  );
}