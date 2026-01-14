"use client";

import SidebarPemimpin from "@/components/pemimpin/sidebar-pemimpin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Sidebar */}
      <SidebarPemimpin children={children} />
    </div>
  );
}
