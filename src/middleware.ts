import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/api/auth"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Get token from request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  // If accessing public route
  if (isPublicRoute) {
    // If already authenticated and trying to access login, redirect to dashboard
    if (pathname === "/login" && token) {
      const dashboardUrl = getDashboardForRole(token.role as string)
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = token.role as string

  // Role-based route protection
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      const dashboardUrl = getDashboardForRole(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
  }

  if (pathname.startsWith("/guru")) {
    if (userRole !== "guru" && userRole !== "petugas") {
      const dashboardUrl = getDashboardForRole(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
  }

  if (pathname.startsWith("/siswa")) {
    if (userRole !== "siswa") {
      const dashboardUrl = getDashboardForRole(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
  }

  // API routes protection
  if (pathname.startsWith("/api/admin")) {
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  if (pathname.startsWith("/api/guru")) {
    if (userRole !== "guru" && userRole !== "petugas" && userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  if (pathname.startsWith("/api/siswa")) {
    if (userRole !== "siswa" && userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

function getDashboardForRole(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "guru":
    case "petugas":
      return "/guru/dashboard"
    case "siswa":
      return "/siswa/dashboard"
    default:
      return "/login"
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
}
