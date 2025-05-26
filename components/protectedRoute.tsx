"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRole = res.data.role;

        if (!allowedRoles.includes(userRole)) {
          router.push("/article");
        }
      } catch (err) {
        router.push("/login");
      }
    };

    fetchProfile();
  }, []);

  return <>{children}</>;
}
