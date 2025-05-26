"use client";

import Image from "next/image";
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
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Profile = {
  id: string;
  username: string;
};

export default function Navbar() {
  const [showDialog, setShowDialog] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
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

  return (
    <nav className="bg-blue-500 text-white font-light py-4 fixed z-10 top-0 w-full">
      <div className="container mx-auto px-4 flex flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Blog Genzet Logo"
            width={100}
            height={100}
            className="object-contain cursor-pointer"
            priority
          />
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
