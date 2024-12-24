import { Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileImage, Maximize2, Gauge, Wrench, Merge } from "lucide-react";

interface AppSidebarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export function AppSidebar({ activeFeature, onFeatureSelect }: AppSidebarProps) {
  const menuItems = [
    { id: "jpg", icon: FileImage, label: "JPG" },
    { id: "resize", icon: Maximize2, label: "Resize" },
    { id: "dpi", icon: Gauge, label: "DPI" },
    { id: "wm", icon: Wrench, label: "WM" },
    { id: "mockup", icon: Merge, label: "M" },
    { id: "mockup2", icon: Merge, label: "MS" },
  ];

  const handleItemClick = (feature: string) => {
    onFeatureSelect(activeFeature === feature ? "" : feature);
  };

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50">
        <Menu className="h-6 w-6" />
      </SidebarTrigger>
      <Sidebar side="right">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleItemClick(item.id)}
                      isActive={activeFeature === item.id}
                      tooltip={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}