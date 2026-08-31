import { useEffect, useState } from "react";

function PostForm({
  post,
  onAdd,
  onUpdate,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] =
    useState("Instagram");
  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPlatform(post.platform);
      setDate(post.date.slice(0, 16));
      setDescription(post.description || "");
    } else {
      setTitle("");
      setPlatform("Instagram");
      setDate("");
      setDescription("");
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date) {
      alert(
        "Please enter a title and select a date and time."
      );
      return;
    }

    const calendarEntry = {
      title,
      platform,
      date,
      description,
    };

    if (post) {
      onUpdate({
        ...post,
        ...calendarEntry,
      });
    } else {
      onAdd(calendarEntry);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="form-modal">

        <div className="modal-header">

          <div>
            <h2>
              {post
                ? "Edit Calendar Entry"
                : "Add Calendar Entry"}
            </h2>

            <p>
              {post
                ? "Modify the selected calendar entry."
                : "Add a new entry to the post calendar."}
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <label>Title</label>

          <input
            type="text"
            placeholder="Enter calendar entry title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <label>Platform</label>

          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value)
            }
          >
            <option value="Instagram">
              Instagram
            </option>

            <option value="Facebook">
              Facebook
            </option>

            <option value="LinkedIn">
              LinkedIn
            </option>

            <option value="Twitter">
              Twitter
            </option>
          </select>

          <label>Date & Time</label>

          <input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <label>Description</label>

          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {post
                ? "Save Entry"
                : "Add to Calendar"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default PostForm;