import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: 1,
      content: "Welcome to Redux Social Media Dashboard!",
      platform: "Facebook",
      status: "Published",
    },
    {
      id: 2,
      content: "Learning Redux Toolkit is easy.",
      platform: "Instagram",
      status: "Draft",
    },
  ],

  addCount: 0,
  deleteCount: 0,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
      state.addCount++;
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );

      state.deleteCount++;
    },

    editPost: (state, action) => {
      const { id, content, platform, status } = action.payload;

      const post = state.posts.find((p) => p.id === id);

      if (post) {
        post.content = content;
        post.platform = platform;
        post.status = status;
      }
    },

    toggleStatus: (state, action) => {
      const post = state.posts.find(
        (p) => p.id === action.payload
      );

      if (post) {
        post.status =
          post.status === "Published"
            ? "Draft"
            : "Published";
      }
    },
  },
});

export const {
  addPost,
  deletePost,
  editPost,
  toggleStatus,
} = postsSlice.actions;

export default postsSlice.reducer;