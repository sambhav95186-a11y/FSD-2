import { useState } from "react";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);

  const saveDraft = () => {
    if (!post.trim()) return;

    const newDraft = {
      platform,
      post,
    };

    setDrafts([...drafts, newDraft]);
    setPost("");
  };

  const editDraft = (index) => {
    setPlatform(drafts[index].platform);
    setPost(drafts[index].post);

    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };

  const deleteDraft = (index) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };

  return (
    <div className="app">

      {/* Composer Card */}
      <div className="card">

        <h1>📱 Social Media Post Composer</h1>
        <p>Create and manage your social media posts</p>

        <div className="form-group">
          <label>Platform</label>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option>Twitter</option>
            <option>LinkedIn</option>
            <option>Instagram</option>
          </select>
        </div>

        <div className="form-group">
          <label>Write Your Post</label>

          <textarea
            placeholder="What's on your mind?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            maxLength={280}
          ></textarea>

          <div className="toolbar">
            <div className="icons">
              😊 📷 #
            </div>

            <span>{post.length}/280</span>
          </div>
        </div>

        <button onClick={saveDraft}>
          💾 Save Draft
        </button>

      </div>

      {/* Preview Card */}
      <div className="card">

        <h2>👀 Live Preview</h2>

        <div className="preview">

          <h3>{platform}</h3>

          <p>
            {post || "Your post will appear here..."}
          </p>

        </div>

      </div>

      {/* Draft Management */}
      <div className="card">

        <h2>📂 Draft Management</h2>

        {drafts.length === 0 ? (

          <p>No Drafts Yet</p>

        ) : (

          drafts.map((draft, index) => (

            <div className="draft" key={index}>

              <h3>{draft.platform}</h3>

              <p>{draft.post}</p>

              <div className="draft-buttons">

                <button
                  className="edit"
                  onClick={() => editDraft(index)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteDraft(index)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default App;