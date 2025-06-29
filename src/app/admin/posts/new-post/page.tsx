'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from '@/redux/postSlice'
import { fetchCategories } from '@/redux/categorySlice'
import { useRouter } from 'next/navigation'
import type { AppDispatch, RootState } from '@/app/store'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function NewPostPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state: RootState) => state.categories
  )

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [active, setActive] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    const postData = {
      title,
      slug,
      content,
      active,
      featured,
      categoryId,
    }

    const formData = new FormData()
    formData.append('post', JSON.stringify(postData))
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      setLoading(true)
      const result = await dispatch(addPost(formData))
      if (addPost.fulfilled.match(result)) {
        toast.success('Post created successfully!')
        router.push('/admin/posts')
      } else {
        toast.error('Failed to create post.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fef9f4] to-[#fff] dark:from-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📝 New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" required />
              </div>

              <div>
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="custom-url-slug" />
              </div>

              {/* Content */}
              <div>
                <Label>Content</Label>
                <Textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content..."
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select onValueChange={(val) => setCategoryId(Number(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
               <SelectContent>
  {categoriesLoading && (
    <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
  )}
  {categoriesError && (
    <div className="px-3 py-2 text-sm text-red-500">Failed to load categories</div>
  )}
  {!categoriesLoading &&
    !categoriesError &&
    categories.map((cat) => (
      <SelectItem key={cat.id} value={String(cat.id)}>
        {cat.name}
      </SelectItem>
    ))}
</SelectContent>

                </Select>
              </div>

              <div>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <span>Featured</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
