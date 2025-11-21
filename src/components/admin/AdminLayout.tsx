"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import Link from "next/link";
import AdminSidebar from "./AdminSidebar";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
  headerTitle,
  headerActions,
}: {
  children: React.ReactNode;
  headerTitle?: string;
  headerActions?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/login");
    }
  }, [status, session, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (status !== "authenticated" || session?.user?.role !== "admin") {
    return null;
  }

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Pengguna", href: "/admin/users" },
    { name: "Guru", href: "/admin/guru" },
    { name: "Siswa", href: "/admin/siswa" },
    { name: "Pengaduan", href: "/admin/pengaduan" },
    { name: "Template Surat", href: "/admin/template" },
  ];

  return (
    <div className="flex">
      {/* Desktop sidebar: keep original component and style, hide on small screens */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <main className="ml-0 md:ml-64 w-full p-4 md:p-6">
        <AdminHeader
          title={headerTitle}
          action={headerActions}
          onToggle={() => setMobileOpen(true)}
        />

        {/* Mobile overlay menu (keeps styles similar to the sidebar colors) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            <aside
              className="absolute left-0 top-0 h-full w-64 shadow-lg"
              style={{
                background: "var(--color-sidebar)",
                color: "var(--color-sidebar-foreground)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-6 border-b"
                style={{ borderColor: "var(--color-sidebar-border)" }}
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">A</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">Admin Panel</h1>
                  <p className="text-xs opacity-80">{session?.user?.name}</p>
                </div>
              </div>

              <nav className="mt-4">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    style={{ color: "var(--color-sidebar-foreground)" }}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t"
                style={{
                  borderColor: "var(--color-sidebar-border)",
                }}
              >
                <div className="text-xs mb-3" style={{ color: "var(--color-sidebar-foreground)" }}>
                  <p className="opacity-80">Logged in as</p>
                  <p className="font-semibold">{session?.user?.name}</p>
                  <p className="text-xs opacity-70 capitalize">{session?.user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </aside>
          </div>
        )}

        <div>{children}</div>
      </main>
    </div>
  );
}
