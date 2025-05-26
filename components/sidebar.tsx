"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Newspaper, Tag, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AppSidebar({ activePath }: { activePath: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (path: string) => activePath === path;

  return (
    <Sidebar className="h-full">
      <SidebarHeader className="bg-blue-500 text-white text-center p-3 pt-5 font-bold text-lg border-b border-blue-400">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={120}
          height={100}
          className="p-1"
        />
      </SidebarHeader>

      <SidebarContent className="bg-blue-500 text-white p-3">
        <SidebarGroup className="p-0">
          <SidebarMenuItem
            className={`list-none p-3 mb-2 cursor-pointer rounded-md ${
              isActive("/dashboardArticles") ? "bg-white/20 font-medium" : ""
            }`}
            onClick={() => router.push("/dashboardArticles")}
          >
            <div className="flex items-center gap-2">
              <Newspaper size={18} />
              <span>Articles</span>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem
            className={`list-none p-3 mb-2 cursor-pointer rounded-md ${
              isActive("/dashboardCategory") ? "bg-white/20 font-medium" : ""
            }`}
            onClick={() => router.push("/dashboardCategory")}
          >
            <div className="flex items-center gap-2">
              <Tag size={18} />
              <span>Category</span>
            </div>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-blue-500 text-white border-t border-blue-400 p-3 py-1">
        <SidebarMenuItem
          className="list-none p-3 cursor-pointer rounded-md"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
