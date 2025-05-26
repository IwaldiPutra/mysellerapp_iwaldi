"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface UserData {
  username: string;
  role: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div>
      <Navbar />
      <div className="p-5 flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-[300px] max-h-[400px] w-full flex flex-col items-center justify-center">
          <p className="text-2xl font-semibold">User Profile</p>
          <br />
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-gray-400 text-5xl uppercase">
              {profile.username?.[0]?.toUpperCase() || "L"}
            </AvatarFallback>
          </Avatar>
          <br />
          <div className="flex border rounded-md p-2 w-full justify-between">
            <p className="font-semibold text-sm w-[90px]">Username</p>
            <p className="text-sm mx-4">:</p>
            <p className="text-sm flex-1 capitalize">
              {profile.username || "-"}
            </p>
          </div>
          <br />
          <div className="flex border rounded-md p-2 w-full justify-between">
            <p className="font-semibold text-sm w-[90px]">Role</p>
            <p className="text-sm mx-4">:</p>
            <p className="text-sm flex-1 capitalize">{profile.role || "-"}</p>
          </div>
          <br />
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
}
