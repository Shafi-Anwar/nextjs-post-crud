import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 📌 Types
export interface HomePost {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageName: string;
  createdAt: string;
  featured: boolean;
  categoryId: number | null;
}

interface HomeState {
  featuredPosts: HomePost[];
  latestPosts: HomePost[];
  singlePost: HomePost | null;
  categoryPosts: HomePost[];
  loading: boolean;
  error: string | null;
  categoryPostsLoading: boolean;
  categoryPostsError: string | null;
}

const initialState: HomeState = {
  featuredPosts: [],
  latestPosts: [],
  singlePost: null,
  categoryPosts: [],
  loading: false,
  error: null,
  categoryPostsLoading: false,
  categoryPostsError: null,
};

// ✅ Named Export: Fetch Featured Posts
export const fetchFeaturedPosts = createAsyncThunk<
  HomePost[],
  number,
  { rejectValue: string }
>(
  'home/fetchFeaturedPosts',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/home-posts?limit=${limit}&featured=1`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch featured posts');
    }
  }
);

// ✅ Named Export: Fetch Latest Posts
export const fetchLatestPosts = createAsyncThunk<
  HomePost[],
  number,
  { rejectValue: string }
>(
  'home/fetchLatestPosts',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/home-posts?limit=${limit}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch latest posts');
    }
  }
);

// ✅ Named Export: Fetch Single Post by ID
export const fetchSinglePost = createAsyncThunk<
  HomePost,
  number,
  { rejectValue: string }
>(
  'home/fetchSinglePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/home-posts/${postId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch single post');
    }
  }
);

// ✅ Named Export: Fetch Posts by Category ID
export const fetchPostsByCategoryId = createAsyncThunk<
  HomePost[],
  number,
  { rejectValue: string }
>(
  'home/fetchPostsByCategoryId',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/home-categories/${categoryId}/posts`
      );

      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch posts by category');
    }
  }
);

// ✅ Slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Featured Posts
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error';
        state.loading = false;
      })

      // Latest Posts
      .addCase(fetchLatestPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPosts.fulfilled, (state, action) => {
        state.latestPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchLatestPosts.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error';
        state.loading = false;
      })

      // Single Post
      .addCase(fetchSinglePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singlePost = null;
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.singlePost = action.payload;
        state.loading = false;
      })
      .addCase(fetchSinglePost.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error';
        state.loading = false;
        state.singlePost = null;
      })

      // Posts by Category ID
      .addCase(fetchPostsByCategoryId.pending, (state) => {
        state.categoryPostsLoading = true;
        state.categoryPostsError = null;
      })
      .addCase(fetchPostsByCategoryId.fulfilled, (state, action) => {
        state.categoryPosts = action.payload;
        state.categoryPostsLoading = false;
      })
      .addCase(fetchPostsByCategoryId.rejected, (state, action) => {
        state.categoryPostsError = action.payload ?? 'Unknown error';
        state.categoryPostsLoading = false;
      });
  },
});

// ✅ Default export: reducer
export default homeSlice.reducer;
