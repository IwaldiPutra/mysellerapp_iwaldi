"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/protectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <ProtectedRoute allowedRoles={["Admin"]}>
        <div className="flex min-h-screen w-full">
          <div className="">
            <AppSidebar activePath={pathname} />
          </div>
          <main className="flex-1 w-full">{children}</main>
        </div>
      </ProtectedRoute>
    </SidebarProvider>
  );
}
