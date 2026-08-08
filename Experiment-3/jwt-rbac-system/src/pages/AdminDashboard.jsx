import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserTable from "../components/UserTable";
import { initialUsers } from "../data/users";

function AdminDashboard() {

  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState(() => {

    const savedUsers =
      localStorage.getItem("users");

    return savedUsers
      ? JSON.parse(savedUsers)
      : initialUsers;
  });

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "viewer"
  });

  useEffect(() => {

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

  }, [users]);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleFormChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const addUser = (e) => {

    e.preventDefault();

    const newUser = {

      id:
        users.length > 0
          ? Math.max(...users.map(u => u.id)) + 1
          : 1,

      ...form
    };

    setUsers([
      ...users,
      newUser
    ]);

    resetForm();
  };

  const updateUser = (e) => {

    e.preventDefault();

    setUsers(
      users.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              ...form
            }
          : user
      )
    );

    resetForm();
  };

  const deleteUser = (id) => {

    if (
      window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {

      setUsers(
        users.filter(user => user.id !== id)
      );

    }
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

    setShowForm(true);
  };

  const resetForm = () => {

    setForm({
      name: "",
      username: "",
      password: "",
      email: "",
      role: "viewer"
    });

    setEditingUser(null);

    setShowForm(false);
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
          <h1>👑 Admin Dashboard</h1>

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

        <div className="stats">

          <div className="stat-card">
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>

          <div className="stat-card">
            <h2>
              {users.filter(
                u => u.role === "admin"
              ).length}
            </h2>
            <p>Admins</p>
          </div>

          <div className="stat-card">
            <h2>
              {users.filter(
                u => u.role === "editor"
              ).length}
            </h2>
            <p>Editors</p>
          </div>

          <div className="stat-card">
            <h2>
              {users.filter(
                u => u.role === "viewer"
              ).length}
            </h2>
            <p>Viewers</p>
          </div>

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

          <button
            className="add-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Add User
          </button>

        </div>

        {showForm && (

          <div className="form-card">

            <h2>
              {editingUser
                ? "Edit User"
                : "Add New User"}
            </h2>

            <form
              onSubmit={
                editingUser
                  ? updateUser
                  : addUser
              }
            >

              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleFormChange}
                required
              />

              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleFormChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleFormChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleFormChange}
                required
              />

              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
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
                {editingUser
                  ? "Update User"
                  : "Add User"}
              </button>

              <button
                type="button"
                className="cancel"
                onClick={resetForm}
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
          onDelete={deleteUser}
        />

      </div>

    </div>
  );
}

export default AdminDashboard;