'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, fetchPosts } from '../../../redux/postSlice';
import { RootState, AppDispatch } from '@/app/store';

type Props = {
  onEdit: (post: any) => void; // Accepts full post object
};

export default function PostList({ onEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  console.log(items);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">📝 Post List</h3>

      {loading && (
        <div className="text-gray-600 animate-pulse">Loading posts...</div>
      )}

      {error && (
        <div className="text-red-500 font-medium">Error: {error}</div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-gray-500 italic">No posts found. Try adding one!</p>
      )}

      <ul className="space-y-4">
        {items.map((post: any) => (
          <li
            key={post.id}
            className="flex items-center border p-4 rounded shadow-sm bg-white"
          >
            {/* Image */}
            {post.imageName && (
              <img
                src={`http://localhost:8080/uploads/${post.imageName}`}
                alt={post.title}
                className="w-28 h-20 object-cover rounded mr-4 flex-shrink-0"
              />
            )}

            {/* Post Details */}
            <div className="flex-grow min-w-0">
              <p className="text-lg font-semibold truncate">{post.title}</p>
              <p className="text-sm text-gray-500 truncate">{post.slug}</p>
              <p className="text-sm text-gray-600 italic truncate">{post.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                Category ID: {post.category_id ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-400">
                Active: {post.active === 1 ? 'Yes' : 'No'} | Featured: {post.featured === 1 ? 'Yes' : 'No'}
              </p>
            </div>

            {/* Buttons */}
            <div className="ml-4 flex flex-col space-y-2">
              <button
                onClick={() => onEdit(post)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 whitespace-nowrap"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
