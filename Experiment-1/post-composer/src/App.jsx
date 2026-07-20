import { useState } from "react";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);

  // Character limits for each platform
  const characterLimits = {
    Twitter: 280,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const maxCharacters = characterLimits[platform];

  // Save Draft
  const saveDraft = () => {
    if (post.trim() === "") {
      alert("Please write something!");
      return;
    }

    const newDraft = {
      platform,
      post,
    };

    setDrafts([...drafts, newDraft]);
    setPost("");
  };

  // Edit Draft
  const editDraft = (index) => {
    setPlatform(drafts[index].platform);
    setPost(drafts[index].post);

    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };

  // Delete Draft
  const deleteDraft = (index) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };

  return (
    <div className="app">
      {/* Composer */}
      <div className="card">
        <h1>📱 Social Media Post Composer</h1>
        <p>Create and manage your social media posts</p>

        <div className="form-group">
          <label>Select Platform</label>

          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setPost(""); // Clear post when changing platform
            }}
          >
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        <div className="form-group">
          <label>Write Your Post</label>

          <textarea
            placeholder="What's on your mind?"
            value={post}
            maxLength={maxCharacters}
            onChange={(e) => setPost(e.target.value)}
          />

          <div className="toolbar">
            <div className="icons">
              😊 📷 #
            </div>

            <span>
              {post.length} / {maxCharacters}
            </span>
          </div>
        </div>

        <button onClick={saveDraft}>
          💾 Save Draft
        </button>
      </div>

      {/* Live Preview */}
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