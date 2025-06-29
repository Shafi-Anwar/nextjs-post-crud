import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '@/redux/categorySlice';
import postReducer from '@/redux/postSlice'; // ✅ Import post reducer
import homeReducer from '@/redux/homeSlice';
import commentReducer from '@/redux/commentSlice';
export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    posts: postReducer, // ✅ Add post slice to the store
    home: homeReducer, // ✅ add this line
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
