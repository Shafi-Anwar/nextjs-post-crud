import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // Send login request to Spring Boot API
    const sbRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!sbRes.ok) {
      const errorData = await sbRes.json();
      return NextResponse.json({ success: false, message: errorData.message || 'Invalid credentials' }, { status: 401 });
    }

    const data = await sbRes.json();
    const token = data.token || data.access_token; // Adjust based on Spring Boot response

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token received' }, { status: 401 });
    }

    // Set JWT in HttpOnly cookie for secure storage
    (await cookies()).set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set the token in localStorage (client-side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token); // This code will only run on the client side
    }

    // Send the token back to the client in the response
    return NextResponse.json({ success: true, token }); // Send the token correctly here
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Login error' }, { status: 500 });
  }
}
