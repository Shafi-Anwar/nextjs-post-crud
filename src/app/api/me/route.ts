import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Ideally, JWT_SECRET should be an environment variable for security purposes
const JWT_SECRET = process.env.JWT_SECRET || 'df87dj38djf8d7df78df8f7dsf8978dsf87dsf8d7sf8d7sd'; // Replace with environment variable


//console.log('JWT_SECRET ' + JWT_SECRET);

export async function GET() {
  // Get the JWT token from cookies (Server-side)
  const token = (await cookies()).get('jwt')?.value;

  // If no token, return null user
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Return the decoded user object
    return NextResponse.json({ user: decoded });
  } catch (error) {
    // If there's an error, such as invalid token or expired token, return null user
    console.error('JWT verification failed:', error);
    return NextResponse.json({ user: null });
  }
}
