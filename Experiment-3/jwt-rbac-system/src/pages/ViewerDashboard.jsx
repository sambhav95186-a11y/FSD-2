import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserTable from "../components/UserTable";
import { initialUsers } from "../data/users";

function ViewerDashboard() {

  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("user"));

  const [users] = useState(() => {

    const saved =
      localStorage.getItem("users");

    return saved
      ? JSON.parse(saved)
      : initialUsers;
  });

  const [search, setSearch] = useState("");

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
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

          <h1>👁️ Viewer Dashboard</h1>

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

          <strong>Viewer Permissions:</strong>

          <span> View</span>

          <span> Search</span>

          <span> Read Only</span>

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

        <UserTable
          users={filteredUsers}
          currentUser={currentUser}
          onEdit={() => {}}
          onDelete={() => {}}
        />

      </div>

    </div>
  );
}

export default ViewerDashboard;