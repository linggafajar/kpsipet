'use client'

import { ReactNode } from 'react'

interface GuruHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function GuruHeader({ title, subtitle, action }: GuruHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
