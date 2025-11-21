"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Layers, BarChart3, Settings } from "lucide-react";

type MenuItem = { name: string; href: string; Icon?: any };

const defaultMenu: MenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", Icon: Home },
  { name: "Pengaduan", href: "/admin/pengaduan", Icon: FileText },
  { name: "Data Master", href: "/admin/master", Icon: Layers },
  { name: "Laporan", href: "/admin/laporan", Icon: BarChart3 },
  { name: "Pengaturan", href: "/admin/pengaturan", Icon: Settings },
];

export default function AdminSidebar({ menu = defaultMenu }: { menu?: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between shadow-lg"
      style={{ background: "var(--color-sidebar)", color: "var(--color-sidebar-foreground)" }}
    >
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "var(--color-sidebar-border)" }}>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Sistem Pengaduan</h1>
          </div>
        </div>

        <nav className="mt-4">
          {menu.map((item) => {
            const Icon = item.Icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors`}
                style={{
                  background: active ? "var(--color-sidebar-primary)" : "transparent",
                  color: active ? "var(--color-sidebar-primary-foreground)" : "var(--color-sidebar-foreground)",
                }}
              >
                {Icon ? <Icon size={18} /> : null}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6 py-4 text-xs" style={{ borderTop: `1px solid var(--color-sidebar-border)`, color: "var(--color-sidebar-foreground)" }}>
        Logged in as <br />
        <span className="font-semibold">Admin Sekolah</span>
      </div>
    </aside>
  );
}
