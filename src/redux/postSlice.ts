import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export type PostPayload = {
  title: string;
  slug: string;
  content: string;
  image_name: string;
  featured: number;
  active: number;
  category_id: number;
};

// Utility function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};




// Fetch posts
export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts', getAuthHeaders());
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Failed to fetch posts.');
    }
  }
);

// Add post
export const addPost = createAsyncThunk(
  'posts/add',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwt');
      console.log('✅ Token from localStorage:', token);

      const response = await axios.post('http://localhost:8080/api/posts', data, {
        headers: {
          Authorization: `Bearer ${token}`
          // DO NOT manually set Content-Type
        }
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Add post failed.');
    }
  }
);


// Update post
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, ...data }: { id: number } & PostPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/posts/${id}`, data, getAuthHeaders());
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Update post failed.');
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: number, { rejectWithValue }) => {
    console.log('🚀 Deleting post with ID:', id);
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, getAuthHeaders());
      return id;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Delete post failed.');
    }
  }
);

// State
interface PostState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  items: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Error loading posts.';
        state.loading = false;
      })

      // Add
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      });
  },
});

export default postSlice.reducer;
