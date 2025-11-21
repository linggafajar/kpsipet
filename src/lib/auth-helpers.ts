import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * Protect API routes - requires authentication
 * Returns session if authenticated, null otherwise
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null
  }

  return session
}

/**
 * Protect API routes - requires specific role
 * Returns session if authenticated and authorized, throws error otherwise
 */
export async function requireRole(allowedRoles: string | string[]) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    )
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!roles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    )
  }

  return session
}

/**
 * Check if user has admin role
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "admin"
}

/**
 * Check if user has guru or petugas role
 */
export async function isGuruOrPetugas() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "guru" || session?.user?.role === "petugas"
}

/**
 * Check if user has siswa role
 */
export async function isSiswa() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "siswa"
}
