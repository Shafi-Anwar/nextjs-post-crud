import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export type CategoryPayload = {
  name: string;
  slug: string;
  description: string;
  active: number;
  parent_id: number | null;
};

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/home-categories', getAuthHeaders());
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

// Add category
export const addCategory = createAsyncThunk(
  'categories/add',
  async (data: CategoryPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/categories',
        data,
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Add failed.');
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, ...data }: { id: number } & CategoryPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/categories/${id}`,
        data,
        getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Update failed.');
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, getAuthHeaders());
      return id;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Delete failed.');
    }
  }
);

// State structure
interface CategoryState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Failed to fetch categories.';
        state.loading = false;
      })

      // Add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
