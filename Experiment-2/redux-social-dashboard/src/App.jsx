import { useSelector, useDispatch } from "react-redux";
import {
  addPost,
  deletePost,
} from "./redux/postsSlice";

import {
  selectTotalPosts,
  selectPublishedPosts,
  selectDraftPosts,
  selectPlatforms,
  selectAddCount,
  selectDeleteCount,
} from "./redux/selectors";

function App() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.posts);

  const totalPosts = useSelector(selectTotalPosts);
  const publishedPosts = useSelector(selectPublishedPosts);
  const draftPosts = useSelector(selectDraftPosts);
  const totalPlatforms = useSelector(selectPlatforms);
  const addCount = useSelector(selectAddCount);
  const deleteCount = useSelector(selectDeleteCount);

  // Add Sample Post
  const handleAddPost = () => {
    dispatch(
      addPost({
        id: Date.now(),
        content: "New Social Media Post",
        platform: "LinkedIn",
        status: "Draft",
      })
    );
  };

  // Delete Last Post
  const handleDeletePost = () => {
    if (posts.length > 0) {
      dispatch(deletePost(posts[posts.length - 1].id));
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📱 Redux Social Media Dashboard</h1>

      <hr />

      <h2>Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Posts</h3>
          <h2>{totalPosts}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Published</h3>
          <h2>{publishedPosts}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Drafts</h3>
          <h2>{draftPosts}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Platforms</h3>
          <h2>{totalPlatforms}</h2>
        </div>
      </div>

      <h2>Activity Counter</h2>

      <p>➕ Posts Added : {addCount}</p>

      <p>➖ Posts Deleted : {deleteCount}</p>

      <p>📊 Current Posts : {totalPosts}</p>

      <button
        onClick={handleAddPost}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        ➕ Increment (Add Post)
      </button>

      <button
        onClick={handleDeletePost}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        ➖ Decrement (Delete Post)
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Posts</h2>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid gray",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{post.content}</h3>

          <p>
            <strong>Platform:</strong> {post.platform}
          </p>

          <p>
            <strong>Status:</strong> {post.status}
          </p>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  border: "1px solid gray",
  borderRadius: "10px",
  padding: "20px",
  width: "180px",
  textAlign: "center",
};

export default App;