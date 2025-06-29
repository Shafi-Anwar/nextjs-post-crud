'use client';

import { useState } from 'react';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';

export default function CategoryManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null); // full category object

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditingData(category);
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
        <h2 className="text-2xl font-bold">🛠️ Manage Categories</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Category
        </button>
      </div>

      <CategoryList onEdit={handleEdit} />

      <CategoryForm
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        editingId={editingId}
        editingData={editingData}
      />
    </div>
  );
}
