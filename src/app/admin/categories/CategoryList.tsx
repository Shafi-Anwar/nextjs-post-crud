'use client';

import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchCategories } from '@/redux/categorySlice';
import { RootState, AppDispatch } from '@/app/store';
import { useEffect } from 'react';

type Props = {
  onEdit: (category: any) => void; // Now accepts full category object
};

export default function CategoryList({ onEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">📋 Category List</h3>

      {loading && (
        <div className="text-gray-600 animate-pulse">Loading categories...</div>
      )}

      {error && (
        <div className="text-red-500 font-medium">Error: {error}</div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-gray-500 italic">No categories found. Try adding one!</p>
      )}

      <ul className="space-y-2">
        {items.map((cat: any) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border p-3 rounded shadow-sm bg-white"
          >
            <div>
              <p className="text-base font-medium">{cat.name}</p>
              <p className="text-sm text-gray-500">{cat.slug}</p>
              {cat.description && (
                <p className="text-sm text-gray-600 italic">{cat.description}</p>
              )}
              {cat.parent_id && (
                <p className="text-xs text-gray-400">Parent ID: {cat.parent_id}</p>
              )}
              <p className="text-xs text-gray-400">Active: {cat.active === 1 ? 'Yes' : 'No'}</p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => onEdit(cat)} // Pass full category object
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
