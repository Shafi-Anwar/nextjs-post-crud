import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Comment {
  id: number;
  fullName: string;
  title: string;
  description: string;
  createdAt: string;
  status: number;
  postId: number;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitMessage: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
  submitting: false,
  submitMessage: null,
};

// ✅ Fetch comments for a post
export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchByPostId',
  async (postId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get<Comment[]>(`http://localhost:8080/api/comments/post/${postId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to load comments');
    }
  }
);

// ✅ Submit a comment
export const submitComment = createAsyncThunk(
  'comments/submit',
  async (
    {
      postId,
      fullName,
      title,
      description,
    }: { postId: number; fullName: string; title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/comments`, {
        postId,
        fullName,
        title,
        description,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to submit comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentMessage(state) {
      state.submitMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔄 Fetch Comments
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // 📨 Submit Comment
      .addCase(submitComment.pending, (state) => {
        state.submitting = true;
        state.submitMessage = null;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitMessage = '✅ Comment submitted for review.';
        // Optionally add to local state (only if status === 1)
        // state.comments.unshift(action.payload);
      })
      .addCase(submitComment.rejected, (state, action) => {
        state.submitting = false;
        state.submitMessage = action.payload as string;
      });
  },
});

export const { clearCommentMessage } = commentSlice.actions;
export default commentSlice.reducer;
