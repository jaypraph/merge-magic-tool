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
import { FileImage, Maximize2, Gauge, Wrench, Merge, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export function AppSidebar({ activeFeature, onFeatureSelect }: AppSidebarProps) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "jpg", icon: FileImage, label: "JPG" },
    { id: "resize", icon: Maximize2, label: "Resize" },
    { id: "dpi", icon: Gauge, label: "DPI" },
    { id: "wm", icon: Wrench, label: "WM" },
    { id: "mockup", icon: Merge, label: "M" },
    { id: "mockup2", icon: Merge, label: "MS" },
  ];

  const handleItemClick = (feature: string) => {
    if (activeFeature === feature) {
      onFeatureSelect("");
      navigate("/");
    } else {
      onFeatureSelect(feature);
      navigate(`/${feature}`);
    }
  };

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50">
        <Menu className="h-6 w-6" />
      </SidebarTrigger>
      <Sidebar side="left" variant="floating">
        <SidebarContent className="mt-16">
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