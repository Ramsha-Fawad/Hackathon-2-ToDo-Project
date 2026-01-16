import { NextRequest, NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname === route ||
    request.nextUrl.pathname.startsWith(route + '/')
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check if user has a valid session
  // We'll check for the presence of auth cookies that Better Auth sets
  const authToken = request.cookies.get('__Secure-authjs.session-token')?.value ||
                   request.cookies.get('authjs.session-token')?.value;

  if (!authToken) {
    // Redirect to login if no auth token is found
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `return=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  // In a real implementation with Better Auth, we would validate the token here
  // For now, we'll assume the token exists and is valid
  // Additional validation could be done by making a request to the session API
  return NextResponse.next();
}

// Apply middleware to all routes except public ones and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};