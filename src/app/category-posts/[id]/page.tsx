'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchPostsByCategoryId } from '@/redux/homeSlice';
import Link from 'next/link';

export default function CategoryPostsPage() {
  const params = useParams();
  const categoryIdStr = params.id;         
  const categoryId = categoryIdStr ? Number(categoryIdStr) : null;
  const dispatch = useDispatch<AppDispatch>();

  const { categoryPosts, categoryPostsLoading, categoryPostsError } = useSelector(
    (state: RootState) => state.home
  );

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchPostsByCategoryId(categoryId));
    }
  }, [categoryId, dispatch]);

  if (categoryPostsLoading) return <p className="p-6">Loading posts...</p>;
  if (categoryPostsError) return <p className="p-6 text-red-600">Error: {categoryPostsError}</p>;
  if (!categoryPosts.length) return <p className="p-6">No posts found in this category.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posts in Category #{categoryId}</h1>

<ul>
  {categoryPosts.map((post) => (
    <li
      key={post.id}
      className="mb-6 border-b pb-4 flex gap-4 hover:bg-gray-50 cursor-pointer transition"
    >
      <Link href={`/post-details/${post.id}`} className="flex gap-4 items-center w-full">
        {/* Image */}
        {post.imageName && (
          <img
            src={`http://localhost:8080/uploads/${post.imageName}`}
            alt={post.title}
            className="w-32 h-20 object-cover rounded flex-shrink-0"
            loading="lazy"
          />
        )}

        <div>
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p
            className="text-gray-600 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
}
