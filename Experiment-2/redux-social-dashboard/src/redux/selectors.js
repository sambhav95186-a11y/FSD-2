import { createSelector } from "@reduxjs/toolkit";

// Base Selector
const selectPosts = (state) => state.posts.posts;

// Total Posts
export const selectTotalPosts = createSelector(
  [selectPosts],
  (posts) => posts.length
);

// Published Posts
export const selectPublishedPosts = createSelector(
  [selectPosts],
  (posts) =>
    posts.filter((post) => post.status === "Published").length
);

// Draft Posts
export const selectDraftPosts = createSelector(
  [selectPosts],
  (posts) =>
    posts.filter((post) => post.status === "Draft").length
);

// Total Platforms
export const selectPlatforms = createSelector(
  [selectPosts],
  (posts) => [...new Set(posts.map((post) => post.platform))].length
);

// Add Counter
export const selectAddCount = (state) => state.posts.addCount;

// Delete Counter
export const selectDeleteCount = (state) => state.posts.deleteCount;