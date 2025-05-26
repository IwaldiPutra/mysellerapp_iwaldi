"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import api from "@/lib/api";

export default function NavbarAdmin() {
  const [showDialog, setShowDialog] = useState(false);
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/dashboardArticles") return "Articles";
    if (path === "/dashboardCategory") return "Category";
    return "Articles";
  };

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const profileRes = await api.get(`/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(profileRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        Failed to load profile.
      </div>
    );
  }

  const activePage = getPageTitle(pathname);

  return (
    <nav className="bg-white shadow-md text-black font-light py-4 w-full">
      <div className="mx-auto px-4 flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1 className="text-black text-lg font-medium">{activePage}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-gray-400">
                  {profile.username?.[0]?.toUpperCase() || "L"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium capitalize">
                {profile.username || "-"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuItem
              onClick={() => router.push("/userProfile")}
              className="cursor-pointer"
            >
              My Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => setShowDialog(true)}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="mb-1 text-2xl">Logout</DialogTitle>
              <DialogDescription>
                Are you sure want to logout?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-blue-600" onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
