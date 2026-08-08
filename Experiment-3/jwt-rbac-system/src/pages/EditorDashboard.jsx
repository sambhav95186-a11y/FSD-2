import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserTable from "../components/UserTable";
import { initialUsers } from "../data/users";

function EditorDashboard() {

  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState(() => {

    const saved =
      localStorage.getItem("users");

    return saved
      ? JSON.parse(saved)
      : initialUsers;
  });

  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] =
    useState(null);

  const [form, setForm] = useState(null);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const editUser = (user) => {

    setEditingUser(user);

    setForm({
      name: user.name,
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role
    });
  };

  const updateUser = (e) => {

    e.preventDefault();

    const updatedUsers =
      users.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              ...form
            }
          : user
      );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>

    user.name.toLowerCase()
      .includes(search.toLowerCase()) ||

    user.username.toLowerCase()
      .includes(search.toLowerCase()) ||

    user.email.toLowerCase()
      .includes(search.toLowerCase()) ||

    user.role.toLowerCase()
      .includes(search.toLowerCase())

  );

  return (

    <div className="dashboard">

      <header>

        <div>
          <h1>✏️ Editor Dashboard</h1>

          <p>
            Welcome, {currentUser.name}
          </p>
        </div>

        <button
          className="logout"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <div className="dashboard-content">

        <div className="info-box">
          <strong>Editor Permissions:</strong>
          <span> View</span>
          <span> Search</span>
          <span> Edit</span>
        </div>

        <div className="toolbar">

          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {editingUser && (

          <div className="form-card">

            <h2>Edit User</h2>

            <form onSubmit={updateUser}>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                required
              />

              <input
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value
                  })
                }
                required
              />

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                required
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value
                  })
                }
              >

                <option value="admin">
                  Admin
                </option>

                <option value="editor">
                  Editor
                </option>

                <option value="viewer">
                  Viewer
                </option>

              </select>

              <button type="submit">
                Update
              </button>

              <button
                type="button"
                className="cancel"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                Cancel
              </button>

            </form>

          </div>

        )}

        <UserTable
          users={filteredUsers}
          currentUser={currentUser}
          onEdit={editUser}
          onDelete={() => {}}
        />

      </div>

    </div>
  );
}

export default EditorDashboard;