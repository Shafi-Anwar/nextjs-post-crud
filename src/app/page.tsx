'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLatestPosts, fetchFeaturedPosts } from '@/redux/homeSlice'
import { AppDispatch, RootState } from '@/app/store'
import Link from 'next/link'

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { latestPosts, featuredPosts, loading, error } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    dispatch(fetchLatestPosts(6))
    dispatch(fetchFeaturedPosts(6))
  }, [dispatch])

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#fdfcfb] to-[#f7f7f7] dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Discover Cozy Reads 🧣
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore handpicked and fresh posts made with love. From inspiration to insights – it's all here.
          </p>
        </section>

        {loading && <p className="text-center text-blue-500">Loading posts...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Featured Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🌟 Featured Posts</h2>
          {featuredPosts.length === 0 && !loading ? (
            <p className="text-gray-500">No featured posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition p-4"
                >
                  <Link href={`/post-details/${post.id}`}>
                    <img
                      src={`http://localhost:8080/uploads/${post.imageName}`}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🆕 Latest Posts</h2>
          {latestPosts.length === 0 && !loading ? (
            <p className="text-gray-500">No latest posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition p-4"
                >
                  <Link href={`/post-details/${post.id}`}>
                    <img
                      src={`http://localhost:8080/uploads/${post.imageName}`}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
