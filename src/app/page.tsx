import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If not logged in, redirect to login
  if (!session) {
    redirect('/login')
  }

  // If logged in, redirect to appropriate dashboard based on role
  const role = session.user?.role

  switch (role) {
    case 'admin':
      redirect('/admin/dashboard')
    case 'guru':
    case 'petugas':
      redirect('/guru/dashboard')
    case 'siswa':
      redirect('/siswa/dashboard')
    default:
      redirect('/login')
  }
}
