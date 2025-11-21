# Authentication Quick Start Guide

## Login Credentials

```
Admin:
  Username: admin
  Password: admin123
  Dashboard: /admin/dashboard

Guru:
  Username: guru
  Password: guru123
  Dashboard: /guru/dashboard

Petugas:
  Username: petugas
  Password: petugas123
  Dashboard: /guru/dashboard
```

## Quick Test

```bash
# 1. Start server
npm run dev

# 2. Open browser
http://localhost:3000/login

# 3. Login with admin/admin123
# 4. You'll be at /admin/dashboard
```

## Code Examples

### Protect a Page (Client Component)

```tsx
'use client'
import { useSession } from 'next-auth/react'

export default function MyPage() {
  const { data: session } = useSession()

  return <div>Welcome {session?.user?.username}</div>
}
```

### Protect a Page (Server Component)

```tsx
import { auth } from '@/auth'

export default async function MyPage() {
  const session = await auth()

  return <div>Welcome {session?.user?.username}</div>
}
```

### Protect API Route

```typescript
import { requireAuth } from '@/lib/auth-helpers'

export async function GET() {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your code here
}
```

### Protect API Route (Role-based)

```typescript
import { requireRole } from '@/lib/auth-helpers'

export async function POST() {
  const sessionOrError = await requireRole('admin')

  if (sessionOrError instanceof NextResponse) {
    return sessionOrError // Return the error
  }

  // Your code here
}
```

### Logout Button

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

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kpsipet-super-secret-key-change-in-production-please
```

## Important Files

- `src/auth.ts` - Auth config
- `src/middleware.ts` - Route protection
- `src/lib/auth-helpers.ts` - API helpers
- `src/app/login/page.tsx` - Login page
- `AUTHENTICATION.md` - Full docs

## Common Issues

**Can't login?**
- Check database is running
- Run `npm run db:seed`
- Check credentials are correct

**Session undefined?**
- Make sure SessionProvider is in layout
- Use `useSession()` in client components
- Use `await auth()` in server components

**Redirects not working?**
- Check NEXTAUTH_URL in .env
- Clear cookies and try again
- Check middleware.ts exists in src/

## Full Documentation

See `AUTHENTICATION.md` for complete documentation with all examples and advanced usage.
