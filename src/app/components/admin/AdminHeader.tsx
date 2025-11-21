"use client";

import React from "react";
import { Menu } from "lucide-react";

type AdminHeaderProps = {
  title?: string;
  actions?: React.ReactNode;
  onToggle?: () => void;
};

export default function AdminHeader({ title = "Admin", actions, onToggle }: AdminHeaderProps) {
  return (
    <header
      className="flex items-center justify-between p-4 rounded-md mb-6"
      style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
    >
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-md"
          onClick={onToggle}
          aria-label="Toggle menu"
          style={{ background: "transparent", color: "var(--color-primary-foreground)" }}
        >
          <Menu />
        </button>

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm opacity-90">Panel administrasi — kelola data aplikasi</p>
        </div>
      </div>

      <div>{actions}</div>
    </header>
  );
}
