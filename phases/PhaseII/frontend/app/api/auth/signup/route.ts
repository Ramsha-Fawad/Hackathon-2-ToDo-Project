import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Placeholder API route for user signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // In a real implementation, this would register with Better Auth backend
    // For now, we'll simulate a successful registration
    const response = NextResponse.json({
      session: {
        userId: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
      },
      user: {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
      }
    });

    // Set a mock session cookie (in real implementation, Better Auth would handle this)
    response.cookies.set('authjs.session-token', 'mock-session-token-' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { message: 'Sign-up failed' },
      { status: 500 }
    );
  }
}