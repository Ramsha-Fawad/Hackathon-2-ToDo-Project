import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/profile']; // Removed /dashboard to allow client-side auth check

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 🔑 Read cookie DIRECTLY
    const token = request.cookies.get('better-auth.session')?.value;
    // 👆 adjust name if different (see below)

    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
