'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost } from '@/redux/postSlice';
import { fetchCategories } from '@/redux/categorySlice'; // import your fetchCategories thunk
import type { AppDispatch, RootState } from '@/app/store';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  editingId: number | null;
  editingData: any; // full post object or null
};

export default function PostForm({ isOpen, closeModal, editingId, editingData }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state: RootState) => state.categories
  );

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // State to hold the selected file from input
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      setTitle(editingData?.title || '');
      setSlug(editingData?.slug || '');
      setContent(editingData?.content || '');
      setActive(editingData?.active === 1);
      setFeatured(editingData?.featured === 1);
      setCategoryId(editingData?.category_id || null);
      setImageFile(null); // reset file input when opening
    }
  }, [isOpen, editingData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (categoryId === null) {
    alert('Please select a category');
    return;
  }

  const postData = {
    title,
    slug,
    content,
    active,
    featured,
    categoryId,
  };

  const formData = new FormData();
  formData.append('post', JSON.stringify(postData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // ✅ Use thunk
  try {
    const resultAction = await dispatch(addPost(formData));
    if (addPost.fulfilled.match(resultAction)) {
      alert('Post added successfully!');
      closeModal();
    } else {
      alert('Failed to add post: ' + (resultAction.payload || 'Unknown error'));
    }
  } catch (err) {
    console.error('Dispatch error:', err);
    alert('An error occurred');
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">{editingId !== null ? 'Edit Post' : 'Add Post'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="w-full border px-3 py-2 rounded"
          />

          {/* File input for image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Show current image name if editing and no new file selected */}
          {editingData?.image_name && !imageFile && (
            <p className="text-xs text-gray-500">Current Image: {editingData.image_name}</p>
          )}

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span>Active</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span>Featured</span>
          </label>

          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categoriesLoading && <option disabled>Loading categories...</option>}
            {categoriesError && <option disabled>Error loading categories</option>}
            {!categoriesLoading &&
              categories.map((cat) => (
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
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              {editingId !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
