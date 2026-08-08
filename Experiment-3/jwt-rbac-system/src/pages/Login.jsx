import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { initialUsers } from "../data/users";
import { createMockJWT } from "../services/api";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {

    e.preventDefault();

    setError("");

    const user = initialUsers.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // Generate JWT
    const token = createMockJWT(user);

    // Store authentication information
    localStorage.setItem("token", token);

    localStorage.setItem(
      "refreshToken",
      `refresh-${user.id}-${Date.now()}`
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // Redirect according to role
    if (user.role === "admin") {
      navigate("/admin");
    }

    else if (user.role === "editor") {
      navigate("/editor");
    }

    else {
      navigate("/viewer");
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>🔐 Secure Login</h1>

        <p>JWT Authentication & RBAC</p>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        
      </div>

    </div>
  );
}

export default Login;