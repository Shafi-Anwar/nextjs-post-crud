'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory } from '@/redux/categorySlice';
import type { AppDispatch, RootState } from '@/app/store';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  editingId: number | null;
  editingData: any; // full category object or null
};

export default function CategoryForm({ isOpen, closeModal, editingId, editingData }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: categories } = useSelector((state: RootState) => state.categories);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(editingData?.name || '');
      setSlug(editingData?.slug || '');
      setDescription(editingData?.description || '');
      setActive(editingData?.active === 1);
      setParentId(editingData?.parent_id || null);
    }
  }, [isOpen, editingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description,
      active: active ? 1 : 0,
      parent_id: parentId,
    };

    if (editingId !== null) {
      dispatch(updateCategory({ id: editingId, ...payload }));
    } else {
      dispatch(addCategory(payload));
    }

    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingId !== null ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug (e.g., web-development)"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Active</span>
          </label>

          <select
            value={parentId ?? ''}
            onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">No Parent</option>
            {categories
              .filter((cat) => cat.id !== editingId)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
