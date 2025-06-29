'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLatestPosts, fetchFeaturedPosts } from '@/redux/homeSlice'
import { AppDispatch, RootState } from '@/app/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, User, Pencil, Trash2 } from 'lucide-react'

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { latestPosts, featuredPosts, loading, error } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    dispatch(fetchLatestPosts(6))
    dispatch(fetchFeaturedPosts(6))
  }, [dispatch])

  const handleEdit = (id: string) => {
    router.push(`/admin/posts/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this post?')
    if (!confirmed) return

    try {
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'DELETE',
      })
      dispatch(fetchLatestPosts(6))
      dispatch(fetchFeaturedPosts(6))
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  return (
    <main className="min-h-screen px-6 py-8 bg-gradient-to-b from-[#fef9f4] to-[#fff] dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back 👋</h1>
            <p className="text-muted-foreground mt-1">Here’s what’s happening with your posts today.</p>
          </div>
          <Link href="/admin/posts/new-post" className="flex gap-2 text-white p-5 rounded-lg bg-amber-500 hover:bg-amber-600 shadow-md">
            <Plus size={18} /> New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-900 shadow-sm border-none rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              <BookOpen className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredPosts.length + latestPosts.length}</p>
              <p className="text-xs text-muted-foreground">Auto-counted</p>
            </CardContent>
          </Card>

        </div>

        {/* Featured Posts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🌟 Featured Posts</h2>
          {featuredPosts.length === 0 && !loading ? (
            <p>No featured posts found.</p>
          ) : (
            <div className="space-y-3">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                  <CardContent className="py-4 px-5">
                    <div className="flex justify-between items-center">
                      <Link href={`/post-details/${post.id}`}>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white hover:underline">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post.id.toString())}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id.toString())}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Latest Posts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🆕 Latest Posts</h2>
          {latestPosts.length === 0 && !loading ? (
            <p>No latest posts found.</p>
          ) : (
            <div className="space-y-3">
              {latestPosts.map((post:any) => (
                <Card key={post.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                  <CardContent className="py-4 px-5">
                    <div className="flex justify-between items-center">
                      <Link href={`/post-details/${post.id}`}>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white hover:underline">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post.id.toString())}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id.toString())}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
