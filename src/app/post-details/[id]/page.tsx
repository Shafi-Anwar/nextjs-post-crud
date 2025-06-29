'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchSinglePost } from '@/redux/homeSlice';
import { fetchCommentsByPostId, submitComment } from '@/redux/commentSlice';

export default function PostDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { singlePost: post, loading, error } = useSelector(
    (state: RootState) => state.home
  );

  const {
    comments,
    submitting,
    submitMessage,
  } = useSelector((state: RootState) => state.comments);

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Load post
  useEffect(() => {
    if (id) {
      const postId = Number(id);
      if (!isNaN(postId)) {
        dispatch(fetchSinglePost(postId));
      }
    }
  }, [id, dispatch]);

  // Load comments after post is available
  useEffect(() => {
    if (post?.id) {
      dispatch(fetchCommentsByPostId(post.id));
    }
  }, [post?.id, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    dispatch(
      submitComment({
        postId: post.id,
        fullName,
        title,
        description,
      })
    );

    // Reset form
    setFullName('');
    setTitle('');
    setDescription('');
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!post) return <p className="p-6">Post not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 📰 Post Section */}
      <h1 className="text-3xl font-bold mb-4 p-5">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        Published on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <img
        src={`http://localhost:8080/uploads/${post.imageName}`}
        alt={post.title}
        className="w-full h-96 object-cover rounded mb-6"
      />
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 💬 Approved Comments */}
      {comments.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border p-4 rounded">
                <p className="font-bold">{c.fullName}</p>
                <p className="text-gray-700 italic">{c.title}</p>
                <p>{c.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted on {new Date(c.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✍️ Comment Form */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
        {submitMessage && (
          <p
            className={`mb-4 ${
              submitMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {submitMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Name"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Comment Title"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Your Comment"
            className="w-full border px-4 py-2 rounded h-32"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
