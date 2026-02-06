import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Clear any stored tokens (this would normally be handled by the useAuth hook)
  // For this API route, we'll just redirect to the login page
  const response = NextResponse.redirect(new URL('/login', request.url));

  // Clear any cookies if needed
  // response.cookies.set('auth_token', '', { maxAge: 0 });

  return response;
}