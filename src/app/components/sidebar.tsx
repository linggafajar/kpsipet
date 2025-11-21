"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FileText,
  Layers,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Pengaduan", icon: FileText, href: "/pengaduan" },
    { name: "Data Master", icon: Layers, href: "/master" },
    { name: "Laporan", icon: BarChart3, href: "/laporan" },
    { name: "Pengaturan", icon: Settings, href: "/pengaturan" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B3A82] text-white flex flex-col justify-between shadow-lg">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-700">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Sistem Pengaduan</h1>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium 
                transition-colors
                ${active ? "bg-[#0E4AA3] text-white" : "text-blue-100 hover:bg-[#0E4AA3]/60"}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-blue-200 border-t border-blue-700">
        Logged in as <br />
        <span className="font-semibold">Admin Sekolah</span>
      </div>
    </aside>
  );
}
