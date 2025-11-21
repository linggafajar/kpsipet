'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, History, User } from 'lucide-react'

type MenuItem = {
  name: string
  href: string
  Icon: any
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/guru/dashboard', Icon: Home },
  { name: 'Buat Pengaduan', href: '/guru/pengaduan', Icon: FileText },
  { name: 'Riwayat', href: '/guru/riwayat', Icon: History },
]

export default function GuruSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between shadow-lg overflow-y-auto"
      style={{ background: 'var(--color-sidebar)', color: 'var(--color-sidebar-foreground)' }}
    >
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: 'var(--color-sidebar-border)' }}>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">G</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Portal Guru</h1>
            <p className="text-xs opacity-75">Sistem Pengaduan</p>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.Icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  background: active ? 'var(--color-sidebar-primary)' : 'transparent',
                  color: active ? 'var(--color-sidebar-primary-foreground)' : 'var(--color-sidebar-foreground)',
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-6 py-4 text-xs" style={{ borderTop: '1px solid var(--color-sidebar-border)', color: 'var(--color-sidebar-foreground)' }}>
        Logged in as <br />
        <span className="font-semibold">Guru BK</span>
      </div>
    </aside>
  )
}
