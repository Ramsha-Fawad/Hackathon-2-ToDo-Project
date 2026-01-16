import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the authentication session
    // This is a placeholder implementation - actual Better Auth logout would be different
    const response = NextResponse.json({ success: true });

    // Clear auth-related cookies
    response.cookies.delete('__Secure-authjs.session-token');
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('authjs.callback-url');

    // Clear any additional auth-related cookies
    response.cookies.delete('authjs.csrf-token');
    response.cookies.delete('authjs.state');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout', success: false },
      { status: 500 }
    );
  }
}