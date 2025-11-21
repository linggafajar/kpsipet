# Authentication System Documentation

This project uses **NextAuth.js v5** for authentication with role-based access control.

## Overview

The authentication system supports three user roles:
- **admin**: Full access to admin panel (`/admin/*`)
- **guru**: Access to teacher/counselor panel (`/guru/*`)
- **siswa**: Access to student portal (`/siswa/*` - not yet implemented)
- **petugas**: Legacy role, treated same as guru

## Quick Start

### 1. Environment Setup

Add these variables to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production

# Database (already configured)
DATABASE_URL="postgresql://postgres:123456@localhost:5432/kpsipet?schema=public"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 2. Database Setup

The database schema already includes the Users table with roles. Run the seed to create default users:

```bash
npm run db:seed
```

This creates:
- **Admin User**: `admin` / `admin123`
- **Guru User**: `guru` / `guru123`
- **Petugas User**: `petugas` / `petugas123`

### 3. Test Login

1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/login`
3. Login with admin credentials
4. You'll be redirected to `/admin/dashboard`

## File Structure

```
src/
├── auth.ts                          # NextAuth configuration
├── middleware.ts                    # Route protection middleware
├── lib/
│   └── auth-helpers.ts             # Helper functions for API routes
├── app/
│   ├── login/
│   │   └── page.tsx                # Login page
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts        # NextAuth API handler
└── components/
    ├── admin/
    │   ├── AdminLayout.tsx         # Admin layout with session
    │   └── AdminSidebar.tsx        # Admin sidebar with logout
    └── guru/
        ├── GuruLayout.tsx          # Guru layout with session
        └── GuruSidebar.tsx         # Guru sidebar with logout
```

## Usage

### Protecting Page Routes

Page routes are automatically protected by `src/middleware.ts`. The middleware:

1. Redirects unauthenticated users to `/login`
2. Redirects authenticated users to their role-appropriate dashboard
3. Prevents role-crossing (admin can't access guru routes, etc.)

**No additional code needed in page components!** Just use the layouts:

```tsx
// src/app/admin/dashboard/page.tsx
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Your content */}
    </AdminLayout>
  )
}
```

### Accessing Session in Client Components

Use NextAuth's `useSession` hook:

```tsx
'use client'
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Please login</div>

  return (
    <div>
      <p>Welcome {session?.user?.username}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  )
}
```

### Accessing Session in Server Components

Use NextAuth's `auth` function:

```tsx
// Server Component
import { auth } from '@/auth'

export default async function MyServerComponent() {
  const session = await auth()

  if (!session) {
    return <div>Please login</div>
  }

  return (
    <div>
      <p>Welcome {session.user.username}</p>
      <p>Role: {session.user.role}</p>
    </div>
  )
}
```

### Protecting API Routes

Use the helper functions from `src/lib/auth-helpers.ts`:

#### Option 1: Require Any Authentication

```typescript
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET() {
  const session = await requireAuth()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }

  // Your API logic here
  return NextResponse.json({ data: 'protected data' })
}
```

#### Option 2: Require Specific Role

```typescript
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  // Only allow admin
  const sessionOrError = await requireRole('admin')

  // Check if it's an error response
  if (sessionOrError instanceof NextResponse) {
    return sessionOrError
  }

  const session = sessionOrError

  // Your API logic here
  return NextResponse.json({ success: true })
}
```

#### Option 3: Allow Multiple Roles

```typescript
import { requireRole } from '@/lib/auth-helpers'

export async function GET() {
  // Allow admin, guru, or petugas
  const sessionOrError = await requireRole(['admin', 'guru', 'petugas'])

  if (sessionOrError instanceof NextResponse) {
    return sessionOrError
  }

  // Your API logic here
}
```

#### Option 4: Manual Check with auth()

```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Your delete logic
}
```

## Logout Functionality

### Client Component

```tsx
'use client'
import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Logout
    </button>
  )
}
```

### Already Implemented

Logout buttons are already in:
- `AdminSidebar` component
- `GuruSidebar` component
- Mobile menu in both layouts

## Route Protection Rules

| Route Pattern | Allowed Roles | Redirect If Unauthorized |
|--------------|--------------|-------------------------|
| `/login` | Public | Dashboard (if authenticated) |
| `/admin/*` | admin | Role-based dashboard |
| `/guru/*` | guru, petugas | Role-based dashboard |
| `/siswa/*` | siswa | Role-based dashboard |
| `/api/auth/*` | Public | N/A |
| `/api/admin/*` | admin | 403 JSON error |
| `/api/guru/*` | guru, petugas, admin | 403 JSON error |
| `/api/siswa/*` | siswa, admin | 403 JSON error |
| Other routes | Authenticated users | `/login` |

## Session Configuration

- **Strategy**: JWT (stateless)
- **Max Age**: 24 hours
- **Secret**: Set in `NEXTAUTH_SECRET` env variable

## Middleware Configuration

The middleware protects all routes except:
- Static files (`_next/static`, images, etc.)
- Public assets (favicon, etc.)
- NextAuth API routes (`/api/auth/*`)

## Adding New Roles

1. Update `prisma/schema.prisma`:
```prisma
enum Role {
  admin
  guru
  siswa
  petugas
  new_role  // Add here
}
```

2. Run: `npx prisma db push`

3. Update TypeScript types in `src/auth.ts`:
```typescript
interface User {
  role: "admin" | "guru" | "siswa" | "petugas" | "new_role"
}
```

4. Add route protection in `src/middleware.ts`

5. Create seed user in `prisma/seed.ts`

## Security Best Practices

1. **Always use HTTPS in production**
2. **Set a strong NEXTAUTH_SECRET** (32+ characters random)
3. **Don't commit `.env` to git** (already in .gitignore)
4. **Use environment variables** for all secrets
5. **Validate user input** in API routes
6. **Use parameterized queries** (Prisma does this automatically)
7. **Rate limit authentication attempts** (not implemented, consider adding)

## Troubleshooting

### "NEXTAUTH_SECRET is not set"

Add to `.env`:
```
NEXTAUTH_SECRET=your-secret-here
```

### "Session is undefined"

Make sure your component is wrapped in `SessionProvider`. The root layout should include it, but if you're getting this error, wrap your app:

```tsx
// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

### Middleware not working

Make sure `src/middleware.ts` is at the root of `src/` directory (not in subdirectories).

### Can't login

1. Check database is running
2. Check user exists: `npm run db:studio`
3. Check password is hashed with bcrypt
4. Check console for errors
5. Verify `NEXTAUTH_URL` matches your dev URL

### Role-based redirect not working

Check `getDashboardForRole` function in:
- `src/middleware.ts`
- `src/app/login/page.tsx`

Make sure they match and handle all roles.

## Testing Checklist

- [ ] Login with admin credentials → redirects to `/admin/dashboard`
- [ ] Login with guru credentials → redirects to `/guru/dashboard`
- [ ] Try accessing `/admin/dashboard` as guru → blocked/redirected
- [ ] Try accessing `/guru/dashboard` as admin → blocked/redirected
- [ ] Access protected page without login → redirects to `/login`
- [ ] Logout functionality works
- [ ] Session persists on page refresh
- [ ] Protected API route returns 401 without auth
- [ ] Protected API route returns 403 with wrong role
- [ ] Protected API route works with correct role

## Default Credentials

**For Development/Testing Only:**

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| guru | guru123 | guru |
| petugas | petugas123 | petugas |

**Change these in production!**
