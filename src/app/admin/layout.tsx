'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me')
        const data = await res.json()
        setEmail(data.user?.sub || 'Admin')
      } catch {
        setEmail('Admin')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-6 h-6 text-gray-700 dark:text-gray-200" />
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Welcome, {email}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/categories"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            🗂 Categories
          </Link>
          <Link
            href="/admin/posts"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            📝 Posts
          </Link>
        </aside>

        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  )
}
