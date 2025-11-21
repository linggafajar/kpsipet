"use client";

import React, { useState } from "react";
import Sidebar from "../sidebar";
import AdminHeader from "./AdminHeader";
import Link from "next/link";

export default function AdminLayout({ children, headerTitle, headerActions }: { children: React.ReactNode; headerTitle?: string; headerActions?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pengaduan", href: "/pengaduan" },
    { name: "Data Master", href: "/master" },
    { name: "Laporan", href: "/laporan" },
    { name: "Pengaturan", href: "/pengaturan" },
  ];

  return (
    <div className="flex">
      {/* Desktop sidebar: keep original component and style, hide on small screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="ml-0 md:ml-64 w-full p-4 md:p-6">
        <AdminHeader title={headerTitle} actions={headerActions} onToggle={() => setMobileOpen(true)} />

        {/* Mobile overlay menu (keeps styles similar to the sidebar colors) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

            <aside
              className="absolute left-0 top-0 h-full w-64 shadow-lg"
              style={{ background: "var(--color-sidebar)", color: "var(--color-sidebar-foreground)" }}
            >
              <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "var(--color-sidebar-border)" }}>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">S</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">Sistem Pengaduan</h1>
                </div>
              </div>

              <nav className="mt-4">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                    style={{ color: "var(--color-sidebar-foreground)" }}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="px-6 py-4 text-xs" style={{ borderTop: `1px solid var(--color-sidebar-border)`, color: "var(--color-sidebar-foreground)" }}>
                Logged in as <br />
                <span className="font-semibold">Admin Sekolah</span>
              </div>
            </aside>
          </div>
        )}

        <div>{children}</div>
      </main>
    </div>
  );
}
