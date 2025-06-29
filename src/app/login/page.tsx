'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
  const token = data.token;
  if (token) {
    localStorage.setItem('jwt', token); // Store the token in localStorage
    console.log('Token stored in localStorage:', token);
  }

  // Log statement to ensure router.push is being called
  console.log('Redirecting to /admin/dashboard');
  router.push('/admin/dashboard'); // Redirect to the admin dashboard
}
 else {
        // If login failed, show an error message
        alert('Login failed. Check credentials.');
      }
    } catch (error) {
      // Handle any unexpected errors
      alert('Login error. Please try again.');
    }
  };

  return (
    <div className="flex justify-center pt-20 h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg px-8 py-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-red-600 text-white hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
