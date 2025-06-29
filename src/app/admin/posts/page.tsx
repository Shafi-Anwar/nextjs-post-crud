'use client';

import { useState } from 'react';
import PostForm from './PostForm';
import PostList from './PostList';

export default function PostManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null); // full post object

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setEditingData(post);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditingData(null);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📝 Manage Posts</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Post
        </button>
      </div>

      <PostList onEdit={handleEdit} />

      <PostForm
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        editingId={editingId}
        editingData={editingData}
      />
    </div>
  );
}
