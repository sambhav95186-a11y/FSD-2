import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired or unauthorized");

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        console.log("Refreshing token...");

        const newToken = createMockJWT(
          JSON.parse(localStorage.getItem("user"))
        );

        localStorage.setItem("token", newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;

        return api(error.config);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export function createMockJWT(user) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  const encode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const encodedHeader = encode(header);
  const encodedPayload = encode(payload);

  // Simulated signature for frontend experiment
  const signature = btoa(
    `${encodedHeader}.${encodedPayload}.secure-signature`
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];

    return JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );
  } catch (error) {
    return null;
  }
}

export default api;