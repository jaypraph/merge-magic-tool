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
import { FileImage, Maximize2, Gauge, Wrench, Merge, Home, Database, Type, FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export function AppSidebar({ activeFeature, onFeatureSelect }: AppSidebarProps) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "tx", icon: Database, label: "KW" },
    { id: "jpg", icon: FileImage, label: "JPG" },
    { id: "resize", icon: Maximize2, label: "Resize" },
    { id: "dpi", icon: Gauge, label: "DPI" },
    { id: "wm", icon: Wrench, label: "WM" },
    { id: "mockup", icon: Merge, label: "M" },
    { id: "mockup2", icon: Merge, label: "MS" },
    { id: "video", icon: Video, label: "VD" },
    { id: "ttl", icon: Type, label: "TTL" },
    { id: "dsc", icon: FileText, label: "DSC" },
  ];

  const handleItemClick = (feature: string) => {
    if (activeFeature === feature) {
      onFeatureSelect("");
      navigate("/");
    } else {
      onFeatureSelect(feature);
      if (feature === "video") {
        navigate("/video");
      } else if (feature === "ttl") {
        navigate("/ttl");
      } else if (feature === "dsc") {
        navigate("/dsc");
      } else {
        navigate(`/${feature}`);
      }
    }
  };

  const handleHomeClick = () => {
    onFeatureSelect("");
    navigate("/");
  };

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50 w-6 h-6 rounded-full bg-[#ea384c] hover:bg-[#ea384c]/90 transition-all duration-200 shadow-[0_2px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-none p-0">
        <span className="sr-only">Toggle Sidebar</span>
      </SidebarTrigger>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleHomeClick}
        className="fixed top-4 right-4 z-50 w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-[0_2px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-none p-0"
      >
        <Home className="h-3 w-3 text-white" />
      </Button>
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
                      <span className="text-black">{item.label}</span>
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